import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { createRequire } from 'node:module';
import type { RowDataPacket } from 'mysql2/promise';

interface CountRow extends RowDataPacket {
  n: number;
}

const TABLES = [
  'users',
  'members',
  'branches',
  'events',
  'finances',
  'complaints',
  'leadership',
  'products',
  'comments',
  'likes',
  'notifications',
  'otps',
];

function findSubdir(name: string): string | null {
  const candidates = [
    join(/*turbopackIgnore: true*/ process.cwd(), name),
    join(/*turbopackIgnore: true*/ process.cwd(), 'mzys-onitsha', name),
  ];
  for (const dir of candidates) {
    if (existsSync(dir)) return dir;
  }
  return null;
}

type MysqlModule = typeof import('mysql2/promise');

let mysqlModule: MysqlModule | null = null;

/**
 * Runtime require of mysql2 with a bundler-opaque specifier — same rationale as
 * src/lib/db.ts: Turbopack's hashed external require ("mysql2-<hash>/promise")
 * fails in the Anybuild/next-bundle deploy environment.
 */
function loadMysql(): MysqlModule {
  if (mysqlModule) return mysqlModule;
  const specifier = 'mysql2' + '/promise'; // string concat defeats static analysis
  const errors: string[] = [];
  const bases = [import.meta.url, process.cwd() + '/', process.cwd() + '/.next-bundle/'];
  for (const base of bases) {
    try {
      mysqlModule = createRequire(base)(specifier) as MysqlModule;
      return mysqlModule;
    } catch (err) {
      errors.push(err instanceof Error ? err.message : String(err));
    }
  }
  throw new Error(`Failed to load mysql2/promise: ${errors.join(' | ')}`);
}

export async function runMigrations(): Promise<void> {
  // Runtime require so bundlers never rewrite this to a hashed external chunk.
  const mysql = loadMysql();

  const dbName = process.env.DB_NAME || 'mzys_onitsha';
  const host = process.env.DB_HOST || '127.0.0.1';
  // Match db.ts: Wasmer managed DBs listen on an assigned port, not 3306.
  const port = Number(process.env.DB_PORT || (/wasmernet\.com$/i.test(host) ? 20184 : 3306));
  const user = process.env.DB_USERNAME || 'root';
  const password = process.env.DB_PASSWORD || '';

  console.log(`[migrations] Connecting → host=${host} port=${port} user=${user} db=${dbName}`);

  const conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true,
  });

  try {
    try {
      await conn.query(`USE \`${dbName}\``);
    } catch (useErr) {
      const e = useErr as { errno?: number; code?: string; sqlMessage?: string };
      if (e.code === 'ER_BAD_DB_ERROR') {
        const created = await tryCreateDatabase(conn, mysql, dbName);
        if (!created) {
          console.error(`[migrations] Database "${dbName}" does not exist and could not be created.`);
          throw useErr;
        }
      } else {
        console.error(`[migrations] Cannot access database "${dbName}" as user "${user}".`);
        if (e.sqlMessage) console.error(`[migrations] ${e.sqlMessage}`);
        throw useErr;
      }
    }
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`schema_migrations\` (
        \`id\` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
        \`name\` VARCHAR(191) NOT NULL,
        \`applied_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_schema_migrations_name\` (\`name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const migrationsDir = findSubdir('migrations');
    if (migrationsDir) {
      const files = readdirSync(migrationsDir)
        .filter((f) => f.endsWith('.sql'))
        .sort();

      for (const file of files) {
        const [applied] = await conn.query<CountRow[]>(
          `SELECT COUNT(*) AS n FROM \`schema_migrations\` WHERE \`name\` = ?`,
          [file]
        );
        if (Number(applied[0]?.n) > 0) continue;

        const sql = readFileSync(join(migrationsDir, file), 'utf-8');
        await conn.query('START TRANSACTION');
        try {
          await conn.query(sql);
          await conn.query(
            `INSERT INTO \`schema_migrations\` (\`name\`) VALUES (?)`,
            [file]
          );
          await conn.query('COMMIT');
          console.log(`[migrations] Applied ${file}`);
        } catch (err) {
          await conn.query('ROLLBACK');
          throw err;
        }
      }
    } else {
      console.warn('[migrations] No migrations directory found, skipping SQL migrations');
    }

    const dataDir = findSubdir('data');
    if (!dataDir) {
      console.warn('[migrations] No data directory found, skipping seed');
    }
    for (const table of TABLES) {
      if (!dataDir) continue;
      const file = join(dataDir, `${table}.json`);
      if (!existsSync(file)) continue;

      const [countRows] = await conn.query<CountRow[]>(
        `SELECT COUNT(*) AS n FROM \`${table}\``
      );
      const n = Number(countRows[0]?.n);
      if (n > 0) continue;

      let rows: unknown[];
      try {
        rows = JSON.parse(readFileSync(file, 'utf-8'));
      } catch {
        continue;
      }
      if (!Array.isArray(rows) || rows.length === 0) continue;

      const values = rows.map(() => '(?, ?)').join(', ');
      const params: unknown[] = [];
      for (const r of rows as { id?: string }[]) params.push(r.id || '', JSON.stringify(r));
      await conn.query(
        `INSERT INTO \`${table}\` (\`id\`, \`data\`) VALUES ${values}`,
        params
      );
      console.log(`[migrations] Seeded ${rows.length} rows into ${table}`);
    }

    console.log('[migrations] Database ready');
  } finally {
    await conn.end();
  }
}

async function tryCreateDatabase(
  conn: { query: (sql: string) => Promise<unknown> },
  mysql: typeof import('mysql2/promise'),
  dbName: string
): Promise<boolean> {
  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    );
    await conn.query(`USE \`${dbName}\``);
    return true;
  } catch {
    return false;
  }
}
