'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
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
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                      {member.firstName[0]}{member.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-mzys-navy">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-xs text-mzys-gray-400">{member.email}</p>
                    </div>
                  </div>
                  <Badge variant={member.status === 'active' ? 'success' : 'default'}>
                    {member.status}
                  </Badge>
                </div>
                <div className="mt-4 space-y-1.5 text-sm">
                  <p className="text-mzys-gray-500">
                    <span className="text-mzys-gray-400">Branch:</span> {getBranchName(member.branchId)}
                  </p>
                  {member.occupation && (
                    <p className="text-mzys-gray-500">
                      <span className="text-mzys-gray-400">Occupation:</span> {member.occupation}
                    </p>
                  )}
                  {member.cherubSeraph && (
                    <p className="text-mzys-gray-500">
                      <span className="text-mzys-gray-400">Unit:</span>{' '}
                      <span className="capitalize">{member.cherubSeraph}</span>
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
