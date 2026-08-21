/**
 * Database module — lazy-loads mysql2/promise so the server never crashes
 * at import time if the native binary is missing or incompatible.
 * On Wasmer, mysql2 native binaries may not match the container's architecture,
 * so we defer the import to first query.
 */

let poolPromise: Promise<import('mysql2/promise').Pool> | null = null;

function createPool(): Promise<import('mysql2/promise').Pool> {
  return import('mysql2/promise').then((mysql) => {
    const DB_HOST = process.env.DB_HOST || '127.0.0.1';
    const DB_PORT = Number(process.env.DB_PORT || 3306);
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
  try {
    const p = await getPool();
    const conn = await p.getConnection();
    console.log('[db] ✅ Connection successful');
    conn.release();
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[db] ❌ Connection failed: ${msg}`);
    return false;
  }
}

export default {
  query: (sql: string, params?: unknown[]) => query(sql, params),
  getConnection: () => getPool().then((p) => p.getConnection()),
};
