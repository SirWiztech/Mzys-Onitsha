'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowLeft, Package } from 'lucide-react';
import type { Member, Branch, Product } from '@/lib/types';

export default function MemberDetailPage() {
  const params = useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [branch, setBranch] = useState<Branch | undefined>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [members, branches, allProducts] = await Promise.all([
        fetch('/api/members').then((r) => r.json()),
        fetch('/api/branches').then((r) => r.json()),
        fetch('/api/products').then((r) => r.json()),
      ]);
      const m = (members as Member[]).find((x) => x.id === params.id);
      if (m) {
        setMember(m);
        setBranch((branches as Branch[]).find((b) => b.id === m.branchId));
        setProducts((allProducts as Product[]).filter((p) => p.memberId === m.id));
      }
      setLoading(false);
    };
    load();
  }, [params.id]);

  if (loading) return <p className="text-gray-400 text-sm">Loading...</p>;
  if (!member) return <p className="text-gray-400 text-sm">Member not found.</p>;

  const roleLabel = member.role === 'superadmin' ? 'Super Admin' : member.role === 'exco' ? 'Exco' : 'Member';
  const roleVariant = member.role === 'superadmin' ? ('warning' as const) : member.role === 'exco' ? ('success' as const) : ('default' as const);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/members" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Members
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1 p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
              {member.profileImage ? (
                <img src={member.profileImage} alt="" className="w-full h-full object-cover" />
              ) : (
                `${member.firstName[0]}${member.lastName[0]}`
              )}
            </div>
            <h1 className="text-xl font-bold text-gray-900 mt-4">
              {member.firstName} {member.lastName}
            </h1>
            <p className="text-sm text-gray-500">{member.email}</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Badge variant={roleVariant}>{roleLabel}</Badge>
              <Badge variant={member.status === 'active' ? 'success' : 'default'}>
                {member.status}
              </Badge>
            </div>
            {member.occupation && (
              <p className="text-xs text-gray-400 mt-2">{member.occupation}</p>
            )}
          </div>
        </Card>

        {/* Profile Details */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Phone', value: member.phone },
              { label: 'Date of Birth', value: member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : '-' },
              { label: 'Gender', value: member.gender === 'male' ? 'Male' : 'Female' },
              { label: 'Branch', value: branch?.name || 'Unknown' },
              { label: 'Role', value: roleLabel },
              { label: 'Band', value: member.cherubSeraph ? member.cherubSeraph.charAt(0).toUpperCase() + member.cherubSeraph.slice(1) : '-' },
              { label: 'Occupation', value: member.occupation || '-' },
              { label: 'Address', value: member.address || '-' },
              { label: 'Registered', value: new Date(member.registrationDate).toLocaleDateString() },
            ].map((field) => (
              <div key={field.label}>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{field.label}</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{field.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Products Section */}
      {products.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Products & Services</h2>
            <span className="text-xs text-gray-400">({products.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div key={p.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                {p.images?.[0] ? (
                  <div className="aspect-[4/3] bg-gray-50">
                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center text-gray-300">
                    <Package className="w-10 h-10" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm">{p.name}</h3>
                  {p.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>}
                  <p className="text-sm font-bold text-blue-600 mt-2">{'\u20A6'}{p.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
