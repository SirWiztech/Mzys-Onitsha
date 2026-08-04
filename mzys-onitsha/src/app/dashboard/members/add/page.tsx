'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import type { Branch } from '@/lib/types';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function AddMemberPage() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '',
    dateOfBirth: '', gender: '', branchId: '',
    cherubSeraph: '', occupation: '', address: '',
  });

  useEffect(() => {
    fetch('/api/branches')
      .then((r) => r.json())
      .then(setBranches);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.id]: e.target.value }));
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

    setSaving(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          branchId: form.branchId,
          cherubSeraph: form.cherubSeraph || null,
          occupation: form.occupation,
          address: form.address,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to register member');
        return;
      }

      router.push('/dashboard/members');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard/members"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Register New Member</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create a new member account and profile
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Personal Information */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-blue-600" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="firstName"
                label="First Name"
                placeholder="John"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <Input
                id="lastName"
                label="Last Name"
                placeholder="Doe"
                value={form.lastName}
                onChange={handleChange}
                required
              />
              <Input
                id="email"
                label="Email"
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                id="phone"
                label="Phone"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                value={form.phone}
                onChange={handleChange}
              />
              <Input
                id="dateOfBirth"
                label="Date of Birth"
                type="date"
                value={form.dateOfBirth}
                onChange={handleChange}
              />
              <Select
                id="gender"
                label="Gender"
                value={form.gender}
                onChange={handleChange}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' },
                ]}
                placeholder="Select gender"
                required
              />
            </div>
          </div>

          {/* Account Credentials */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">Account Credentials</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="password"
                label="Password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
              <Input
                id="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* MZYS Details */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-4">MZYS Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                id="branchId"
                label="Branch"
                value={form.branchId}
                onChange={handleChange}
                options={branches.map((b) => ({ value: b.id, label: b.name }))}
                placeholder="Select branch"
                required
              />
              <Select
                id="cherubSeraph"
                label="Band"
                value={form.cherubSeraph}
                onChange={handleChange}
                options={[
                  { value: '', label: 'None' },
                  { value: 'cherub', label: 'Cherub' },
                  { value: 'seraph', label: 'Seraph' },
                ]}
              />
              <Input
                id="occupation"
                label="Occupation"
                placeholder="e.g. Teacher, Engineer"
                value={form.occupation}
                onChange={handleChange}
              />
              <Input
                id="address"
                label="Address"
                placeholder="Residential address"
                value={form.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <Link href="/dashboard/members">
              <Button type="button" variant="ghost">Cancel</Button>
            </Link>
            <Button type="submit" disabled={saving}>
              {saving ? 'Registering...' : 'Register Member'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}
