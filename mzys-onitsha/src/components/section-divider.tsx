'use client';

import { useId } from 'react';
import { motion, type Transition } from 'framer-motion';

export type BlobVariant = 'blob1' | 'blob2' | 'blob3';

interface SectionDividerProps {
  topColor?: string;
  bottomColor?: string;
  accentColor?: string;
  height?: number;
  flip?: boolean;
  variant?: BlobVariant;
  animate?: boolean;
  className?: string;
}

const blobPaths: Record<BlobVariant, { fwd: string; rev: string }> = {
  blob1: {
    fwd: 'M0,96 C120,140 240,12 360,72 C480,132 600,0 720,48 C840,96 960,28 1080,60 C1200,92 1320,44 1440,80 L1440,0 L0,0 Z',
    rev: 'M0,24 C120,-20 240,108 360,48 C480,-12 600,120 720,72 C840,24 960,92 1080,60 C1200,28 1320,76 1440,40 L1440,0 L0,0 Z',
  },
  blob2: {
    fwd: 'M0,72 C160,132 280,8 440,56 C600,104 720,16 840,64 C960,112 1080,4 1200,48 C1320,92 1380,28 1440,60 L1440,0 L0,0 Z',
    rev: 'M0,48 C160,-12 280,112 440,64 C600,16 720,104 840,56 C960,8 1080,116 1200,72 C1320,28 1380,92 1440,60 L1440,0 L0,0 Z',
  },
  blob3: {
    fwd: 'M0,48 C96,104 240,60 360,96 C480,132 600,20 720,44 C840,68 960,100 1080,52 C1200,4 1320,36 1440,88 L1440,0 L0,0 Z',
    rev: 'M0,72 C96,16 240,60 360,24 C480,-12 600,100 720,76 C840,52 960,20 1080,68 C1200,116 1320,84 1440,32 L1440,0 L0,0 Z',
  },
};

const morphPaths: Record<BlobVariant, { fwd: string; rev: string }> = {
  blob1: {
    fwd: 'M0,84 C140,132 260,8 380,64 C500,120 620,4 740,56 C860,108 980,32 1100,68 C1220,104 1340,48 1440,88 L1440,0 L0,0 Z',
    rev: 'M0,40 C120,-10 240,96 360,60 C480,24 600,108 720,64 C840,20 960,84 1080,52 C1200,20 1320,68 1440,36 L1440,0 L0,0 Z',
  },
  blob2: {
    fwd: 'M0,60 C160,8 280,104 440,56 C600,8 720,116 840,68 C960,20 1080,104 1200,48 C1320,-8 1380,72 1440,40 L1440,0 L0,0 Z',
    rev: 'M0,60 C160,108 280,24 440,68 C600,112 720,8 840,56 C960,104 1080,20 1200,64 C1320,108 1380,36 1440,72 L1440,0 L0,0 Z',
  },
  blob3: {
    fwd: 'M0,64 C96,8 240,52 360,16 C480,-20 600,92 720,68 C840,44 960,12 1080,60 C1200,108 1320,76 1440,24 L1440,0 L0,0 Z',
    rev: 'M0,32 C96,88 240,44 360,80 C480,116 600,4 720,28 C840,52 960,84 1080,36 C1200,-12 1320,20 1440,72 L1440,0 L0,0 Z',
  },
};

const morphTransition: Transition = {
  duration: 8,
  ease: 'easeInOut',
  repeat: Infinity,
  repeatType: 'reverse',
};

export default function SectionDivider({
  topColor = '#0B1120',
  bottomColor = '#0B1120',
  accentColor,
  height = 120,
  flip = false,
  variant = 'blob1',
  animate = false,
  className = '',
}: SectionDividerProps) {
  const uid = useId();
  const id = `sg-${uid}`;

  const key = flip ? 'rev' : 'fwd';
  const path = blobPaths[variant][key];
  const morphPath = morphPaths[variant][key];

  const baseAccent = accentColor || 'rgba(59,130,246,0.06)';

  return (
    <div
      className={`relative w-full overflow-hidden pointer-events-none ${className}`}
      style={{ height, marginTop: -height }}
      aria-hidden="true"
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 1440 ${height}`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`${id}-g1`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={topColor} stopOpacity="0" />
            <stop offset="60%" stopColor={topColor} stopOpacity="0.94" />
          </linearGradient>
          <linearGradient id={`${id}-g2`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={bottomColor} stopOpacity="0" />
            <stop offset="50%" stopColor={baseAccent} stopOpacity="1" />
            <stop offset="100%" stopColor={bottomColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {animate ? (
          <g>
            <motion.path
              d={path}
              fill={`url(#${id}-g1)`}
              animate={{ d: morphPath }}
              transition={morphTransition}
            />
            <motion.path
              d={path}
              fill={`url(#${id}-g2)`}
              animate={{ d: morphPath }}
              transition={morphTransition}
              style={{ filter: 'blur(3px)' }}
            />
          </g>
        ) : (
          <g>
            <path d={path} fill={`url(#${id}-g1)`} />
            <path
              d={path}
              fill={`url(#${id}-g2)`}
              style={{ filter: 'blur(3px)' }}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
