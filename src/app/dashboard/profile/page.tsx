'use client';

import { useState, useEffect, useRef } from 'react';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import * as Separator from '@radix-ui/react-separator';
import { Camera, Save, Package, Pencil, Trash2, Plus } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/ui/toast';
import type { Member, Branch, Product } from '@/lib/types';

export default function ProfilePage() {
  const { addToast } = useToast();
  const [member, setMember] = useState<Member | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', phone: '', dateOfBirth: '',
    gender: '', occupation: '', address: '', cherubSeraph: '',
  });

  const load = async () => {
    const [m, b, auth] = await Promise.all([
      fetch('/api/members').then((r) => r.json()),
      fetch('/api/branches').then((r) => r.json()),
      fetch('/api/auth').then((r) => r.json()),
    ]);
    setBranches(b);
    const userId = auth.user?.memberId;
    if (userId) {
      const myProfile = (m as Member[]).find((x: Member) => x.id === userId);
      if (myProfile) {
        setMember(myProfile);
        setForm({
          firstName: myProfile.firstName,
          lastName: myProfile.lastName,
          phone: myProfile.phone,
          dateOfBirth: myProfile.dateOfBirth,
          gender: myProfile.gender,
          occupation: myProfile.occupation,
          address: myProfile.address,
          cherubSeraph: myProfile.cherubSeraph || '',
        });
        const myProducts = await fetch(`/api/products?memberId=${userId}`).then((r) => r.json());
        setProducts(myProducts);
      }
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.id]: e.target.value }));
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const res = await fetch('/api/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImage: base64 }),
      });
      if (res.ok) { addToast('success', 'Profile picture updated'); load(); }
      else addToast('error', 'Failed to update picture');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/members', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          occupation: form.occupation,
          address: form.address,
          cherubSeraph: form.cherubSeraph || null,
        }),
      });
      if (res.ok) { addToast('success', 'Profile updated successfully'); load(); }
      else addToast('error', 'Failed to update profile');
    } catch {
      addToast('error', 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) { addToast('success', 'Product deleted'); load(); }
    else addToast('error', 'Failed to delete product');
  };

  if (loading) return <p className="text-gray-400 text-sm">Loading profile...</p>;
  if (!member) return <p className="text-gray-400 text-sm">No profile found. Contact an admin.</p>;

  const getBranchName = (id: string) => branches.find((b) => b.id === id)?.name || 'Unknown';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {member.profileImage ? (
                <img src={member.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                `${member.firstName[0]}${member.lastName[0]}`
              )}
            </div>
            <button
              onClick={handleImageUpload}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-300 transition-colors"
            >
              <Camera className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileSelected}
            />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-xl font-bold text-gray-900">{member.firstName} {member.lastName}</h1>
            <p className="text-sm text-gray-500">{member.email}</p>
            <p className="text-xs text-gray-400 mt-0.5">{getBranchName(member.branchId)}</p>
            <div className="flex items-center gap-3 mt-3 justify-center sm:justify-start">
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 capitalize">{member.status}</span>
              {member.occupation && (
                <span className="text-xs text-gray-400">{member.occupation}</span>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Form */}
      <form onSubmit={handleSave}>
        <Card className="p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Edit Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input id="firstName" label="First Name" value={form.firstName} onChange={handleChange} required />
            <Input id="lastName" label="Last Name" value={form.lastName} onChange={handleChange} required />
            <Input id="phone" label="Phone" type="tel" value={form.phone} onChange={handleChange} />
            <Input id="dateOfBirth" label="Date of Birth" type="date" value={form.dateOfBirth} onChange={handleChange} />
            <Select
              id="gender"
              label="Gender"
              value={form.gender}
              onChange={handleChange}
              options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]}
              placeholder="Select gender"
              required
            />
            <Input id="occupation" label="Occupation" value={form.occupation} onChange={handleChange} />
            <Input id="address" label="Address" value={form.address} onChange={handleChange} />
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
          </div>
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={saving}>
              <Save className="w-4 h-4 mr-1.5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </Card>
      </form>

      {/* My Products */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">My Products</h2>
            <span className="text-xs text-gray-400">({products.length})</span>
          </div>
          <Link href="/dashboard/products/add">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add Product
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">
            No products listed yet. Click &ldquo;Add Product&rdquo; to get started.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {products.map((p) => (
              <div key={p.id} className="flex gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                {p.images?.[0] ? (
                  <img src={p.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                  {p.description && <p className="text-xs text-gray-400 truncate">{p.description}</p>}
                  <p className="text-sm font-semibold text-blue-600 mt-1">{'\u20A6'}{p.price.toLocaleString()}</p>
                </div>
                <div className="flex flex-col gap-1 shrink-0">
                  <Link href={`/dashboard/products/edit/${p.id}`}>
                    <button className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Contact & Account CTA */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden shrink-0">
            {member.profileImage ? (
              <img src={member.profileImage} alt="" className="w-full h-full object-cover" />
            ) : (
              `${member.firstName[0]}${member.lastName[0]}`
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-semibold text-gray-900">{member.firstName} {member.lastName}</h3>
            <p className="text-sm text-gray-500">{member.email}</p>
            {member.phone && <p className="text-sm text-gray-400">{member.phone}</p>}
          </div>
          <div className="flex gap-3 shrink-0">
            <Link href={`/dashboard/members/${member.id}`}>
              <Button variant="secondary">View Account</Button>
            </Link>
            {member.phone && (
              <a href={`tel:${member.phone}`}>
                <Button>Contact</Button>
              </a>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
