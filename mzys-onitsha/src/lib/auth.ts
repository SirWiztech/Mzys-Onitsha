import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { readData, writeData } from './data';
import type { User } from './types';

const USERS_FILE = 'users.json';
const SESSION_COOKIE = 'mzys-session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'mzys-dev-secret-change-in-production';

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256')
    .update(salt + password)
    .digest('hex');
  return `${salt}:${hash}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [salt, hash] = stored.split(':');
  const verify = createHash('sha256')
    .update(salt + password)
    .digest('hex');
  return timingSafeEqual(Buffer.from(hash), Buffer.from(verify));
}

function createSessionToken(userId: string): string {
  const payload = JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  const encoded = Buffer.from(payload).toString('base64url');
  const signature = createHash('sha256')
    .update(encoded + SESSION_SECRET)
    .digest('base64url');
  return `${encoded}.${signature}`;
}

function verifySessionToken(token: string): { userId: string } | null {
  try {
    const [encoded, signature] = token.split('.');
    const expected = createHash('sha256')
      .update(encoded + SESSION_SECRET)
      .digest('base64url');
    if (signature !== expected) return null;
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString());
    if (payload.exp < Date.now()) return null;
    return { userId: payload.userId };
  } catch {
    return null;
  }
}

export async function setSession(userId: string): Promise<void> {
  const token = createSessionToken(userId);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60,
  });
}

export async function getSession(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = verifySessionToken(token);
  if (!payload) return null;
  const users = await readData<User>(USERS_FILE);
  return users.find((u) => u.id === payload.userId) ?? null;
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<User | null> {
  const users = await readData<User>(USERS_FILE);
  const user = users.find((u) => u.email === email);
  if (!user) return null;
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;
  return user;
}
