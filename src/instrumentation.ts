export async function register() {
  if (process.env.NEXT_RUNTIME === 'edge') {
    return;
  }
  const { runMigrations } = await import('./lib/migrations');
  try {
    await runMigrations();
  } catch (err) {
    console.error(
      '[migrations] Failed to initialize database:',
      err instanceof Error ? err.message : err
    );
    throw err;
  }
}
