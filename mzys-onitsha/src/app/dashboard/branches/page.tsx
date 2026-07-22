'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import type { Branch, Member } from '@/lib/types';

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', leaderName: '', leaderPhone: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [b, m] = await Promise.all([
      fetch('/api/branches').then((r) => r.json()),
      fetch('/api/members').then((r) => r.json()),
    ]);
    setBranches(b);
    setMembers(m);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const memberCount = (branchId: string) => members.filter((m) => m.branchId === branchId).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/branches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ name: '', location: '', leaderName: '', leaderPhone: '' });
    setShowModal(false);
    setSaving(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this branch?')) return;
    await fetch(`/api/branches?id=${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mzys-navy">Branches</h1>
          <p className="text-sm text-mzys-gray-500 mt-1">Manage MZYS branches</p>
        </div>
        <Button onClick={() => setShowModal(true)}>Add Branch</Button>
      </div>

      {loading ? (
        <p className="text-mzys-gray-400 text-sm">Loading...</p>
      ) : branches.length === 0 ? (
        <Card>
          <p className="text-mzys-gray-400 text-sm text-center py-8">
            No branches yet. Create one to get started.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {branches.map((branch) => (
            <Card key={branch.id}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-mzys-navy">{branch.name}</h3>
                  <p className="text-sm text-mzys-gray-500">{branch.location}</p>
                </div>
                <button
                  onClick={() => handleDelete(branch.id)}
                  className="text-mzys-gray-400 hover:text-mzys-danger transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <div className="mt-4 space-y-1.5 text-sm">
                <p className="text-mzys-gray-500">
                  <span className="text-mzys-gray-400">Leader:</span> {branch.leaderName || '-'}
                </p>
                <p className="text-mzys-gray-500">
                  <span className="text-mzys-gray-400">Phone:</span> {branch.leaderPhone || '-'}
                </p>
                <p className="text-mzys-gray-500">
                  <span className="text-mzys-gray-400">Members:</span> {memberCount(branch.id)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Branch">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="name"
            label="Branch Name"
            placeholder="e.g. Onitsha Main"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
          <Input
            id="location"
            label="Location"
            placeholder="e.g. Onitsha, Anambra"
            value={form.location}
            onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
            required
          />
          <Input
            id="leaderName"
            label="Leader Name"
            placeholder="Leader's full name"
            value={form.leaderName}
            onChange={(e) => setForm((p) => ({ ...p, leaderName: e.target.value }))}
          />
          <Input
            id="leaderPhone"
            label="Leader Phone"
            placeholder="+234 XXX XXX XXXX"
            value={form.leaderPhone}
            onChange={(e) => setForm((p) => ({ ...p, leaderPhone: e.target.value }))}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Branch'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
