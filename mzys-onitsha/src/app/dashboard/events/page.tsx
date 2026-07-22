'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import type { MZYSEvent } from '@/lib/types';

export default function EventsPage() {
  const [events, setEvents] = useState<MZYSEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', date: '', endDate: '', location: '', type: 'meeting',
  });
  const [saving, setSaving] = useState(false);
  const [userRole, setUserRole] = useState<string>('member');

  const load = async () => {
    const [ev, auth] = await Promise.all([
      fetch('/api/events').then((r) => r.json()),
      fetch('/api/auth').then((r) => r.json()),
    ]);
    setEvents(ev);
    setUserRole(auth.user?.role || 'member');
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ title: '', description: '', date: '', endDate: '', location: '', type: 'meeting' });
    setShowModal(false);
    setSaving(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
    load();
  };

  const typeColors: Record<string, string> = {
    meeting: 'default',
    conference: 'success',
    program: 'warning',
    fellowship: 'success',
    other: 'default',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-mzys-navy">Events Calendar</h1>
          <p className="text-sm text-mzys-gray-500 mt-1">View and manage MZYS events</p>
        </div>
        {userRole === 'admin' && (
          <Button onClick={() => setShowModal(true)}>Add Event</Button>
        )}
      </div>

      {loading ? (
        <p className="text-mzys-gray-400 text-sm">Loading...</p>
      ) : events.length === 0 ? (
        <Card>
          <p className="text-mzys-gray-400 text-sm text-center py-8">No events scheduled yet.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {events
            .slice()
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((event) => (
              <Card key={event.id}>
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-lg gradient-primary flex flex-col items-center justify-center text-white shrink-0">
                      <span className="text-xs font-medium leading-none">
                        {new Date(event.date).toLocaleDateString('en', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold leading-none mt-0.5">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-mzys-navy">{event.title}</h3>
                        <Badge variant={typeColors[event.type] as 'default'}>{event.type}</Badge>
                      </div>
                      <p className="text-sm text-mzys-gray-500 mt-1">{event.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-mzys-gray-400">
                        <span>{new Date(event.date).toLocaleString()}</span>
                        {event.location && <span>{event.location}</span>}
                      </div>
                    </div>
                  </div>
                  {userRole === 'admin' && (
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-mzys-gray-400 hover:text-mzys-danger transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </Card>
            ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Event">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="title"
            label="Event Title"
            placeholder="e.g. Monthly Fellowship"
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
          <Input
            id="description"
            label="Description"
            placeholder="Event details"
            value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              id="date"
              label="Start Date & Time"
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              required
            />
            <Input
              id="endDate"
              label="End Date & Time"
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
            />
          </div>
          <Input
            id="location"
            label="Location"
            placeholder="e.g. MZYS Hall, Onitsha"
            value={form.location}
            onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
          />
          <Select
            id="type"
            label="Event Type"
            value={form.type}
            onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            options={[
              { value: 'meeting', label: 'Meeting' },
              { value: 'conference', label: 'Conference' },
              { value: 'program', label: 'Program' },
              { value: 'fellowship', label: 'Fellowship' },
              { value: 'other', label: 'Other' },
            ]}
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
