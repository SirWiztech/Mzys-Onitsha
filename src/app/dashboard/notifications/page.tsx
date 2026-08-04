'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import Modal from '@/components/ui/modal';
import { Bell, Megaphone, Trash2 } from 'lucide-react';
import type { Notification } from '@/lib/types';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const [n, auth] = await Promise.all([
      fetch('/api/notifications').then((r) => r.json()),
      fetch('/api/auth').then((r) => r.json()),
    ]);
    setNotifications(n);
    setUserRole(auth.user?.role || 'member');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', body: '' });
    setShowModal(false);
    setSaving(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notification?')) return;
    await fetch(`/api/notifications?id=${id}`, { method: 'DELETE' });
    load();
  };

  const isAdmin = userRole === 'exco' || userRole === 'superadmin';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isAdmin ? 'Send and manage announcements' : 'View announcements from administration'}
            </p>
          </div>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowModal(true)}>
            <Megaphone className="w-4 h-4 mr-1.5" /> New Announcement
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No notifications yet</p>
          <p className="text-sm text-gray-400 mt-1">
            {isAdmin ? 'Create an announcement to get started.' : 'Check back later for updates.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <Card key={n.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{n.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(n.createdAt).toLocaleDateString('en', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(n.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed whitespace-pre-wrap">{n.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="New Announcement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="title"
            label="Title"
            placeholder="Announcement title"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="body" className="text-sm font-medium text-gray-700">Message</label>
            <textarea
              id="body"
              rows={5}
              placeholder="Write your announcement..."
              value={form.body}
              onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Sending...' : 'Send Announcement'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
