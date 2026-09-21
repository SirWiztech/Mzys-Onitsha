/**
 * Database module — lazy-loads mysql2/promise so the server never crashes
 * at import time if the native binary is missing or incompatible.
 * On Wasmer, mysql2 native binaries may not match the container's architecture,
 * so we defer the import to first query.
 */

import { createRequire } from 'node:module';

let poolPromise: Promise<import('mysql2/promise').Pool> | null = null;

type MysqlModule = typeof import('mysql2/promise');

let mysqlModule: MysqlModule | null = null;

/**
 * Load mysql2 at runtime via createRequire with an obfuscated specifier so the
 * bundler cannot rewrite it. Turbopack's external-chunk require of a hashed
 * specifier ("mysql2-<hash>/promise") breaks in the Anybuild/next-bundle deploy
 * environment, so we bypass bundler externals entirely and resolve the package
 * from node_modules the same way plain Node would.
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

function createPool(): Promise<import('mysql2/promise').Pool> {
  return Promise.resolve(loadMysql()).then((mysql) => {
    const DB_HOST = process.env.DB_HOST || '127.0.0.1';
    // Wasmer Edge managed databases listen on a custom assigned port (e.g. 20184),
    // NOT 3306. If DB_PORT is missing but the host is a Wasmer DB endpoint,
    // fall back to the Wasmer port so a misconfigured deployment still connects.
    const DEFAULT_PORT = /wasmernet\.com$/i.test(DB_HOST) ? 20184 : 3306;
    const DB_PORT = Number(process.env.DB_PORT || DEFAULT_PORT);
    const DB_USER = process.env.DB_USERNAME || 'root';
    const DB_PASSWORD = process.env.DB_PASSWORD || '';
    const DB_NAME = process.env.DB_NAME || 'mzys_onitsha';

    console.log(`[db] Creating pool → host=${DB_HOST} port=${DB_PORT} user=${DB_USER} db=${DB_NAME}`);

    return mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60000,
      queueLimit: 0,
      charset: 'utf8mb4',
      dateStrings: true,
      connectTimeout: 10000,
    });
  });
}

async function getPool(): Promise<import('mysql2/promise').Pool> {
  if (!poolPromise) poolPromise = createPool();
  return poolPromise;
}

export async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const p = await getPool();
  const [rows] = await p.query(sql, params);
  return rows as T[];
}

export async function queryOne<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

export async function testConnection(): Promise<boolean> {
  const result = await testConnectionDetailed();
  return result.ok;
}

/** Like testConnection but returns the underlying error for diagnostics. */
export async function testConnectionDetailed(): Promise<{
  ok: boolean;
  error: string | null;
  code: string | null;
}> {
  try {
    const p = await getPool();
    const conn = await p.getConnection();
    console.log('[db] ✅ Connection successful');
    conn.release();
    return { ok: true, error: null, code: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const code = (err as { code?: string } | null)?.code ?? null;
    console.error(`[db] ❌ Connection failed: ${code ? `${code} ` : ''}${msg}`);
    return { ok: false, error: msg, code };
  }
}

export default {
  query: (sql: string, params?: unknown[]) => query(sql, params),
  getConnection: () => getPool().then((p) => p.getConnection()),
};
