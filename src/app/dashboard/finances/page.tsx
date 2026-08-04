'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import * as Separator from '@radix-ui/react-separator';
import { Wallet, CalendarCheck, AlertCircle, Search, Pencil, Trash2, CheckCircle, XCircle, Eye, Check, X, Clock } from 'lucide-react';
import type { FinanceRecord, Member, Branch } from '@/lib/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CURRENT_YEAR = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const DEFAULT_DUES_AMOUNT = 1000;

type MemberDues = {
  memberId: string;
  memberName: string;
  branchId: string;
  branchName: string;
  paidMonths: number[];
  pendingMonths: number[];
  totalPaid: number;
  totalPending: number;
  records: FinanceRecord[];
};

export default function FinancesPage() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ memberId: '', branchId: '', type: 'dues', amount: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRecord, setEditRecord] = useState<FinanceRecord | null>(null);
  const [userRole, setUserRole] = useState('member');
  const [filterStatus, setFilterStatus] = useState<'all' | 'cleared' | 'owing'>('all');
  const [clearModal, setClearModal] = useState<{ open: boolean; memberId: string; memberName: string; branchId: string; month: number }>({ open: false, memberId: '', memberName: '', branchId: '', month: 0 });
  const [clearAmount, setClearAmount] = useState(String(DEFAULT_DUES_AMOUNT));
  const [clearDesc, setClearDesc] = useState('');
  const [viewReceipt, setViewReceipt] = useState<FinanceRecord | null>(null);

  const load = async () => {
    const [f, m, b, auth] = await Promise.all([
      fetch('/api/finances').then((r) => r.json()),
      fetch('/api/members').then((r) => r.json()),
      fetch('/api/branches').then((r) => r.json()),
      fetch('/api/auth').then((r) => r.json()),
    ]);
    setRecords(f);
    setMembers(m);
    setBranches(b);
    setUserRole(auth.user?.role || 'member');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const getMemberName = (id: string) => { const m = members.find((x) => x.id === id); return m ? `${m.firstName} ${m.lastName}` : 'Unknown'; };
  const getBranchName = (id: string) => branches.find((b) => b.id === id)?.name || 'Unknown';

  const totalByType = (type: string) => records.filter((r) => r.type === type).reduce((s, r) => s + r.amount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/finances', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, amount: Number(form.amount) }) });
    setForm({ memberId: '', branchId: '', type: 'dues', amount: '', description: '' });
    setShowModal(false);
    setSaving(false);
    load();
  };

  const openEdit = (r: FinanceRecord) => {
    setEditRecord(r);
    setForm({ memberId: r.memberId, branchId: r.branchId, type: r.type, amount: String(r.amount), description: r.description });
    setShowEditModal(true);
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRecord) return;
    setSaving(true);
    await fetch('/api/finances', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editRecord.id, ...form, amount: Number(form.amount) }) });
    setShowEditModal(false);
    setEditRecord(null);
    setForm({ memberId: '', branchId: '', type: 'dues', amount: '', description: '' });
    setSaving(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this record?')) return;
    await fetch(`/api/finances?id=${id}`, { method: 'DELETE' });
    load();
  };

  const handleApprove = async (id: string) => {
    await fetch('/api/finances', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: 'approved' }) });
    load();
  };

  const handleReject = async (id: string) => {
    if (!confirm('Reject this payment? It will be removed.')) return;
    await fetch(`/api/finances?id=${id}`, { method: 'DELETE' });
    load();
  };

  const handleClearMonth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clearModal.memberId) return;
    setSaving(true);
    const date = new Date(CURRENT_YEAR, clearModal.month, 15);
    await fetch('/api/finances', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ memberId: clearModal.memberId, branchId: clearModal.branchId, type: 'dues', amount: Number(clearAmount), description: clearDesc || `${MONTHS[clearModal.month]} ${CURRENT_YEAR} dues`, date: date.toISOString() }) });
    setClearModal({ open: false, memberId: '', memberName: '', branchId: '', month: 0 });
    setClearAmount(String(DEFAULT_DUES_AMOUNT));
    setClearDesc('');
    setSaving(false);
    load();
  };

  const isAdmin = userRole === 'exco' || userRole === 'superadmin';
  const duesRecords = records.filter((r) => r.type === 'dues');

  const memberDuesMap = new Map<string, MemberDues>();
  for (const m of members) {
    if (m.status !== 'active') continue;
    memberDuesMap.set(m.id, { memberId: m.id, memberName: `${m.firstName} ${m.lastName}`, branchId: m.branchId, branchName: getBranchName(m.branchId), paidMonths: [], pendingMonths: [], totalPaid: 0, totalPending: 0, records: [] });
  }
  for (const r of duesRecords) {
    const year = new Date(r.date).getFullYear();
    if (year !== CURRENT_YEAR) continue;
    const month = new Date(r.date).getMonth();
    const entry = memberDuesMap.get(r.memberId);
    if (!entry) continue;
    if (r.status === 'approved' && !entry.paidMonths.includes(month)) { entry.paidMonths.push(month); entry.totalPaid += r.amount; }
    if (r.status === 'pending' && !entry.pendingMonths.includes(month) && !entry.paidMonths.includes(month)) { entry.pendingMonths.push(month); entry.totalPending += r.amount; }
    entry.records.push(r);
  }

  let duesTable = Array.from(memberDuesMap.values());
  if (searchQuery) { const q = searchQuery.toLowerCase(); duesTable = duesTable.filter((d) => d.memberName.toLowerCase().includes(q)); }
  if (filterStatus === 'cleared') duesTable = duesTable.filter((d) => d.paidMonths.length >= 12);
  else if (filterStatus === 'owing') duesTable = duesTable.filter((d) => d.paidMonths.length < 12);
  duesTable.sort((a, b) => a.paidMonths.length - b.paidMonths.length);

  const pendingRecords = records.filter((r) => r.status === 'pending' && r.receipt);

  const getMonthColor = (i: number, paid: boolean, pending: boolean) => {
    if (paid) return 'paid';
    if (pending) return 'pending';
    if (i < currentMonth) return 'overdue';
    if (i === currentMonth) return 'due';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finances</h1>
          <p className="text-sm text-gray-500 mt-1">Track dues, remittances, and contributions</p>
        </div>
        <Button onClick={() => setShowModal(true)}>Add Record</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Dues', value: totalByType('dues'), color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Remittances', value: totalByType('remittance'), color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Donations', value: totalByType('donation'), color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Expenses', value: totalByType('expense'), color: 'text-red-600', bg: 'bg-red-50' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center`}><Wallet className={`w-4 h-4 ${s.color}`} /></div>
            </div>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{'\u20A6'}{s.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Pending Approvals */}
      {isAdmin && pendingRecords.length > 0 && (
        <Card className="p-5 border-amber-200">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-semibold text-gray-900">Pending Approvals ({pendingRecords.length})</h2>
          </div>
          <div className="space-y-3">
            {pendingRecords.map((r) => {
              const d = new Date(r.date);
              return (
                <div key={r.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{getMemberName(r.memberId)}</p>
                    <p className="text-xs text-gray-500">{MONTHS[d.getMonth()]} {d.getFullYear()} &mdash; {'\u20A6'}{r.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setViewReceipt(r)} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                      <Eye className="w-3.5 h-3.5" /> Receipt
                    </button>
                    <button onClick={() => handleApprove(r.id)} className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 px-2 py-1 rounded hover:bg-emerald-50 transition-colors">
                      <Check className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button onClick={() => handleReject(r.id)} className="flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors">
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Dues Tracking */}
      <Card className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">Dues Tracking &mdash; {CURRENT_YEAR}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {(['all', 'cleared', 'owing'] as const).map((f) => (
                <button key={f} onClick={() => setFilterStatus(f)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${filterStatus === f ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {f === 'all' ? 'All' : f === 'cleared' ? 'Cleared' : 'Owing'}
                </button>
              ))}
            </div>
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
            </div>
          </div>
        </div>

        {loading ? (
          <p className="text-gray-400 text-sm py-8 text-center">Loading...</p>
        ) : duesTable.length === 0 ? (
          <div className="text-center py-8"><AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-gray-500 text-sm">{searchQuery ? 'No matches.' : 'No active members found.'}</p></div>
        ) : (
          <div className="space-y-4">
            {duesTable.map((entry) => {
              const monthsCleared = entry.paidMonths.length;
              const monthsRemaining = 12 - monthsCleared;
              const isFullyPaid = monthsCleared >= 12;
              return (
                <div key={entry.memberId}>
                  <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-800 truncate">{entry.memberName}</p>
                        {isFullyPaid ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" /> : <XCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-400">{entry.branchName}</p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {MONTHS.map((m, i) => {
                        const paid = entry.paidMonths.includes(i);
                        const pending = entry.pendingMonths.includes(i);
                        const status = getMonthColor(i, paid, pending);
                        return (
                          <span
                            key={m}
                            onClick={() => {
                              if (!isAdmin || paid || pending) return;
                              setClearModal({ open: true, memberId: entry.memberId, memberName: entry.memberName, branchId: entry.branchId, month: i });
                              setClearAmount(String(DEFAULT_DUES_AMOUNT));
                              setClearDesc('');
                            }}
                            className={`text-[10px] font-medium px-2 py-1 rounded-md ${
                              status === 'paid' ? 'bg-emerald-100 text-emerald-700 cursor-default'
                              : status === 'pending' ? 'bg-amber-100 text-amber-700 cursor-default'
                              : status === 'overdue' ? 'bg-red-100 text-red-700'
                              : status === 'due' ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-400'
                            } ${isAdmin && !paid && !pending ? 'cursor-pointer hover:bg-blue-100 hover:text-blue-700 transition-colors' : 'cursor-default'}`}
                          >
                            {paid ? '✓' : pending ? '○' : isAdmin ? '+' : '○'} {m}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right"><p className="text-xs text-gray-400">Cleared</p><p className="text-sm font-semibold text-emerald-600">{monthsCleared}/12</p></div>
                      <div className="text-right"><p className="text-xs text-gray-400">Remaining</p><p className={`text-sm font-semibold ${monthsRemaining > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>{monthsRemaining}</p></div>
                      <div className="text-right min-w-[80px]"><p className="text-xs text-gray-400">Paid</p><p className="text-sm font-semibold text-gray-800">{'\u20A6'}{entry.totalPaid.toLocaleString()}</p></div>
                    </div>
                  </div>
                  <Separator.Root className="mt-3 h-px bg-gray-100" />
                </div>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100 flex-wrap">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-300" /><span className="text-xs text-gray-500">Cleared</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-300" /><span className="text-xs text-gray-500">Pending / Current</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-300" /><span className="text-xs text-gray-500">Overdue (past unpaid)</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-200" /><span className="text-xs text-gray-500">Upcoming</span></div>
        </div>
      </Card>

      {/* All Records */}
      <Card padding={false}>
        <div className="px-5 py-4 border-b border-gray-100"><h3 className="text-sm font-semibold text-gray-900">All Records</h3></div>
        {loading ? <p className="text-gray-400 text-sm px-5 py-8">Loading...</p>
        : records.length === 0 ? <p className="text-gray-400 text-sm text-center py-8">No records yet.</p>
        : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Member</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Branch</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  {isAdmin && <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {records.slice().reverse().map((r) => (
                  <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800">{getMemberName(r.memberId)}</td>
                    <td className="px-4 py-3 text-gray-500">{getBranchName(r.branchId)}</td>
                    <td className="px-4 py-3"><Badge variant={r.type === 'expense' ? 'danger' : 'success'}>{r.type}</Badge></td>
                    <td className="px-4 py-3 font-medium text-gray-800">{'\u20A6'}{r.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">{r.status === 'pending' ? <Badge variant="warning">Pending</Badge> : <Badge variant="success">Approved</Badge>}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{new Date(r.date).toLocaleDateString()}</td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {r.receipt && (
                            <button onClick={() => setViewReceipt(r)} className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button onClick={() => openEdit(r)} className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleDelete(r.id)} className="w-7 h-7 rounded flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* View Receipt Modal */}
      <Modal open={!!viewReceipt} onClose={() => setViewReceipt(null)} title={viewReceipt ? `Receipt — ${getMemberName(viewReceipt.memberId)}` : ''}>
        {viewReceipt?.receipt && (
          <div className="space-y-4">
            <img src={viewReceipt.receipt} alt="Payment Receipt" className="max-w-full max-h-[70vh] rounded-lg mx-auto" />
            {viewReceipt.status === 'pending' && (
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="danger" onClick={() => { handleReject(viewReceipt.id); setViewReceipt(null); }}><X className="w-4 h-4 mr-1" /> Reject</Button>
                <Button onClick={() => { handleApprove(viewReceipt.id); setViewReceipt(null); }}><Check className="w-4 h-4 mr-1" /> Approve</Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Clear Month Modal */}
      <Modal open={clearModal.open} onClose={() => setClearModal({ ...clearModal, open: false })} title={`Clear Dues — ${clearModal.memberName}`}>
        <form onSubmit={handleClearMonth} className="space-y-4">
          <p className="text-sm text-gray-500">Mark {MONTHS[clearModal.month]} {CURRENT_YEAR} as paid for <strong>{clearModal.memberName}</strong>.</p>
          <Input id="ca" label={`Amount for ${MONTHS[clearModal.month]}`} type="number" value={clearAmount} onChange={(e) => setClearAmount(e.target.value)} required />
          <Input id="cd" label="Description" placeholder={`${MONTHS[clearModal.month]} ${CURRENT_YEAR} dues`} value={clearDesc} onChange={(e) => setClearDesc(e.target.value)} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setClearModal({ ...clearModal, open: false })}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Clear Month'}</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={showEditModal} onClose={() => { setShowEditModal(false); setEditRecord(null); }} title="Edit Record">
        <form onSubmit={handleEdit} className="space-y-4">
          <Select id="e-m" label="Member" value={form.memberId} onChange={(e) => setForm((p) => ({ ...p, memberId: e.target.value }))} options={members.map((m) => ({ value: m.id, label: `${m.firstName} ${m.lastName}` }))} required />
          <Select id="e-b" label="Branch" value={form.branchId} onChange={(e) => setForm((p) => ({ ...p, branchId: e.target.value }))} options={branches.map((b) => ({ value: b.id, label: b.name }))} required />
          <Select id="e-t" label="Type" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} options={[{ value: 'dues', label: 'Dues' }, { value: 'remittance', label: 'Remittance' }, { value: 'donation', label: 'Donation' }, { value: 'expense', label: 'Expense' }, { value: 'other', label: 'Other' }]} />
          <Input id="e-a" label="Amount" type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} required />
          <Input id="e-d" label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => { setShowEditModal(false); setEditRecord(null); }}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>

      {/* Add Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Record">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select id="a-m" label="Member" value={form.memberId} onChange={(e) => setForm((p) => ({ ...p, memberId: e.target.value }))} options={members.map((m) => ({ value: m.id, label: `${m.firstName} ${m.lastName}` }))} required />
          <Select id="a-b" label="Branch" value={form.branchId} onChange={(e) => setForm((p) => ({ ...p, branchId: e.target.value }))} options={branches.map((b) => ({ value: b.id, label: b.name }))} required />
          <Select id="a-t" label="Type" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} options={[{ value: 'dues', label: 'Dues' }, { value: 'remittance', label: 'Remittance' }, { value: 'donation', label: 'Donation' }, { value: 'expense', label: 'Expense' }, { value: 'other', label: 'Other' }]} />
          <Input id="a-a" label="Amount" type="number" value={form.amount} onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))} required />
          <Input id="a-d" label="Description" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
