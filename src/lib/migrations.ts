import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import mysql from 'mysql2/promise';
import type { RowDataPacket } from 'mysql2';

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

export async function runMigrations(): Promise<void> {
  const dbName = process.env.DB_NAME || 'mzys_onitsha';
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = Number(process.env.DB_PORT || 3306);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';

  const conn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    multipleStatements: true,
  });

  try {
    try {
      await conn.query(
        `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
      await conn.query(`USE \`${dbName}\``);
    } catch (err) {
      const e = err as { errno?: number; code?: string; sqlMessage?: string };
      console.error(`[migrations] Cannot access database "${dbName}" as user "${user}".`);
      console.error(
        `[migrations] Fix: create the database and grant "${user}" all privileges on it in your Pxxl database panel.`
      );
      if (e.sqlMessage) console.error(`[migrations] ${e.sqlMessage}`);
      throw err;
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
        const [applied] = await conn.query<RowDataPacket[]>(
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

      const [countRows] = await conn.query<RowDataPacket[]>(
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
