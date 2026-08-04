'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import type { Member, Branch } from '@/lib/types';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [search, setSearch] = useState('');
  const [filterBranch, setFilterBranch] = useState('');
  const [filterOccupation, setFilterOccupation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/members').then((r) => r.json()),
      fetch('/api/branches').then((r) => r.json()),
    ]).then(([m, b]) => {
      setMembers(m);
      setBranches(b);
      setLoading(false);
    });
  }, []);

  const getBranchName = (id: string) => branches.find((b) => b.id === id)?.name || 'Unknown';

  const roleLabel = (role?: string) => {
    if (role === 'superadmin') return 'Super Admin';
    if (role === 'exco') return 'Exco';
    return 'Member';
  };

  const occupations = [...new Set(members.map((m) => m.occupation).filter(Boolean))];

  const filtered = members.filter((m) => {
    const matchSearch =
      !search ||
      `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchBranch = !filterBranch || m.branchId === filterBranch;
    const matchOccupation = !filterOccupation || m.occupation === filterOccupation;
    return matchSearch && matchBranch && matchOccupation;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mzys-navy">Member Directory</h1>
          <p className="text-sm text-mzys-gray-500 mt-1">
            Search and browse MZYS members
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            id="branch"
            value={filterBranch}
            onChange={(e) => setFilterBranch(e.target.value)}
            options={branches.map((b) => ({ value: b.id, label: b.name }))}
            placeholder="All Branches"
          />
          <Select
            id="occupation"
            value={filterOccupation}
            onChange={(e) => setFilterOccupation(e.target.value)}
            options={occupations.map((o) => ({ value: o, label: o }))}
            placeholder="All Occupations"
          />
        </div>
      </Card>

      {loading ? (
        <p className="text-mzys-gray-400 text-sm">Loading members...</p>
      ) : filtered.length === 0 ? (
        <Card>
          <p className="text-mzys-gray-400 text-sm text-center py-8">
            No members found matching your criteria.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((member) => (
            <Link key={member.id} href={`/dashboard/members/${member.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm overflow-hidden shrink-0">
                    {member.profileImage ? (
                      <img src={member.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      `${member.firstName[0]}${member.lastName[0]}`
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-mzys-navy truncate">
                      {member.firstName} {member.lastName}
                    </p>
                    <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded-full mt-1 ${
                      member.role === 'superadmin'
                        ? 'bg-amber-50 text-amber-700'
                        : member.role === 'exco'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {roleLabel(member.role)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 text-sm">
                  <p className="text-mzys-gray-500">
                    <span className="text-mzys-gray-400">Band:</span>{' '}
                    {member.cherubSeraph ? (
                      <span className="capitalize">{member.cherubSeraph}</span>
                    ) : (
                      <span className="text-mzys-gray-300">-</span>
                    )}
                  </p>
                  <p className="text-mzys-gray-500">
                    <span className="text-mzys-gray-400">Occupation:</span>{' '}
                    {member.occupation || <span className="text-mzys-gray-300">-</span>}
                  </p>
                  <p className="text-mzys-gray-500">
                    <span className="text-mzys-gray-400">Branch:</span> {getBranchName(member.branchId)}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
