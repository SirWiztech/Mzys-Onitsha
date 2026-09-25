'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';
import Button from '@/components/ui/button';
import Modal from '@/components/ui/modal';
import { useToast } from '@/components/ui/toast';
import { Pencil, Trash2, Plus, CalendarDays } from 'lucide-react';
import type { Program, ProgramCategory } from '@/lib/types';

const EMPTY_FORM = {
  category: 'provincial' as ProgramCategory,
  sn: '',
  eventType: '',
  date: '',
  theme: '',
  topic: '',
  venue: '',
  time: '',
};

const HEADINGS = ['S/N', 'Event Type', 'Date', 'Theme', 'Topic', 'Venue', 'Time', ''];

export default function ProgramsPage() {
  const { addToast } = useToast();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Program | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await fetch('/api/programs');
      const data = await res.json();
      setPrograms(Array.isArray(data) ? data : []);
    } catch {
      addToast('error', 'Failed to load programs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openAdd = (category: ProgramCategory) => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, category });
    setShowModal(true);
  };

  const openEdit = (p: Program) => {
    setEditing(p);
    setForm({
      category: p.category,
      sn: String(p.sn ?? ''),
      eventType: p.eventType,
      date: p.date,
      theme: p.theme,
      topic: p.topic,
      venue: p.venue,
      time: p.time,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.eventType.trim()) {
      addToast('error', 'Event type is required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        category: form.category,
        sn: form.sn === '' ? undefined : Number(form.sn),
        eventType: form.eventType,
        date: form.date,
        theme: form.theme,
        topic: form.topic,
        venue: form.venue,
        time: form.time,
      };
      const res = await fetch('/api/programs', {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      addToast('success', editing ? 'Program updated' : 'Program added');
      setShowModal(false);
      await load();
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p: Program) => {
    if (!confirm(`Delete "${p.eventType}" from the calendar?`)) return;
    const res = await fetch(`/api/programs?id=${p.id}`, { method: 'DELETE' });
    if (res.ok) {
      addToast('success', 'Program deleted');
      load();
    } else {
      addToast('error', 'Failed to delete program');
    }
  };

  const provincial = programs.filter((p) => p.category === 'provincial');
  const district = programs.filter((p) => p.category === 'district');

  const renderTable = (rows: Program[], category: ProgramCategory) => {
    if (rows.length === 0) {
      return (
        <Card>
          <p className="text-mzys-gray-400 text-sm text-center py-8">
            No {category} programs yet. Click &ldquo;Add Program&rdquo; to get started.
          </p>
        </Card>
      );
    }
    return (
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="border-b border-mzys-gray-200 text-left">
                {HEADINGS.map((h, i) => (
                  <th
                    key={i}
                    className={`px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-mzys-gray-500 whitespace-nowrap ${i === 0 ? 'pl-4' : ''} ${i === HEADINGS.length - 1 ? 'pr-4' : ''}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-mzys-gray-100 last:border-0 hover:bg-mzys-gray-50 transition-colors">
                  <td className="px-3 py-2.5 pl-4 text-mzys-gray-400 tabular-nums">{p.sn}</td>
                  <td className="px-3 py-2.5 font-medium text-mzys-navy whitespace-nowrap">{p.eventType}</td>
                  <td className="px-3 py-2.5 text-mzys-gray-600 whitespace-nowrap">{p.date || '—'}</td>
                  <td className="px-3 py-2.5 text-mzys-gray-600">{p.theme || '—'}</td>
                  <td className="px-3 py-2.5 text-mzys-gray-500">{p.topic || '—'}</td>
                  <td className="px-3 py-2.5 text-mzys-gray-600">{p.venue || '—'}</td>
                  <td className="px-3 py-2.5 text-mzys-gray-600 whitespace-nowrap">{p.time || '—'}</td>
                  <td className="px-3 py-2.5 pr-4">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="w-7 h-7 rounded flex items-center justify-center text-mzys-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        aria-label={`Edit ${p.eventType}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="w-7 h-7 rounded flex items-center justify-center text-mzys-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label={`Delete ${p.eventType}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-mzys-navy">Programs Calendar</h1>
          <p className="text-sm text-mzys-gray-500 mt-1">
            Manage the floating programs calendar shown on the public site
          </p>
        </div>
        <Button onClick={() => openAdd('provincial')}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Program
        </Button>
      </div>

      {loading ? (
        <p className="text-mzys-gray-400 text-sm">Loading...</p>
      ) : (
        <>
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-mzys-navy">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                Provincial Programs
                <span className="text-xs font-normal text-mzys-gray-400">({provincial.length})</span>
              </h2>
              <Button size="sm" variant="secondary" onClick={() => openAdd('provincial')}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </div>
            {renderTable(provincial, 'provincial')}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-semibold text-mzys-navy">
                <CalendarDays className="w-4 h-4 text-indigo-600" />
                District and Branch Programs
                <span className="text-xs font-normal text-mzys-gray-400">({district.length})</span>
              </h2>
              <Button size="sm" variant="secondary" onClick={() => openAdd('district')}>
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </div>
            {renderTable(district, 'district')}
          </section>
        </>
      )}

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'Edit Program' : 'Add Program'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              id="category"
              label="Category"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as ProgramCategory }))}
              options={[
                { value: 'provincial', label: 'Provincial Program' },
                { value: 'district', label: 'District / Branch Program' },
              ]}
              required
            />
            <Input
              id="sn"
              label="S/N (sort order)"
              type="number"
              min="1"
              placeholder="e.g. 16"
              value={form.sn}
              onChange={(e) => setForm((p) => ({ ...p, sn: e.target.value }))}
            />
          </div>
          <Input
            id="eventType"
            label="Event Type"
            placeholder="e.g. Youth Week"
            value={form.eventType}
            onChange={(e) => setForm((p) => ({ ...p, eventType: e.target.value }))}
            required
          />
          <Input
            id="date"
            label="Date"
            placeholder="e.g. 9th–15th November, or Every Tuesday"
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
          />
          <Input
            id="theme"
            label="Theme"
            placeholder="e.g. Youth Ablaze"
            value={form.theme}
            onChange={(e) => setForm((p) => ({ ...p, theme: e.target.value }))}
          />
          <Input
            id="topic"
            label="Topic"
            placeholder="e.g. Ignite (Set Apart, Set Ablaze)"
            value={form.topic}
            onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
          />
          <Input
            id="venue"
            label="Venue"
            placeholder="e.g. Fegge P/HQ Hall, or Online"
            value={form.venue}
            onChange={(e) => setForm((p) => ({ ...p, venue: e.target.value }))}
          />
          <Input
            id="time"
            label="Time"
            placeholder="e.g. 10AM–3PM"
            value={form.time}
            onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Program'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
