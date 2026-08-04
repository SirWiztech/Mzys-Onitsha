'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Link from 'next/link';
import type { Branch } from '@/lib/types';

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    branchId: '',
    cherubSeraph: '',
    occupation: '',
    address: '',
  });
  const [branches, setBranches] = useState<Branch[]>([]);
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/branches')
      .then((res) => res.json())
      .then((data) => setBranches(data));
  }, []);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const sendOtp = async () => {
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Registration failed');
        return;
      }
      setStep('otp');
      setInfo(data.message || 'A verification code has been sent to your email.');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    await sendOtp();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Verification failed');
        return;
      }
      router.push('/login?registered=true');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mzys-gray-50 px-4 pt-28 pb-16">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-mzys-navy">Join MZYS</h1>
          <p className="mt-2 text-sm text-mzys-gray-500">
            {step === 'form'
              ? 'Create your membership account'
              : `Enter the code sent to ${form.email}`}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-mzys-gray-200 shadow-sm p-6">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="firstName"
                  label="First Name"
                  placeholder="John"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  required
                />
                <Input
                  id="lastName"
                  label="Last Name"
                  placeholder="Doe"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  required
                />
              </div>

              <Input
                id="email"
                label="Email"
                type="email"
                autoComplete="username"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                required
              />

              <Input
                id="phone"
                label="Phone Number"
                placeholder="+234 XXX XXX XXXX"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="dateOfBirth"
                  label="Date of Birth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => update('dateOfBirth', e.target.value)}
                  required
                />
                <Select
                  id="gender"
                  label="Gender"
                  value={form.gender}
                  onChange={(e) => update('gender', e.target.value)}
                  options={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                  ]}
                  placeholder="Select"
                  required
                />
              </div>

              <Select
                id="branchId"
                label="Branch"
                value={form.branchId}
                onChange={(e) => update('branchId', e.target.value)}
                options={branches.map((b) => ({ value: b.id, label: b.name }))}
                placeholder="Select your branch"
                required
              />

              <Select
                id="cherubSeraph"
                label="Band (Cherub / Seraph, Optional)"
                value={form.cherubSeraph}
                onChange={(e) => update('cherubSeraph', e.target.value)}
                options={[
                  { value: 'cherub', label: 'Cherub' },
                  { value: 'seraph', label: 'Seraph' },
                ]}
                placeholder="Select if applicable"
              />

              <Input
                id="occupation"
                label="Occupation (your business / profession)"
                placeholder="e.g. Fashion Designer, Trader"
                value={form.occupation}
                onChange={(e) => update('occupation', e.target.value)}
              />

              <Input
                id="address"
                label="Address"
                placeholder="Your address"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => update('password', e.target.value)}
                  required
                />
                <Input
                  id="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Repeat password"
                  value={form.confirmPassword}
                  onChange={(e) => update('confirmPassword', e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending Code...' : 'Continue'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
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

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Create Account'}
              </Button>

              <div className="flex items-center justify-between text-sm text-mzys-gray-500">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-mzys-primary hover:underline font-medium"
                >
                  Back to form
                </button>
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="text-mzys-primary hover:underline font-medium disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 text-center text-sm text-mzys-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-mzys-primary hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
