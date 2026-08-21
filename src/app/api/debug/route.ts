import { NextResponse } from 'next/server';

export async function GET() {
  const debug: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    nextRuntime: process.env.NEXT_RUNTIME,
    env: {
      DB_HOST: process.env.DB_HOST ? '(set)' : '(MISSING)',
      DB_PORT: process.env.DB_PORT || '(not set)',
      DB_USERNAME: process.env.DB_USERNAME ? '(set)' : '(MISSING)',
      DB_PASSWORD: process.env.DB_PASSWORD ? '(set)' : '(MISSING)',
      DB_NAME: process.env.DB_NAME ? '(set)' : '(MISSING)',
      BREVO_API_KEY: process.env.BREVO_API_KEY ? '(set)' : '(MISSING)',
      SESSION_SECRET: process.env.SESSION_SECRET ? '(set)' : '(MISSING)',
    },
    dbTest: null as unknown,
  };

  // Test DB connection
  try {
    const { default: pool } = await import('@/lib/db');
    const conn = await pool.getConnection();
    const [rows] = await conn.query('SELECT 1 AS ok');
    conn.release();
    debug.dbTest = { connected: true, result: rows };
  } catch (err) {
    debug.dbTest = {
      connected: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }

  return NextResponse.json(debug, { status: 200 });
}
