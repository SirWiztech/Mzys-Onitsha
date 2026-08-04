'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import type { Complaint, Member } from '@/lib/types';

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [form, setForm] = useState({ title: '', description: '', category: 'general' });
  const [saving, setSaving] = useState(false);
  const [userRole, setUserRole] = useState<string>('member');
  const [userId, setUserId] = useState<string>('');

  const load = async () => {
    const [c, m, auth] = await Promise.all([
      fetch('/api/complaints').then((r) => r.json()),
      fetch('/api/members').then((r) => r.json()),
      fetch('/api/auth').then((r) => r.json()),
    ]);
    setComplaints(c);
    setMembers(m);
    setUserRole(auth.user?.role || 'member');
    setUserId(auth.user?.id || '');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const getMemberName = (id: string) => {
    const m = members.find((x) => x.id === id);
    return m ? `${m.firstName} ${m.lastName}` : 'Unknown';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', description: '', category: 'general' });
    setShowModal(false);
    setSaving(false);
    load();
  };

  const handleRespond = async (id: string) => {
    await fetch(`/api/complaints?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'in-progress', response: responseText }),
    });
    setShowResponseModal(null);
    setResponseText('');
    load();
  };

  const handleResolve = async (id: string) => {
    await fetch(`/api/complaints?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'resolved' }),
    });
    load();
  };

  const statusColors: Record<string, 'default' | 'warning' | 'success'> = {
    open: 'default',
    'in-progress': 'warning',
    resolved: 'success',
  };

  const userComplaints = (userRole === 'exco' || userRole === 'superadmin')
    ? complaints
    : complaints.filter((c) => c.memberId === userId);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mzys-navy">Support & Complaints</h1>
          <p className="text-sm text-mzys-gray-500 mt-1">Submit and manage complaints</p>
        </div>
        <Button onClick={() => setShowModal(true)}>Submit Complaint</Button>
      </div>

      {loading ? (
        <p className="text-mzys-gray-400 text-sm">Loading...</p>
      ) : userComplaints.length === 0 ? (
        <Card>
          <p className="text-mzys-gray-400 text-sm text-center py-8">No complaints submitted yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {userComplaints.slice().reverse().map((c) => (
            <Card key={c.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-mzys-navy">{c.title}</h3>
                    <Badge variant={statusColors[c.status]}>{c.status}</Badge>
                    <Badge>{c.category}</Badge>
                  </div>
                  <p className="text-sm text-mzys-gray-500 mt-2">{c.description}</p>
                  <p className="text-xs text-mzys-gray-400 mt-2">
                    Submitted by {getMemberName(c.memberId)} on{' '}
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                  {c.response && (
                    <div className="mt-3 bg-mzys-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-mzys-gray-500">Response:</p>
                      <p className="text-sm text-mzys-gray-700 mt-1">{c.response}</p>
                    </div>
                  )}
                </div>
                {(userRole === 'exco' || userRole === 'superadmin') && c.status === 'open' && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setShowResponseModal(c.id)}
                    >
                      Respond
                    </Button>
                    <Button size="sm" onClick={() => handleResolve(c.id)}>
                      Resolve
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Submit Complaint">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="title"
            label="Title"
            placeholder="Brief description of the issue"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
          <Select
            id="category"
            label="Category"
            value={form.category}
            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            options={[
              { value: 'general', label: 'General' },
              { value: 'financial', label: 'Financial' },
              { value: 'leadership', label: 'Leadership' },
              { value: 'event', label: 'Event' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-mzys-gray-700">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Provide details about your complaint or suggestion..."
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              className="w-full px-3 py-2 border border-mzys-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mzys-primary"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Submitting...' : 'Submit'}</Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!showResponseModal}
        onClose={() => setShowResponseModal(null)}
        title="Respond to Complaint"
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="response" className="text-sm font-medium text-mzys-gray-700">
              Response
            </label>
            <textarea
              id="response"
              rows={4}
              placeholder="Write your response..."
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="w-full px-3 py-2 border border-mzys-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-mzys-primary"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowResponseModal(null)}>Cancel</Button>
            <Button onClick={() => showResponseModal && handleRespond(showResponseModal)}>
              Send Response
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
