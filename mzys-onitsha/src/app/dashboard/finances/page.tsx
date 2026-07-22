'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import type { FinanceRecord, Member, Branch } from '@/lib/types';

export default function FinancesPage() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    memberId: '', branchId: '', type: 'dues', amount: '', description: '',
  });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [f, m, b] = await Promise.all([
      fetch('/api/finances').then((r) => r.json()),
      fetch('/api/members').then((r) => r.json()),
      fetch('/api/branches').then((r) => r.json()),
    ]);
    setRecords(f);
    setMembers(m);
    setBranches(b);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const getMemberName = (id: string) => {
    const m = members.find((x) => x.id === id);
    return m ? `${m.firstName} ${m.lastName}` : 'Unknown';
  };

  const getBranchName = (id: string) => branches.find((b) => b.id === id)?.name || 'Unknown';

  const totalByType = (type: string) =>
    records.filter((r) => r.type === type).reduce((s, r) => s + r.amount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/finances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });
    setForm({ memberId: '', branchId: '', type: 'dues', amount: '', description: '' });
    setShowModal(false);
    setSaving(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mzys-navy">Finances</h1>
          <p className="text-sm text-mzys-gray-500 mt-1">Track dues, remittances, and contributions</p>
        </div>
        <Button onClick={() => setShowModal(true)}>Add Record</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Dues', value: totalByType('dues'), color: 'text-mzys-primary' },
          { label: 'Remittances', value: totalByType('remittance'), color: 'text-mzys-blue' },
          { label: 'Donations', value: totalByType('donation'), color: 'text-mzys-success' },
          { label: 'Expenses', value: totalByType('expense'), color: 'text-mzys-danger' },
        ].map((s) => (
          <Card key={s.label}>
            <p className="text-sm text-mzys-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{'\u20A6'}{s.value.toLocaleString()}</p>
          </Card>
        ))}
      </div>

      {loading ? (
        <p className="text-mzys-gray-400 text-sm">Loading...</p>
      ) : records.length === 0 ? (
        <Card>
          <p className="text-mzys-gray-400 text-sm text-center py-8">No financial records yet.</p>
        </Card>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-mzys-gray-200 bg-mzys-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-mzys-gray-600">Member</th>
                  <th className="text-left px-4 py-3 font-medium text-mzys-gray-600">Branch</th>
                  <th className="text-left px-4 py-3 font-medium text-mzys-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-mzys-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-mzys-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {records.slice().reverse().map((r) => (
                  <tr key={r.id} className="border-b border-mzys-gray-100 last:border-0">
                    <td className="px-4 py-3 text-mzys-gray-800">{getMemberName(r.memberId)}</td>
                    <td className="px-4 py-3 text-mzys-gray-500">{getBranchName(r.branchId)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={r.type === 'expense' ? 'danger' : 'success'}>{r.type}</Badge>
                    </td>
                    <td className="px-4 py-3 font-medium text-mzys-gray-800">{'\u20A6'}{r.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-mzys-gray-500">{new Date(r.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Financial Record">
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
          <Select
            id="branchId"
            label="Branch"
            value={form.branchId}
            onChange={(e) => setForm((p) => ({ ...p, branchId: e.target.value }))}
            options={branches.map((b) => ({ value: b.id, label: b.name }))}
            placeholder="Select branch"
            required
          />
          <Select
            id="type"
            label="Type"
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            options={[
              { value: 'dues', label: 'Dues' },
              { value: 'remittance', label: 'Remittance' },
              { value: 'donation', label: 'Donation' },
              { value: 'expense', label: 'Expense' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <Input
            id="amount"
            label="Amount (NGN)"
            type="number"
            placeholder="0"
            value={form.amount}
            onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
            required
          />
          <Input
            id="description"
            label="Description"
            placeholder="Brief description"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
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
