export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  // Log critical env vars (masked) to debug Wasmer deployment issues
  console.log('[instrumentation] Runtime: nodejs');
  console.log('[instrumentation] DB_HOST:', process.env.DB_HOST ? '(set)' : '(MISSING — using default 127.0.0.1)');
  console.log('[instrumentation] DB_PORT:', process.env.DB_PORT || '(not set, using 3306)');
  console.log('[instrumentation] DB_USERNAME:', process.env.DB_USERNAME ? '(set)' : '(MISSING — using default root)');
  console.log('[instrumentation] DB_PASSWORD:', process.env.DB_PASSWORD ? '(set)' : '(MISSING — using empty string)');
  console.log('[instrumentation] DB_NAME:', process.env.DB_NAME || '(not set, using mzys_onitsha)');
  console.log('[instrumentation] BREVO_API_KEY:', process.env.BREVO_API_KEY ? '(set)' : '(MISSING)');
  console.log('[instrumentation] SESSION_SECRET:', process.env.SESSION_SECRET ? '(set)' : '(MISSING)');

  try {
    const { runMigrations } = await import('./lib/migrations');
    await runMigrations();
  } catch (err) {
    // Log the full error but DO NOT re-throw — a migration failure
    // should not crash the entire server. The app can still serve
    // pages; writes to missing tables will fail gracefully.
    console.error('[instrumentation] ⚠️ Database migration failed — app will start without DB:');
    if (err instanceof Error) {
      console.error('[instrumentation] Error name:', err.name);
      console.error('[instrumentation] Error message:', err.message);
      if (err.stack) console.error('[instrumentation] Stack:', err.stack);
    } else {
      console.error('[instrumentation] Error:', err);
    }
    console.error('[instrumentation] Fix: check DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME env vars in your Wasmer dashboard');
  }
}
