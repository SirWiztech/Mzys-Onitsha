import { NextResponse } from 'next/server';
import { testConnectionDetailed } from '@/lib/db';
import { readData } from '@/lib/data';

export const dynamic = 'force-dynamic';

// Simple deployment diagnostic: confirms whether the app can reach MySQL,
// whether migrations ran (tables exist), and whether the users table has
// been seeded. Helps tell "wrong password" apart from "database not set up".
export async function GET() {
  const conn = await testConnectionDetailed();

  let tablesOk = false;
  let userCount: number | null = null;
  let memberCount: number | null = null;
  let error = conn.error;

  if (conn.ok) {
    try {
      const rows = await readData<{ id: string }>('users.json');
      userCount = rows.length;
      tablesOk = true;
      const members = await readData<{ id: string }>('members.json');
      memberCount = members.length;
    } catch (err) {
      error = err instanceof Error ? err.message : String(err);
    }
  }

  return NextResponse.json({
    status: conn.ok ? (tablesOk ? 'ok' : 'db-missing-tables') : 'db-unreachable',
    db: {
      reachable: conn.ok,
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      database: process.env.DB_NAME || 'mzys_onitsha',
      user: process.env.DB_USERNAME || 'root',
      hasPassword: Boolean(process.env.DB_PASSWORD),
      tablesOk,
    },
    seed: { users: userCount, members: memberCount },
    error,
    errorCode: conn.code,
    timestamp: new Date().toISOString(),
  });
}
