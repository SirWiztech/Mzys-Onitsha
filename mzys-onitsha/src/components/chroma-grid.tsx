'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface ChromaItem {
  image: string;
  title: string;
  subtitle: string;
  handle?: string;
  borderColor: string;
  gradient: string;
  url?: string;
}

interface ChromaGridProps {
  items?: ChromaItem[];
  radius?: number;
  damping?: number;
  fadeOut?: number;
  ease?: string;
  className?: string;
}

const ChromaGrid = ({ items, className = '', radius = 300, damping = 0.45, fadeOut = 0.6, ease = 'power3.out' }: ChromaGridProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const setX = useRef<any>(null);
  const setY = useRef<any>(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo: ChromaItem[] = [
    {
      image: '/images/mzys-group-two.jpg',
      title: 'G-Force',
      subtitle: 'Evangelism & Outreach',
      handle: 'Join Team',
      borderColor: '#3B82F6',
      gradient: 'linear-gradient(145deg,#3B82F6,#0B1120)',
      url: '#join-gforce',
    },
    {
      image: '/images/Mzys-Preacher.jpg',
      title: 'Evangelical Team',
      subtitle: 'Preaching & Soul Winning',
      handle: 'Join Team',
      borderColor: '#10B981',
      gradient: 'linear-gradient(210deg,#10B981,#0B1120)',
      url: '#join-evangelical',
    },
    {
      image: '/images/Mzys-Trumpeters.jpg',
      title: 'Music & Drama',
      subtitle: 'Worship, Choir & Drama',
      handle: 'Join Team',
      borderColor: '#F59E0B',
      gradient: 'linear-gradient(165deg,#F59E0B,#0B1120)',
      url: '#join-music',
    },
    {
      image: '/images/Mzys-media-team.jpg',
      title: 'Media Team',
      subtitle: 'Photography, Design & Social Media',
      handle: 'Join Team',
      borderColor: '#8B5CF6',
      gradient: 'linear-gradient(225deg,#8B5CF6,#0B1120)',
      url: '#join-media',
    },
    {
      image: '/images/mzys-sister.jpg',
      title: 'Sisters Fellowship',
      subtitle: 'Women of Faith & Fellowship',
      handle: 'Join Team',
      borderColor: '#EC4899',
      gradient: 'linear-gradient(195deg,#EC4899,#0B1120)',
      url: '#join-sisters',
    },
    {
      image: '/images/Precious-pray.jpg',
      title: 'Prayer Unit',
      subtitle: 'Intercession & Spiritual Warfare',
      handle: 'Join Team',
      borderColor: '#EF4444',
      gradient: 'linear-gradient(195deg,#EF4444,#0B1120)',
      url: '#join-prayer',
    },
    {
      image: '/images/bro-joel.jpg',
      title: 'Sports & Recreation',
      subtitle: 'Athletics, Games & Fellowship',
      handle: 'Join Team',
      borderColor: '#06B6D4',
      gradient: 'linear-gradient(135deg,#06B6D4,#0B1120)',
      url: '#join-sports',
    },
  ];

  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, '--x', 'px');
    setY.current = gsap.quickSetter(el, '--y', 'px');
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    if (setX.current) setX.current(pos.current.x);
    if (setY.current) setY.current(pos.current.y);
  }, []);

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e: React.PointerEvent) => {
    const r = rootRef.current?.getBoundingClientRect();
    if (!r) return;
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true });
  };

  const handleCardClick = (url?: string) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative w-full h-full flex flex-wrap justify-center items-start gap-3 ${className}`}
      style={{
        '--r': `${radius}px`,
        '--x': '50%',
        '--y': '50%',
      } as React.CSSProperties}
    >
      {data.map((c, i) => (
        <article
          key={i}
          onClick={() => handleCardClick(c.url)}
          className="group relative flex flex-col w-[280px] rounded-[20px] overflow-hidden border-2 border-transparent transition-colors duration-300 cursor-pointer"
          style={{
            '--card-border': c.borderColor || 'transparent',
            background: c.gradient,
            '--spotlight-color': 'rgba(255,255,255,0.3)',
          } as React.CSSProperties}
        >
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
            style={{
              background:
                'radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)',
            }}
          />
          <div className="relative z-10 flex-1 p-[10px] box-border">
            <img
              src={c.image}
              alt={c.title}
              loading="lazy"
              className="w-full h-[200px] object-cover rounded-[10px]"
            />
          </div>
          <footer className="relative z-10 p-3 text-white font-sans flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="m-0 text-[1.05rem] font-semibold">{c.title}</h3>
              {c.handle && (
                <span className="text-[0.85rem] font-medium text-white/90 bg-white/15 px-3 py-1 rounded-full">
                  {c.handle}
                </span>
              )}
            </div>
            <p className="m-0 text-[0.85rem] text-white/80">{c.subtitle}</p>
          </footer>
        </article>
      ))}

      {/* Spotlight vignette overlay — dims outer cards, reveals hovered one */}
      <div
        className="absolute inset-0 pointer-events-none z-30"
        style={{
          backdropFilter: 'grayscale(1) brightness(0.78)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
          background: 'rgba(0,0,0,0.001)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),transparent 0%,transparent 15%,rgba(0,0,0,0.10) 30%,rgba(0,0,0,0.22)45%,rgba(0,0,0,0.35)60%,rgba(0,0,0,0.50)75%,rgba(0,0,0,0.68)88%,white 100%)',
        }}
      />
      <div
        ref={fadeRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-[250ms] z-40"
        style={{
          backdropFilter: 'grayscale(1) brightness(0.78)',
          WebkitBackdropFilter: 'grayscale(1) brightness(0.78)',
          background: 'rgba(0,0,0,0.001)',
          maskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--r) at var(--x) var(--y),white 0%,white 15%,rgba(255,255,255,0.90)30%,rgba(255,255,255,0.78)45%,rgba(255,255,255,0.65)60%,rgba(255,255,255,0.50)75%,rgba(255,255,255,0.32)88%,transparent 100%)',
          opacity: 1,
        }}
      />
    </div>
  );
};

export default ChromaGrid;
