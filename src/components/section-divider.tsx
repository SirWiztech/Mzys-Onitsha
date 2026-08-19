import { useEffect, useRef, useState } from "react";

/**
 * SectionDivider
 * ----------------
 * A theme-agnostic divider for separating page sections.
 *
 * Signature interaction: the two hairlines grow outward from a faceted
 * diamond marker the first time the divider scrolls into view, then the
 * marker settles into a slow, quiet glow. Runs once per mount, and skips
 * straight to its resting state if the user prefers reduced motion.
 *
 * Works on light or dark sections out of the box because color comes from
 * CSS variables that default to `currentColor`-friendly neutrals — override
 * them per-instance or per-theme without touching the component.
 *
 * Usage:
 *   <SectionDivider />
 *   <SectionDivider label="Our Work" />
 *   <SectionDivider variant="minimal" />
 *   <SectionDivider accent="#7c5cff" />
 */
export default function SectionDivider({
  label,
  variant = "default", // "default" | "minimal" | "bold"
  accent, // optional CSS color override for the marker + line ends
  className = "",
}: {
  label?: string;
  variant?: "default" | "minimal" | "bold";
  accent?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener?.("change", handleChange);

    const node = containerRef.current;
    if (!node) return;

    if (mq.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      mq.removeEventListener?.("change", handleChange);
    };
  }, []);

  const sizes =
    {
      minimal: { marker: 6, gap: "1rem" },
      default: { marker: 10, gap: "1.25rem" },
      bold: { marker: 14, gap: "1.5rem" },
    }[variant] ?? { marker: 10, gap: "1.25rem" };

  return (
    <div
      ref={containerRef}
      role="separator"
      aria-orientation="horizontal"
      className={`section-divider ${className}`}
      style={{
        "--sd-accent": accent || "var(--divider-accent, #8a8f98)",
        "--sd-line": "var(--divider-line, currentColor)",
        "--sd-marker-size": `${sizes.marker}px`,
        "--sd-gap": sizes.gap,
      } as React.CSSProperties}
    >
      <span
        className={`sd-line sd-line-left ${isVisible ? "sd-grown" : ""} ${
          reduceMotion ? "sd-no-anim" : ""
        }`}
      />

      <span className="sd-marker-wrap">
        <svg
          className={`sd-marker ${isVisible ? "sd-marker-in" : ""} ${
            reduceMotion ? "sd-no-anim" : ""
          }`}
          width={sizes.marker * 2}
          height={sizes.marker * 2}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="12"
            y="1.5"
            width="15"
            height="15"
            rx="2"
            transform="rotate(45 12 12)"
            fill="var(--sd-accent)"
            fillOpacity="0.12"
            stroke="var(--sd-accent)"
            strokeWidth="1.25"
          />
          <rect
            x="12"
            y="6"
            width="8.5"
            height="8.5"
            rx="1"
            transform="rotate(45 12 12)"
            fill="var(--sd-accent)"
          />
        </svg>

        {label ? <span className="sd-label">{label}</span> : null}
      </span>

      <span
        className={`sd-line sd-line-right ${isVisible ? "sd-grown" : ""} ${
          reduceMotion ? "sd-no-anim" : ""
        }`}
      />

      <style>{`
        .section-divider {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 2.5rem 0;
          user-select: none;
        }

        .sd-line {
          flex: 1 1 auto;
          height: 1px;
          transform: scaleX(0);
          transition: transform 1.1s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sd-line-left {
          transform-origin: right center;
          background: linear-gradient(
            to left,
            color-mix(in srgb, var(--sd-line) 28%, transparent),
            transparent
          );
        }

        .sd-line-right {
          transform-origin: left center;
          background: linear-gradient(
            to right,
            color-mix(in srgb, var(--sd-line) 28%, transparent),
            transparent
          );
        }

        .sd-line.sd-grown {
          transform: scaleX(1);
        }

        .sd-line.sd-no-anim {
          transform: scaleX(1);
          transition: none;
        }

        .sd-marker-wrap {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0 var(--sd-gap);
          flex-shrink: 0;
        }

        .sd-marker {
          opacity: 0;
          transform: scale(0.4) rotate(-25deg);
          transition:
            opacity 0.6s ease 0.5s,
            transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s;
          animation: sd-pulse 3.2s ease-in-out infinite;
          animation-play-state: paused;
        }

        .sd-marker.sd-marker-in {
          opacity: 1;
          transform: scale(1) rotate(0deg);
          animation-play-state: running;
        }

        .sd-marker.sd-no-anim {
          opacity: 1;
          transform: scale(1) rotate(0deg);
          transition: none;
        }

        @keyframes sd-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 0 transparent);
          }
          50% {
            filter: drop-shadow(0 0 6px color-mix(in srgb, var(--sd-accent) 55%, transparent));
          }
        }

        .sd-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--sd-accent);
          white-space: nowrap;
          opacity: 0.85;
        }

        @media (prefers-reduced-motion: reduce) {
          .sd-line, .sd-marker {
            transition: none !important;
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
