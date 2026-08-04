'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to send code');
        return;
      }
      setStep('reset');
      setInfo(data.message || 'A reset code has been sent to your email.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Password reset failed');
        return;
      }
      router.push('/login?reset=true');
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
          <h1 className="text-2xl font-bold text-mzys-navy">Forgot Password</h1>
          <p className="mt-2 text-sm text-mzys-gray-500">
            {step === 'email'
              ? 'Enter your email to receive a reset code'
              : `Enter the code sent to ${email}`}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-mzys-gray-200 shadow-sm p-6">
          {step === 'email' ? (
            <form onSubmit={sendCode} className="space-y-4">
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending Code...' : 'Send Code'}
              </Button>
            </form>
          ) : (
            <form onSubmit={resetPassword} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              {info && (
                <div className="bg-blue-50 text-blue-700 text-sm px-4 py-3 rounded-lg">
                  {info}
                </div>
              )}

              <Input
                id="code"
                label="Verification Code"
                type="text"
                inputMode="numeric"
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />

              <Input
                id="newPassword"
                label="New Password"
                type="password"
                autoComplete="new-password"
                placeholder="Min. 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                id="confirmPassword"
                label="Confirm New Password"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-center text-sm text-mzys-primary hover:underline font-medium"
              >
                Back
              </button>
            </form>
          )}

          <div className="mt-4 text-center text-sm text-mzys-gray-500">
            Remembered it?{' '}
            <Link href="/login" className="text-mzys-primary hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
