'use client';

import { useState, useEffect } from 'react';
import { CalendarDays, MessageCircle, X } from 'lucide-react';
import type { Program } from '@/lib/types';

const HEADINGS = ['S/N', 'Event Type', 'Date', 'Theme', 'Topic', 'Venue', 'Time'];

function ProgramsTable({ rows }: { rows: Program[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-gray-500 py-3">No programs listed yet.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-white/5 text-left">
            {HEADINGS.map((h) => (
              <th
                key={h}
                className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wide text-blue-400 whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-t border-white/5 align-top hover:bg-white/5 transition-colors">
              <td className="px-3 py-2.5 text-gray-500 tabular-nums">{p.sn}</td>
              <td className="px-3 py-2.5 text-gray-200 font-medium whitespace-nowrap">{p.eventType}</td>
              <td className="px-3 py-2.5 text-gray-300 whitespace-nowrap">{p.date || '—'}</td>
              <td className="px-3 py-2.5 text-gray-300">{p.theme || '—'}</td>
              <td className="px-3 py-2.5 text-gray-400">{p.topic || '—'}</td>
              <td className="px-3 py-2.5 text-gray-300">{p.venue || '—'}</td>
              <td className="px-3 py-2.5 text-gray-300 whitespace-nowrap">{p.time || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FloatingSocial() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Fetch once, on first open.
  useEffect(() => {
    if (!showCalendar || programs.length > 0 || loading || error) return;
    setLoading(true);
    fetch('/api/programs')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setPrograms(data);
        else setError(true);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [showCalendar, programs.length, loading, error]);

  const provincial = programs.filter((p) => p.category === 'provincial');
  const district = programs.filter((p) => p.category === 'district');

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button
          onClick={() => setShowCalendar(true)}
          className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-110 transition-all duration-200"
          aria-label="Programs Calendar"
        >
          <CalendarDays className="w-5 h-5" />
        </button>
        <a
          href="https://facebook.com/mzysonitsha"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-110 transition-all duration-200"
          aria-label="Facebook"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
        <a
          href="https://wa.me/2348000000000"
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-600 hover:scale-110 transition-all duration-200"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

      {showCalendar && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowCalendar(false)}
        >
          <div
            className="bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-[#0B1120] z-10">
              <div>
                <h3 className="text-lg font-bold text-white font-display">Programs Calendar</h3>
                <p className="text-sm text-gray-400 mt-0.5">MZYS Onitsha provincial &amp; district programs</p>
              </div>
              <button
                onClick={() => setShowCalendar(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-gray-400 flex items-center justify-center hover:bg-white/20 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {loading && <p className="text-sm text-gray-400 py-4 text-center">Loading calendar…</p>}
              {error && (
                <p className="text-sm text-red-400 py-4 text-center">
                  Could not load the calendar. Please try again later.
                </p>
              )}
              {!loading && !error && (
                <>
                  <section>
                    <h4 className="text-sm font-semibold text-white mb-3">Provincial Programs</h4>
                    <ProgramsTable rows={provincial} />
                  </section>
                  <section>
                    <h4 className="text-sm font-semibold text-white mb-3">District and Branch Programs</h4>
                    <ProgramsTable rows={district} />
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
