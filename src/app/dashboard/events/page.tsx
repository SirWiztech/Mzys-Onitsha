'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import Modal from '@/components/ui/modal';
import { CalendarDays, Plus, Trash2, Clock, MapPin } from 'lucide-react';
import type { MZYSEvent } from '@/lib/types';

const typeColors: Record<string, 'default' | 'success' | 'warning'> = {
  meeting: 'default',
  conference: 'success',
  program: 'warning',
  fellowship: 'success',
  other: 'default',
};

function isAdmin(role: string) {
  return role === 'exco' || role === 'superadmin';
}

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

  const now = new Date();

  const upcoming = events
    .filter((e) => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const past = events
    .filter((e) => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  const userCanManage = isAdmin(userRole);

  const renderEvent = (event: MZYSEvent) => {
    const d = new Date(event.date);
    const end = event.endDate ? new Date(event.endDate) : null;
    return (
      <Card key={event.id}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 flex-1 min-w-0">
            {/* Date badge */}
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col items-center justify-center text-white shrink-0">
              <span className="text-[10px] font-semibold uppercase leading-none tracking-wide">
                {d.toLocaleDateString('en', { month: 'short' })}
              </span>
              <span className="text-xl font-bold leading-none mt-0.5">
                {d.getDate()}
              </span>
            </div>

            {/* Event details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-gray-900">{event.title}</h3>
                <Badge variant={typeColors[event.type] || 'default'}>{event.type}</Badge>
              </div>
              {event.description && (
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{event.description}</p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {d.toLocaleDateString('en', {
                    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
                  })}
                  {' at '}
                  {d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {end && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {end.toLocaleDateString('en', {
                      weekday: 'short', day: 'numeric', month: 'short',
                    })}
                    {' '}
                    {end.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
                {event.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {event.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {userCanManage && (
            <button
              onClick={() => handleDelete(event.id)}
              className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Events</h1>
            <p className="text-sm text-gray-500 mt-0.5">Upcoming MZYS events and activities</p>
          </div>
        </div>
        {userCanManage && (
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Event
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-14 h-14 rounded-xl bg-gray-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <Card className="p-12 text-center">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No events scheduled</p>
          {userCanManage && (
            <Button className="mt-4" onClick={() => setShowModal(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Create Event
            </Button>
          )}
        </Card>
      ) : (
        <>
          {/* Upcoming Events */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Upcoming Events
              <span className="text-sm font-normal text-gray-400">({upcoming.length})</span>
            </h2>
            {upcoming.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-sm text-gray-400">No upcoming events.</p>
              </Card>
            ) : (
              <div className="space-y-3">{upcoming.map(renderEvent)}</div>
            )}
          </div>

          {/* Past Events */}
          {past.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-300" />
                Past Events
                <span className="text-sm font-normal text-gray-400">({past.length})</span>
              </h2>
              <div className="space-y-3 opacity-70">{past.map(renderEvent)}</div>
            </div>
          )}
        </>
      )}

      {/* Add Event Modal */}
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
