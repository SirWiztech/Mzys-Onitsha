/**
 * In-memory brute-force protection for the login endpoint.
 *
 * After MAX_FAILED_ATTEMPTS failed logins for the same email, that email is
 * locked out for LOCKOUT_DURATION_MS. State lives in the server process, so it
 * resets on redeploy/restart and is per-instance on multi-instance hosts —
 * an acceptable trade-off here versus the cost of DB writes on every login.
 */

export const MAX_FAILED_ATTEMPTS = 3;
export const LOCKOUT_DURATION_MS = 3 * 60 * 1000;

interface FailedLogin {
  count: number;
  /** Timestamp (ms) of the first failure in the current unresolved window. */
  windowStart: number;
  /** Timestamp (ms) until which the email is locked out; 0 when not locked. */
  lockedUntil: number;
}

const attempts = new Map<string, FailedLogin>();

function normalizeEmail(email: string): string {
  return (email || '').trim().toLowerCase();
}

export function getLoginLockoutMs(email: string): number {
  const entry = attempts.get(normalizeEmail(email));
  if (!entry) return 0;
  const remaining = entry.lockedUntil - Date.now();
  return remaining > 0 ? remaining : 0;
}

export function recordFailedLogin(email: string): number {
  const key = normalizeEmail(email);
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry) {
    attempts.set(key, { count: 1, windowStart: now, lockedUntil: 0 });
    return MAX_FAILED_ATTEMPTS - 1;
  }

  // A prior lockout expired — start a fresh failure window.
  if (entry.lockedUntil > 0 && entry.lockedUntil <= now) {
    attempts.set(key, { count: 1, windowStart: now, lockedUntil: 0 });
    return MAX_FAILED_ATTEMPTS - 1;
  }

  // Forget stale failures so spaced-out attempts don't accumulate forever.
  if (now - entry.windowStart > LOCKOUT_DURATION_MS) {
    attempts.set(key, { count: 1, windowStart: now, lockedUntil: 0 });
    return MAX_FAILED_ATTEMPTS - 1;
  }

  entry.count += 1;
  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION_MS;
    return 0;
  }
  return MAX_FAILED_ATTEMPTS - entry.count;
}

export function clearFailedLogins(email: string): void {
  attempts.delete(normalizeEmail(email));
}

export function loginLockoutRemainingSeconds(email: string): number {
  return Math.ceil(getLoginLockoutMs(email) / 1000);
}
