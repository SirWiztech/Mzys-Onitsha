'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import type { Leadership, Member, Branch } from '@/lib/types';

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

  const provincial = leaders.filter((l) => l.level === 'provincial');
  const branchLeaders = leaders.filter((l) => l.level === 'branch');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mzys-navy">Leadership Directory</h1>
          <p className="text-sm text-mzys-gray-500 mt-1">Provincial and branch executives</p>
        </div>
        {userRole === 'admin' && (
          <Button onClick={() => setShowModal(true)}>Add Leader</Button>
        )}
      </div>

      {loading ? (
        <p className="text-mzys-gray-400 text-sm">Loading...</p>
      ) : leaders.length === 0 ? (
        <Card>
          <p className="text-mzys-gray-400 text-sm text-center py-8">No leadership records yet.</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {provincial.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-mzys-navy mb-4">Provincial Leadership</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {provincial.map((leader) => (
                  <Card key={leader.id}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                        {getMemberName(leader.memberId).split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-mzys-navy">{getMemberName(leader.memberId)}</p>
                        <p className="text-xs text-mzys-primary font-medium">{leader.position}</p>
                      </div>
                    </div>
                    {leader.responsibilities && (
                      <p className="text-sm text-mzys-gray-500">{leader.responsibilities}</p>
                    )}
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
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-sm">
                        {getMemberName(leader.memberId).split(' ').map((n) => n[0]).join('').slice(0, 2)}
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
            placeholder="e.g. Provincial President"
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
