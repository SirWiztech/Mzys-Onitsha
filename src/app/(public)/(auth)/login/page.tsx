'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Link from 'next/link';

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // Epoch-ms timestamp until which login is locked; null when not locked.
  const [lockoutEndsAt, setLockoutEndsAt] = useState<number | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';

  // Live countdown while locked out; clears itself when time is up.
  useEffect(() => {
    if (lockoutEndsAt === null) return;
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((lockoutEndsAt - Date.now()) / 1000));
      setLockoutRemaining(remaining);
      if (remaining === 0) setLockoutEndsAt(null);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lockoutEndsAt]);

  const locked = lockoutEndsAt !== null && lockoutRemaining > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.status === 429) {
        const retrySeconds = typeof data.retryAfterSeconds === 'number'
          ? data.retryAfterSeconds
          : 180;
        setLockoutEndsAt(Date.now() + retrySeconds * 1000);
        setLockoutRemaining(retrySeconds);
        setError(data.error || 'Too many failed attempts. Please wait before trying again.');
        return;
      }

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mzys-gray-50 px-4 pt-28 pb-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/images/main-mzys-logo.png"
            alt="MZYS"
            className="w-32 h-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-mzys-navy">Welcome Back</h1>
          <p className="mt-2 text-sm text-mzys-gray-500">
            Sign in to your MZYS account
          </p>
        </div>

        <div className="bg-white rounded-xl border border-mzys-gray-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className={`text-sm px-4 py-3 rounded-lg ${
                  locked
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {error}
              </div>
            )}
            {locked && (
              <div className="text-sm px-4 py-3 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
                Account temporarily locked. You can try again in{' '}
                <span className="font-semibold tabular-nums">
                  {formatCountdown(lockoutRemaining)}
                </span>
                .
              </div>
            )}

            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="username"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={locked}
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={locked}
              required
            />

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-mzys-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading || locked}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-mzys-gray-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-mzys-primary hover:underline font-medium">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
