/**
 * Database module.
 *
 * mysql2 is imported STATICALLY on purpose: it is pure JS (no native binaries),
 * and bundling it inline into the server chunks makes the deployed bundle
 * self-contained. (Runtime resolution — dynamic import() or createRequire —
 * breaks in the Anybuild/next-bundle deploy environment: the build-time
 * optimizer prunes the package from node_modules and hashed external chunks
 * ("mysql2-<hash>/promise") fail to resolve.)
 */

import mysql from 'mysql2/promise';

let poolPromise: Promise<import('mysql2/promise').Pool> | null = null;

function createPool(): Promise<import('mysql2/promise').Pool> {
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

  return Promise.resolve(
    mysql.createPool({
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
      // Keep long-lived pooled connections healthy across NAT/idle timeouts —
      // without this, connections idle >60s get reset (ECONNRESET) on first use.
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    })
  );
}

async function getPool(): Promise<import('mysql2/promise').Pool> {
  if (!poolPromise) poolPromise = createPool();
  return poolPromise;
}

// Transient connection-class errors: a stale pooled connection was reset by the
// network. The pool discards the dead connection, so one retry succeeds.
const RETRYABLE_CODES = new Set(['ECONNRESET', 'EPIPE', 'ETIMEDOUT', 'PROTOCOL_CONNECTION_LOST']);

export async function query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  const p = await getPool();
  try {
    const [rows] = await p.query(sql, params);
    return rows as T[];
  } catch (err) {
    const code = (err as { code?: string } | null)?.code ?? '';
    if (RETRYABLE_CODES.has(code)) {
      console.warn(`[db] ${code} on pooled connection — retrying once`);
      const [rows] = await p.query(sql, params);
      return rows as T[];
    }
    throw err;
  }
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
