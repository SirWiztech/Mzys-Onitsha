'use client';

import { useEffect, useRef, useCallback } from 'react';

const clamp = (v: number, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v: number, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v: number, fMin: number, fMax: number, tMin: number, tMax: number) =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

interface ProfileCardProps {
  name: string;
  title: string;
  unit: string;
  avatarUrl: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  enableTilt?: boolean;
  enableMobileTilt?: boolean;
  onContactClick?: () => void;
  behindGlowColor?: string;
  iconUrl?: string;
  behindGlowEnabled?: boolean;
  innerGradient?: string;
}

const DEFAULT_INNER_GRADIENT = 'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ProfileCard = ({
  name,
  title,
  unit,
  avatarUrl,
  status,
  contactText = 'Contact',
  showUserInfo = true,
  enableTilt = true,
  enableMobileTilt = false,
  onContactClick,
  behindGlowColor = 'rgba(125, 190, 255, 0.67)',
  iconUrl = '/images/main-mzys-logo.png',
  behindGlowEnabled = true,
  innerGradient = DEFAULT_INNER_GRADIENT,
}: ProfileCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;

    const rect = card.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
    const px = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
    const py = clamp(((clientY - rect.top) / rect.height) * 100, 0, 100);

    const rx = adjust(py, 0, 100, -8, 8);
    const ry = adjust(px, 0, 100, 8, -8);

    card.style.setProperty('--rx', `${rx}deg`);
    card.style.setProperty('--ry', `${ry}deg`);
    glow.style.setProperty('--px', `${px}%`);
    glow.style.setProperty('--py', `${py}%`);
  }, []);

  const resetTilt = useCallback(() => {
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    glow.style.setProperty('--px', '50%');
    glow.style.setProperty('--py', '50%');
  }, []);

  useEffect(() => {
    const isMobile = 'ontouchstart' in window;
    if (!enableTilt || (isMobile && !enableMobileTilt)) return;

    const card = cardRef.current;
    if (!card) return;

    const onMouseMove = (e: MouseEvent) => handleMove(e);
    const onTouchMove = (e: TouchEvent) => {
      handleMove(e);
    };

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', resetTilt);
    card.addEventListener('touchmove', onTouchMove);
    card.addEventListener('touchend', resetTilt);

    return () => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', resetTilt);
      card.removeEventListener('touchmove', onTouchMove);
      card.removeEventListener('touchend', resetTilt);
    };
  }, [enableTilt, enableMobileTilt, handleMove, resetTilt]);

  return (
    <div
      ref={cardRef}
      className="relative w-[280px] h-[360px] rounded-2xl overflow-hidden cursor-pointer transition-transform duration-[180ms] select-none"
      style={{
        transform: 'perspective(600px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Behind glow */}
      {behindGlowEnabled && (
        <div
          className="absolute -inset-4 rounded-[28px] opacity-60 blur-2xl transition-opacity duration-300 pointer-events-none"
          style={{
            background: `radial-gradient(circle at var(--px, 50%) var(--py, 50%), ${behindGlowColor}, transparent 70%)`,
          }}
        />
      )}

      {/* Card face */}
      <div
        className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10"
        style={{ background: innerGradient }}
      >
        {/* Decorative icon pattern */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: `url(${iconUrl})`,
            backgroundSize: '60px',
            backgroundRepeat: 'repeat',
          }}
        />

        {/* Spotlight overlay */}
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
          style={{
            background:
              'radial-gradient(circle at var(--px, 50%) var(--py, 50%), rgba(255,255,255,0.15), transparent 70%)',
          }}
        />

        {/* Avatar */}
        <div className="relative z-20 flex flex-col items-center pt-8">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/20 mb-4">
            <img
              src={avatarUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>

          {status && (
            <span className="text-xs font-medium text-green-400 bg-green-500/15 px-3 py-0.5 rounded-full mb-2">
              {status}
            </span>
          )}

          {showUserInfo && (
            <>
              <h3 className="text-lg font-bold text-white text-center leading-tight">{name}</h3>
              <p className="text-sm text-white/70 mt-0.5">{title}</p>
              <p className="text-xs text-blue-300 mt-0.5">{unit}</p>
            </>
          )}

          <button
            onClick={onContactClick}
            className="mt-auto mb-6 px-5 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
          >
            {contactText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
