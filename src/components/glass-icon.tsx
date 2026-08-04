'use client';

import type { ReactNode } from 'react';

const gradients: Record<string, string> = {
  blue: 'linear-gradient(hsl(223, 90%, 50%), hsl(208, 90%, 50%))',
  purple: 'linear-gradient(hsl(283, 90%, 50%), hsl(268, 90%, 50%))',
  red: 'linear-gradient(hsl(3, 90%, 50%), hsl(348, 90%, 50%))',
  indigo: 'linear-gradient(hsl(253, 90%, 50%), hsl(238, 90%, 50%))',
  orange: 'linear-gradient(hsl(43, 90%, 50%), hsl(28, 90%, 50%))',
  green: 'linear-gradient(hsl(123, 90%, 40%), hsl(108, 90%, 40%))',
};

const iconColors: Record<string, string> = {
  default: 'blue',
  overview: 'blue',
  feed: 'purple',
  notifications: 'orange',
  profile: 'green',
  dues: 'indigo',
  members: 'blue',
  'add-member': 'green',
  events: 'red',
  leadership: 'purple',
  support: 'orange',
  products: 'indigo',
  branches: 'green',
  finances: 'red',
  'user-mgmt': 'purple',
};

function getColor(label: string): string {
  const key = label.toLowerCase().replace(/\s+/g, '-');
  return iconColors[key] || 'blue';
}

export default function GlassIcon({
  icon,
  label,
  active = false,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  const color = getColor(label);
  const bg = gradients[color];
  const isActive = active;

  return (
    <span className="relative w-9 h-9 [perspective:24em] [transform-style:preserve-3d] shrink-0 block group/glass">
      {/* Back layer — colored gradient, visible on hover/active */}
      <span
        className={`absolute inset-0 rounded-xl block transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[100%_100%] rotate-[15deg] will-change-transform group-hover/glass:[transform:rotate(25deg)_translate3d(-0.25em,-0.25em,0.35em)] ${
          isActive ? 'opacity-100' : 'opacity-0 group-hover/glass:opacity-100'
        }`}
        style={{
          background: bg,
          boxShadow: '0.25em -0.25em 0.5em hsla(223, 10%, 10%, 0.12)',
        }}
      />

      {/* Front layer — glass panel with icon */}
      <span
        className={`absolute inset-0 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.83,0,0.17,1)] origin-[80%_50%] flex backdrop-blur-[0.75em] [-webkit-backdrop-filter:blur(0.75em)] will-change-transform group-hover/glass:[transform:translate3d(0,0,2em)] ${
          isActive ? 'bg-white/20 shadow-[0_0_0_0.075em_hsla(0,0%,100%,0.3)_inset]' : 'shadow-[0_0_0_0.075em_hsla(0,0%,0%,0.06)_inset]'
        }`}
        style={{
          background: isActive ? undefined : 'hsla(0,0%,0%,0.03)',
        }}
      >
        <span
          className={`m-auto flex items-center justify-center transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-gray-400 group-hover/glass:text-white'
          }`}
        >
          {icon}
        </span>
      </span>
    </span>
  );
}
