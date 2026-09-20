import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';
import { readData } from '@/lib/data';

export const dynamic = 'force-dynamic';

// Simple deployment diagnostic: confirms whether the app can reach MySQL,
// whether migrations ran (tables exist), and whether the users table has
// been seeded. Helps tell "wrong password" apart from "database not set up".
export async function GET() {
  const dbUp = await testConnection();

  let tablesOk = false;
  let userCount: number | null = null;
  let memberCount: number | null = null;
  let error: string | null = null;

  if (dbUp) {
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
    status: dbUp ? (tablesOk ? 'ok' : 'db-missing-tables') : 'db-unreachable',
    db: {
      reachable: dbUp,
      host: process.env.DB_HOST || '127.0.0.1',
      database: process.env.DB_NAME || 'mzys_onitsha',
      tablesOk,
    },
    seed: { users: userCount, members: memberCount },
    error,
    timestamp: new Date().toISOString(),
  });
}
