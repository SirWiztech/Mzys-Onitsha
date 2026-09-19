'use client';

import { useEffect, useState } from 'react';
import ProfileCard from '@/components/profile-card';

interface Exco {
  id: string;
  name: string;
  position: string;
  branch: string;
  isPresident: boolean;
  image: string | null;
  glowColor: string;
}

// ProfileCard renders an <img>, so generate an initials avatar as a data URI
// when an exco has no photo on file (same fallback idea as the dashboard).
function initialsAvatar(name: string): string {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1E3A8A"/><stop offset="100%" stop-color="#3A6CF6"/></linearGradient></defs><rect width="200" height="200" fill="url(#g)"/><text x="50%" y="50%" dy=".35em" text-anchor="middle" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#ffffff">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function ExcoGrid() {
  const [excos, setExcos] = useState<Exco[]>([]);

  useEffect(() => {
    fetch('/api/excos')
      .then((r) => r.json())
      .then((data) => setExcos(Array.isArray(data) ? data : []))
      .catch(() => setExcos([]));
  }, []);

  if (excos.length === 0) {
    return (
      <p className="text-mzys-gray-400 text-sm text-center">Loading executive council...</p>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {excos.map((exco) => (
        <ProfileCard
          key={exco.id}
          name={exco.name}
          title={exco.isPresident ? `${exco.position} 👑` : exco.position}
          unit={exco.branch || 'MZYS Provincial'}
          avatarUrl={exco.image || initialsAvatar(exco.name)}
          status="Active"
          behindGlowColor={exco.glowColor}
        />
      ))}
    </div>
  );
}
