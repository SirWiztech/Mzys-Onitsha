'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { Crown } from 'lucide-react';
import type { Leadership, Member, Branch } from '@/lib/types';

const POSITION_ORDER: { email: string; position: string; order: number }[] = [
  { email: 'eberegodspower@gmail.com', position: 'President', order: 1 },
  { email: 'okorieconfidence@mzys.com', position: 'Vice President', order: 2 },
  { email: 'ndukachukwuma13@gmail.com', position: 'General Secretary', order: 3 },
  { email: 'ogbonnaagbaielijah@gmail.com', position: 'Assistant Secretary', order: 4 },
  { email: 'preciousagbo1999@gmail.com', position: 'Treasurer', order: 5 },
  { email: 'emmagod40099@gmail.com', position: 'Media & Publicity Director', order: 6 },
  { email: 'achonuchidera@gmail.com', position: 'Welfare Officer', order: 7 },
  { email: 'anyanwupro@gmail.com', position: 'Provost', order: 8 },
  { email: 'udechukwuruth84@gmail.com', position: 'Evangelism Department', order: 9 },
  { email: 'mamaoluchukwu100@gmail.com', position: 'Evangelical / Prayer Unit', order: 10 },
  { email: 'ogarakuugochukwu@mzys.com', position: 'Music & Drama Department', order: 11 },
];

const positionByEmail = new Map(POSITION_ORDER.map((p) => [p.email, p]));

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState<Leadership[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    memberId: '', position: '', level: 'branch', branchId: '', responsibilities: '',
  });
  const [saving, setSaving] = useState(false);
  const [userRole, setUserRole] = useState<string>('member');

  const load = async () => {
    const [l, m, b, auth] = await Promise.all([
      fetch('/api/leadership').then((r) => r.json()),
      fetch('/api/members').then((r) => r.json()),
      fetch('/api/branches').then((r) => r.json()),
      fetch('/api/auth').then((r) => r.json()),
    ]);
    setLeaders(l);
    setMembers(m);
    setBranches(b);
    setUserRole(auth.user?.role || 'member');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const getMemberName = (id: string) => {
    const m = members.find((x) => x.id === id);
    return m ? `${m.firstName} ${m.lastName}` : 'Unknown';
  };

  const getBranchName = (id: string | null) => {
    if (!id) return 'Provincial Level';
    return branches.find((b) => b.id === id)?.name || 'Unknown';
  };

  const council = members
    .filter((m) => m.role === 'superadmin' || m.role === 'exco')
    .map((m) => {
      const info = positionByEmail.get(m.email);
      return {
        member: m,
        position: info?.position || 'Exco',
        order: info?.order ?? 99,
        isPresident: m.role === 'superadmin',
      };
    })
    .sort((a, b) => a.order - b.order);

  const branchLeaders = leaders.filter((l) => l.level === 'branch');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/leadership', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ memberId: '', position: '', level: 'branch', branchId: '', responsibilities: '' });
    setShowModal(false);
    setSaving(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mzys-navy">Leadership Directory</h1>
          <p className="text-sm text-mzys-gray-500 mt-1">Executive council in order of hierarchy</p>
        </div>
        {userRole === 'exco' && (
          <Button onClick={() => setShowModal(true)}>Add Leader</Button>
        )}
      </div>

      {loading ? (
        <p className="text-mzys-gray-400 text-sm">Loading...</p>
      ) : (
        <div className="space-y-8">
          {council.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-mzys-navy mb-4">Executive Council</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {council.map(({ member, position, isPresident }) => (
                  <Card
                    key={member.id}
                    className={isPresident ? 'border-amber-300 ring-1 ring-amber-200' : ''}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm overflow-hidden shrink-0 ${
                        isPresident ? 'bg-gradient-to-br from-amber-400 to-amber-600' : 'gradient-primary'
                      }`}>
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
                        <p className="text-xs text-mzys-primary font-medium flex items-center gap-1">
                          {isPresident && <Crown className="w-3 h-3 text-amber-500" />}
                          {position}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-mzys-gray-400 mb-1">{getBranchName(member.branchId)}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {branchLeaders.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-mzys-navy mb-4">Branch Leadership</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {branchLeaders.map((leader) => (
                  <Card key={leader.id}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm overflow-hidden shrink-0">
                        {members.find((m) => m.id === leader.memberId)?.profileImage ? (
                          <img
                            src={members.find((m) => m.id === leader.memberId)!.profileImage!}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getMemberName(leader.memberId).split(' ').map((n) => n[0]).join('').slice(0, 2)
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-mzys-navy">{getMemberName(leader.memberId)}</p>
                        <p className="text-xs text-mzys-primary font-medium">{leader.position}</p>
                      </div>
                    </div>
                    <p className="text-xs text-mzys-gray-400 mb-1">{getBranchName(leader.branchId)}</p>
                    {leader.responsibilities && (
                      <p className="text-sm text-mzys-gray-500">{leader.responsibilities}</p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Leader">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            id="memberId"
            label="Member"
            value={form.memberId}
            onChange={(e) => setForm((p) => ({ ...p, memberId: e.target.value }))}
            options={members.map((m) => ({ value: m.id, label: `${m.firstName} ${m.lastName}` }))}
            placeholder="Select member"
            required
          />
          <Input
            id="position"
            label="Position"
            placeholder="e.g. Branch Coordinator"
            value={form.position}
            onChange={(e) => setForm((p) => ({ ...p, position: e.target.value }))}
            required
          />
          <Select
            id="level"
            label="Level"
            value={form.level}
            onChange={(e) => setForm((p) => ({ ...p, level: e.target.value }))}
            options={[
              { value: 'provincial', label: 'Provincial' },
              { value: 'branch', label: 'Branch' },
            ]}
          />
          {form.level === 'branch' && (
            <Select
              id="branchId"
              label="Branch"
              value={form.branchId}
              onChange={(e) => setForm((p) => ({ ...p, branchId: e.target.value }))}
              options={branches.map((b) => ({ value: b.id, label: b.name }))}
              placeholder="Select branch"
            />
          )}
          <Input
            id="responsibilities"
            label="Responsibilities"
            placeholder="Key responsibilities"
            value={form.responsibilities}
            onChange={(e) => setForm((p) => ({ ...p, responsibilities: e.target.value }))}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
