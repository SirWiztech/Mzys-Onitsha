'use client';

import { useState } from 'react';
import { CalendarDays, MessageCircle, X } from 'lucide-react';

const yearlyActivities = [
  { month: 'January', event: 'New Year Thanksgiving & Prayer Kickoff' },
  { month: 'February', event: 'Annual General Meeting' },
  { month: 'March', event: 'Youth Conference / Revival Week' },
  { month: 'April', event: 'Easter Outreach & Community Service' },
  { month: 'May', event: 'Inter-Branch Sports Competition' },
  { month: 'June', event: 'Mid-Year Prayer & Fasting' },
  { month: 'July', event: 'Annual Excursion / Retreat' },
  { month: 'August', event: 'Skills Acquisition Workshop' },
  { month: 'September', event: 'Leadership Training Seminar' },
  { month: 'October', event: 'Music & Drama Festival' },
  { month: 'November', event: 'Evangelism Marathon / Outreach' },
  { month: 'December', event: 'End of Year Party & Awards' },
];

export default function FloatingSocial() {
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button
          onClick={() => setShowCalendar(true)}
          className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-110 transition-all duration-200"
          aria-label="Yearly Activities"
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
            className="bg-[#0B1120] border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white font-display">Yearly Activities</h3>
                <p className="text-sm text-gray-400 mt-0.5">MZYS Onitsha annual calendar</p>
              </div>
              <button
                onClick={() => setShowCalendar(false)}
                className="w-8 h-8 rounded-full bg-white/10 text-gray-400 flex items-center justify-center hover:bg-white/20 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-2">
              {yearlyActivities.map((a) => (
                <div
                  key={a.month}
                  className="flex items-start gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span className="text-xs font-semibold text-blue-400 w-20 shrink-0 pt-0.5">
                    {a.month}
                  </span>
                  <span className="text-sm text-gray-300">{a.event}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
