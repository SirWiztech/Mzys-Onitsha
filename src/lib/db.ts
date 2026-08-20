import mysql from 'mysql2/promise';

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USERNAME || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'mzys_onitsha';

console.log(`[db] Creating pool → host=${DB_HOST} port=${DB_PORT} user=${DB_USER} db=${DB_NAME}`);

const pool = mysql.createPool({
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
  // Enable connect timeout so we fail fast instead of hanging
  connectTimeout: 10000,
});

export async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  try {
    const [rows] = await pool.query(sql, params);
    return rows as T[];
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[db] Query failed: ${sql.slice(0, 120)}...`);
    console.error(`[db] Error: ${msg}`);
    throw err;
  }
}

export async function queryOne<T>(sql: string, params: unknown[] = []): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}

/** Test the DB connection — returns true if connected, false otherwise */
export async function testConnection(): Promise<boolean> {
  try {
    const conn = await pool.getConnection();
    console.log('[db] ✅ Connection successful');
    conn.release();
    return true;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[db] ❌ Connection failed: ${msg}`);
    return false;
  }
}

export default pool;
