'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';

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
              <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
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
              required
            />

            <div className="text-right">
              <Link href="/forgot-password" className="text-sm text-mzys-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
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
