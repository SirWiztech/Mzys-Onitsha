'use client';

import { useState, useEffect, useRef } from 'react';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { Wallet, CheckCircle, Clock, AlertCircle, CalendarDays, Upload, Eye, X } from 'lucide-react';
import type { FinanceRecord } from '@/lib/types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CURRENT_YEAR = new Date().getFullYear();
const currentMonth = new Date().getMonth();

export default function MyDuesPage() {
  const [records, setRecords] = useState<FinanceRecord[]>([]);
  const [memberId, setMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadModal, setUploadModal] = useState<{ open: boolean; month: number }>({ open: false, month: 0 });
  const [receiptData, setReceiptData] = useState<string | null>(null);
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadAmount, setUploadAmount] = useState('1000');
  const [saving, setSaving] = useState(false);
  const [viewReceipt, setViewReceipt] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/finances').then((r) => r.json()),
      fetch('/api/auth').then((r) => r.json()),
    ]).then(([f, a]) => {
      setRecords(f);
      if (a.user?.memberId) setMemberId(a.user.memberId);
      setLoading(false);
    });
  }, []);

  const myDues = records.filter((r) => r.memberId === memberId && r.type === 'dues');

  const paidMonths: number[] = [];
  const pendingMonths: number[] = [];
  for (const r of myDues) {
    const year = new Date(r.date).getFullYear();
    if (year !== CURRENT_YEAR) continue;
    const month = new Date(r.date).getMonth();
    if (r.status === 'approved' && !paidMonths.includes(month)) paidMonths.push(month);
    if (r.status === 'pending' && !pendingMonths.includes(month) && !paidMonths.includes(month)) pendingMonths.push(month);
  }
  paidMonths.sort((a, b) => a - b);

  const monthsCleared = paidMonths.length;
  const monthsRemaining = 12 - monthsCleared;
  const totalPaid = myDues.filter((r) => r.status === 'approved').reduce((s, r) => s + r.amount, 0);
  const totalPending = myDues.filter((r) => r.status === 'pending').reduce((s, r) => s + r.amount, 0);
  const isFullyPaid = monthsCleared >= 12;

  const getMonthStatus = (i: number) => {
    if (paidMonths.includes(i)) return 'paid';
    if (pendingMonths.includes(i)) return 'pending';
    if (i < currentMonth) return 'overdue';
    if (i === currentMonth) return 'due';
    return 'upcoming';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setReceiptData(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptData || !memberId) return;
    setSaving(true);
    const date = new Date(CURRENT_YEAR, uploadModal.month, 15);
    await fetch('/api/finances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        memberId,
        branchId: '',
        type: 'dues',
        amount: Number(uploadAmount),
        description: uploadDesc || `${MONTHS[uploadModal.month]} ${CURRENT_YEAR} dues`,
        date: date.toISOString(),
        receipt: receiptData,
      }),
    });
    setUploadModal({ open: false, month: 0 });
    setReceiptData(null);
    setUploadDesc('');
    setUploadAmount('1000');
    setSaving(false);
    const [f] = await Promise.all([fetch('/api/finances').then((r) => r.json())]);
    setRecords(f);
  };

  const pendingReceipts = myDues.filter((r) => r.status === 'pending' && r.receipt);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse" />
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-40 animate-pulse" />
            <div className="h-3 bg-gray-100 rounded w-56 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!memberId) {
    return (
      <Card className="p-12 text-center">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Sign in required</p>
        <p className="text-sm text-gray-400 mt-1">Please log in to view your dues.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Dues</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track your membership dues for {CURRENT_YEAR}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Total Paid (Approved)</p>
          <p className="text-2xl font-bold text-gray-900 mt-0.5">{'\u20A6'}{totalPaid.toLocaleString()}</p>
          {totalPending > 0 && (
            <p className="text-xs text-amber-600 mt-1">+ {'\u20A6'}{totalPending.toLocaleString()} pending</p>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500">Months Cleared</p>
          <p className="text-2xl font-bold text-emerald-600 mt-0.5">{monthsCleared}/12</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
              {isFullyPaid ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Clock className="w-4 h-4 text-amber-600" />}
            </div>
          </div>
          <p className="text-sm text-gray-500">{isFullyPaid ? 'Status' : 'Months Remaining'}</p>
          <p className={`text-2xl font-bold mt-0.5 ${isFullyPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
            {isFullyPaid ? 'Fully Paid' : monthsRemaining}
          </p>
        </div>
      </div>

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays className="w-5 h-5 text-gray-500" />
          <h2 className="text-base font-semibold text-gray-900">Dues Calendar &mdash; {CURRENT_YEAR}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {MONTHS.map((month, i) => {
            const s = getMonthStatus(i);
            const isPending = s === 'pending';
            const isOverdue = s === 'overdue';
            return (
              <div
                key={month}
                onClick={() => { if (isOverdue) setUploadModal({ open: true, month: i }); }}
                className={`relative rounded-xl border-2 p-4 text-center transition-all cursor-default ${
                  s === 'paid' ? 'border-emerald-200 bg-emerald-50'
                  : isPending ? 'border-amber-200 bg-amber-50'
                  : isOverdue ? 'border-red-200 bg-red-50 cursor-pointer hover:shadow-md hover:border-red-300'
                  : s === 'due' ? 'border-amber-200 bg-amber-50'
                  : 'border-gray-100 bg-white'
                }`}
              >
                <p className={`text-sm font-semibold ${
                  s === 'paid' ? 'text-emerald-700'
                  : isPending || s === 'due' ? 'text-amber-700'
                  : isOverdue ? 'text-red-700'
                  : 'text-gray-400'
                }`}>{month}</p>
                <div className={`mt-2 w-full h-1.5 rounded-full ${
                  s === 'paid' ? 'bg-emerald-300'
                  : isPending || s === 'due' ? 'bg-amber-300'
                  : isOverdue ? 'bg-red-300'
                  : 'bg-gray-200'
                }`} />
                <p className={`text-[10px] font-medium mt-1.5 ${
                  s === 'paid' ? 'text-emerald-600'
                  : isPending ? 'text-amber-600'
                  : isOverdue ? 'text-red-600'
                  : s === 'due' ? 'text-amber-600'
                  : 'text-gray-300'
                }`}>
                  {s === 'paid' ? 'Paid' : isPending ? 'Pending' : isOverdue ? 'Overdue' : s === 'due' ? 'Due' : '—'}
                </p>
                {isOverdue && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-400 flex items-center justify-center">
                    <Upload className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-6 mt-4 pt-3 border-t border-gray-100 flex-wrap">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-300" /><span className="text-xs text-gray-500">Cleared</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-300" /><span className="text-xs text-gray-500">Current / Pending</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-300" /><span className="text-xs text-gray-500">Overdue — click to upload receipt</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-gray-200" /><span className="text-xs text-gray-500">Upcoming</span></div>
        </div>
      </Card>

      {pendingReceipts.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-semibold text-gray-900">Pending Approval ({pendingReceipts.length})</h3>
          </div>
          <div className="space-y-2">
            {pendingReceipts.map((r) => {
              const d = new Date(r.date);
              return (
                <div key={r.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{MONTHS[d.getMonth()]} {d.getFullYear()}</p>
                    <p className="text-xs text-gray-500">{'\u20A6'}{r.amount.toLocaleString()}</p>
                  </div>
                  <button onClick={() => setViewReceipt(r.receipt || '')} className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                    <Eye className="w-3.5 h-3.5" /> View Receipt
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Modal open={uploadModal.open} onClose={() => { setUploadModal({ open: false, month: 0 }); setReceiptData(null); }} title={`Upload Receipt — ${MONTHS[uploadModal.month]} ${CURRENT_YEAR}`}>
        <form onSubmit={handleUploadReceipt} className="space-y-4">
          <p className="text-sm text-gray-500">
            Upload your payment receipt for <strong>{MONTHS[uploadModal.month]} {CURRENT_YEAR}</strong>. An admin will review and approve it.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
            <input type="number" value={uploadAmount} onChange={(e) => setUploadAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Receipt Image</label>
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-colors">
              {receiptData ? (
                <div className="relative inline-block">
                  <img src={receiptData} alt="Receipt" className="max-h-48 rounded-lg mx-auto" />
                  <button type="button" onClick={(e) => { e.stopPropagation(); setReceiptData(null); }} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"><X className="w-3.5 h-3.5" /></button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload receipt</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (optional)</label>
            <input type="text" value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)} placeholder={`${MONTHS[uploadModal.month]} ${CURRENT_YEAR} dues`} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => { setUploadModal({ open: false, month: 0 }); setReceiptData(null); }}>Cancel</Button>
            <Button type="submit" disabled={!receiptData || saving}>{saving ? 'Uploading...' : 'Submit for Approval'}</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!viewReceipt} onClose={() => setViewReceipt(null)} title="Payment Receipt">
        {viewReceipt && <img src={viewReceipt} alt="Receipt" className="max-w-full max-h-[70vh] rounded-lg mx-auto" />}
      </Modal>

      <Card padding={false}>
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Payment History</h3>
        </div>
        {myDues.length === 0 ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No dues payments recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Month</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Description</th>
                </tr>
              </thead>
              <tbody>
                {myDues.slice().reverse().map((r) => {
                  const d = new Date(r.date);
                  return (
                    <tr key={r.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-800 whitespace-nowrap">{d.toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">{'\u20A6'}{r.amount.toLocaleString()}</td>
                      <td className="px-4 py-3"><Badge variant={d.getFullYear() === CURRENT_YEAR ? 'success' : 'default'}>{MONTHS[d.getMonth()]} {d.getFullYear()}</Badge></td>
                      <td className="px-4 py-3">{r.status === 'approved' ? <Badge variant="success">Approved</Badge> : <Badge variant="warning">Pending</Badge>}</td>
                      <td className="px-4 py-3 text-gray-500">{r.description || '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
