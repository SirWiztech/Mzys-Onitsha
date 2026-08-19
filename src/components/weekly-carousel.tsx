'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Slide = {
  day: string;
  title: string;
  description: string;
  time: string;
  gradient: string;
  light: boolean;
};

const slides: Slide[] = [
  {
    day: 'Tuesday',
    title: 'Bible Classes',
    description: "Join us for weekly Bible classes and grow deeper in God's Word.",
    time: '8:00 PM — 9:00 PM',
    gradient: 'from-mzys-navy to-mzys-primary',
    light: false,
  },
  {
    day: 'Thursday',
    title: 'Sisters Forum (Online)',
    description: 'Online teaching for the sisters — 3rd Thursday of every month.',
    time: '9:00 PM · 3rd Thursday',
    gradient: 'from-[#1E3A8A] to-[#3A6CF6]',
    light: false,
  },
  {
    day: 'Friday',
    title: 'Sisters Fellowship (Physical)',
    description: 'Physical fellowship meeting for the sisters — last Friday of the month.',
    time: 'Last Friday of the month',
    gradient: 'from-[#0A1F5C] to-[#1E3A8A]',
    light: false,
  },
  {
    day: 'Sunday',
    title: 'G-Force Teaching',
    description: 'Join the G-Force teaching session and be equipped for growth.',
    time: '6:00 PM',
    gradient: 'from-mzys-primary to-mzys-light',
    light: true,
  },
];

const count = slides.length;
const AUTOPLAY_DELAY = 5000;
const DRAG_THRESHOLD = 40;

function Card({ slide }: { slide: Slide }) {
  const label = slide.light ? 'text-white/70' : 'text-mzys-light';
  const title = 'text-white';
  const desc = slide.light ? 'text-white/80' : 'text-mzys-gray-300';
  const time = slide.light ? 'text-white/60' : 'text-mzys-gray-400';

  return (
    <div
      className={`w-full h-full rounded-xl bg-gradient-to-br ${slide.gradient} p-8 flex flex-col justify-between`}
    >
      <div>
        <span className={`text-xs font-semibold uppercase tracking-wider ${label}`}>
          {slide.day}
        </span>
        <h3 className={`text-2xl font-bold mt-2 font-display ${title}`}>{slide.title}</h3>
        <p className={`mt-3 ${desc}`}>{slide.description}</p>
      </div>
      <div className={`flex items-center gap-2 text-sm ${time}`}>
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {slide.time}
      </div>
    </div>
  );
}

export default function WeeklyCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef<number | null>(null);
  const isPointerDown = useRef(false);

  const goTo = useCallback((index: number) => {
    setCurrent(((index % count) + count) % count);
  }, []);
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [next, paused]);

  const finishDrag = () => {
    if (startX.current === null) return;
    const delta = startX.current;
    startX.current = null;
    if (Math.abs(delta) < DRAG_THRESHOLD) return;
    if (delta > 0) prev();
    else next();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = startX.current === null ? 0 : e.changedTouches[0].clientX - startX.current;
    startX.current = null;
    setPaused(false);
    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      if (delta < 0) next();
      else prev();
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDown.current = true;
    startX.current = e.clientX;
    setPaused(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const delta = startX.current === null || !isPointerDown.current ? 0 : e.clientX - startX.current;
    startX.current = null;
    isPointerDown.current = false;
    setPaused(false);
    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      if (delta < 0) next();
      else prev();
    }
  };

  return (
    <div
      className="relative w-full max-w-[420px] mx-auto"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <div className="relative overflow-hidden rounded-xl shadow-2xl shadow-mzys-navy/50 select-none">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((s, i) => (
            <div key={i} className="w-full shrink-0">
              <Card slide={s} />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={prev}
        aria-label="Previous activity"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        aria-label="Next activity"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      <div className="mt-5 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-mzys-primary' : 'w-2 bg-white/25 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}