'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  Building2,
  Sparkles,
  Activity,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import SpecularButton from '@/components/specular-button';

interface NavbarProps {
  user?: { role: string } | null;
}

interface NavLink {
  label: string;
  href: string;
  match?: string;
  adminOnly?: boolean;
  icon?: React.ReactNode;
}

const landingLinks: NavLink[] = [
  { label: 'Features', href: '#features', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { label: 'Teams', href: '#special-activities', icon: <CalendarDays className="w-3.5 h-3.5" /> },
  { label: 'Excos', href: '#excos', icon: <Users className="w-3.5 h-3.5" /> },
  { label: 'Activities', href: '#activities', icon: <Activity className="w-3.5 h-3.5" /> },
  { label: 'Join', href: '#join', icon: <UserPlus className="w-3.5 h-3.5" /> },
];

const dashboardLinks: NavLink[] = [
  { label: 'Dashboard', href: '/dashboard', match: '/dashboard', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
  { label: 'Members', href: '/dashboard/members', match: '/dashboard/members', icon: <Users className="w-3.5 h-3.5" /> },
  { label: 'Events', href: '/dashboard/events', match: '/dashboard/events', icon: <CalendarDays className="w-3.5 h-3.5" /> },
  { label: 'Branches', href: '/dashboard/branches', match: '/dashboard/branches', adminOnly: true, icon: <Building2 className="w-3.5 h-3.5" /> },
];

function isActive(href: string, match?: string, pathname?: string): boolean {
  if (!match || !pathname) return false;
  return pathname === match || pathname.startsWith(match + '/');
}

function useScrollState() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return scrolled;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  open: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
  closed: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const mobileItemVariants = {
  open: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
  closed: { opacity: 0, y: 16, transition: { duration: 0.2 } },
} as const;

const lineVariants = {
  open: (i: number) => ({
    rotate: i === 0 ? 45 : i === 1 ? -45 : 0,
    y: i === 0 ? 6 : i === 1 ? -6 : 0,
    opacity: i === 2 ? 0 : 1,
  }),
  closed: { rotate: 0, y: 0, opacity: 1 },
} as const;

export default function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();
  const scrolled = useScrollState() || ['/login', '/register', '/forgot-password'].includes(pathname);
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isLanding = pathname === '/';
  const links = isLanding && !user ? landingLinks : dashboardLinks.filter((l) => !l.adminOnly || ['exco', 'superadmin'].includes(user?.role || ''));

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/');
    router.refresh();
  }, [router]);

  const scrollToSection = useCallback((href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileOpen(false);
  }, []);

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={false}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-7xl rounded-2xl"
        style={{
          background: scrolled
            ? 'rgba(255, 255, 255, 0.85)'
            : 'rgba(255, 255, 255, 0)',
          backdropFilter: scrolled ? 'blur(24px) saturate(2.2)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(2.2)' : 'blur(0px)',
          border: scrolled ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
          boxShadow: scrolled
            ? '0 4px 30px -8px rgba(0, 0, 0, 0.1)'
            : 'none',
          transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Glassmorphism glow orbs */}
        {scrolled && (
          <>
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-16 w-80 h-80 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        <div
          className={`relative px-5 sm:px-7 lg:px-9 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            scrolled ? 'h-14' : 'h-16'
          } flex items-center justify-between`}
        >
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group flex-shrink-0 relative z-10"
            aria-label="MZYS Home"
          >
            <motion.div
              layout
              whileHover={prefersReducedMotion ? undefined : { rotate: -4, scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src="/images/main-mzys-logo.png"
                alt="MZYS"
                className={`block object-contain transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] drop-shadow-sm ${
                  scrolled ? 'w-44 h-10' : 'w-56 h-14'
                }`}
              />
            </motion.div>
          </Link>

          {/* Desktop Nav Links - Removed white background container */}
          <div className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2">
            {links.length > 0 && (
              <div className="flex items-center gap-1">
                {links.map((link) => {
                  const active = link.href.startsWith('#')
                    ? false
                    : isActive(link.href, link.match || link.href, pathname);
                  const isHovered = hoveredLink === link.label;

                  if (link.href.startsWith('#')) {
                    return (
                      <button
                        key={link.label}
                        onClick={() => scrollToSection(link.href)}
                        onMouseEnter={() => setHoveredLink(link.label)}
                        onMouseLeave={() => setHoveredLink(null)}
                        className={`relative inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-blue-500/50 focus-visible:outline-offset-2 ${
                          active
                            ? scrolled ? 'text-slate-900' : 'text-white'
                            : scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
                        }`}
                      >
                        {link.icon && <span className="shrink-0">{link.icon}</span>}
                        <span className="relative z-10">{link.label}</span>
                        {(active || isHovered) && (
                          <motion.div
                            layoutId="nav-indicator"
                            className="absolute inset-0 rounded-full bg-white/60 shadow-sm border border-white/40"
                            style={{ zIndex: 0 }}
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                          />
                        )}
                      </button>
                    );
                  }

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onMouseEnter={() => setHoveredLink(link.label)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className={`relative inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-blue-500/50 focus-visible:outline-offset-2 ${
                        active
                          ? scrolled ? 'text-slate-900' : 'text-white'
                          : scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {link.icon && <span className="shrink-0">{link.icon}</span>}
                      <span className="relative z-10">{link.label}</span>
                      {(active || isHovered) && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute inset-0 rounded-full bg-white/60 shadow-sm border border-white/40"
                          style={{ zIndex: 0 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0 relative z-10">
            {user ? (
              <>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/40 shadow-sm capitalize tracking-wide select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/30" aria-hidden />
                    {user.role}
                  </span>
                  <motion.button
                    onClick={handleLogout}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-rose-600 rounded-full hover:bg-rose-50/60 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-rose-300 focus-visible:outline-offset-2 backdrop-blur-sm"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Logout
                  </motion.button>
              </>
            ) : (
              <>
                <motion.div whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/login"
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-500/50 focus-visible:outline-offset-2 backdrop-blur-sm ${
                      scrolled
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-white/30'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    Login
                  </Link>
                </motion.div>
                <Link href="/register">
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                    <SpecularButton
                      size="sm"
                      radius={999}
                      tint="#3A6CF6"
                      tintOpacity={0.15}
                      textColor={scrolled ? "#0A1F5C" : "#ffffff"}
                      lineColor={scrolled ? "#0A1F5C" : "#0A1F5C"}
                      baseColor={scrolled ? "#ffffff" : "#ffffff"}
                      intensity={1.2}
                      shineSize={12}
                      shineFade={50}
                      thickness={1.2}
                      speed={0.4}
                      followMouse
                      proximity={200}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Register
                    </SpecularButton>
                  </motion.div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <motion.button
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`md:hidden p-2 rounded-full transition-colors hover:bg-white/30 focus-visible:outline-2 focus-visible:outline-blue-500/50 focus-visible:outline-offset-2 backdrop-blur-sm ${
              scrolled ? 'text-slate-600 hover:text-slate-900' : 'text-white/80 hover:text-white'
            }`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            whileTap={{ scale: 0.88 }}
          >
            <div className="w-5 h-5 flex flex-col justify-center gap-[5px] overflow-hidden">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={lineVariants}
                  animate={mobileOpen ? 'open' : 'closed'}
                  className="block h-[2px] w-5 rounded-full bg-current origin-center"
                />
              ))}
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="md:hidden relative z-50 overflow-hidden border-t border-white/20"
              style={{
                background: scrolled
                  ? 'rgba(255, 255, 255, 0.95)'
                  : 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(24px) saturate(2.2)',
                WebkitBackdropFilter: 'blur(24px) saturate(2.2)',
              }}
            >
              <motion.div
                variants={containerVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="px-5 py-4 space-y-1"
              >
                {links.map((link) => {
                  const active = link.href.startsWith('#')
                    ? false
                    : isActive(link.href, link.match || link.href, pathname);

                  if (link.href.startsWith('#')) {
                    return (
                      <motion.div key={link.label} variants={mobileItemVariants}>
                        <button
                          onClick={() => scrollToSection(link.href)}
                          className="w-full text-left inline-flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-500/50 focus-visible:outline-offset-2"
                          style={{
                            color: active ? '#0A1F5C' : '#475569',
                            background: active ? 'rgba(58, 108, 246, 0.06)' : 'transparent',
                          }}
                        >
                          {link.icon && <span className="shrink-0 opacity-60">{link.icon}</span>}
                          {link.label}
                        </button>
                      </motion.div>
                    );
                  }

                  return (
                    <motion.div key={link.label} variants={mobileItemVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="block w-full inline-flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-500/50 focus-visible:outline-offset-2"
                        style={{
                          color: active ? '#0A1F5C' : '#475569',
                          background: active ? 'rgba(58, 108, 246, 0.06)' : 'transparent',
                        }}
                      >
                        {link.icon && <span className="shrink-0 opacity-60">{link.icon}</span>}
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div variants={mobileItemVariants} className="pt-3 border-t border-slate-200/30 mt-3 space-y-1">
                  {user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full text-left inline-flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-600 rounded-xl hover:bg-rose-50/70 transition-colors focus-visible:outline-2 focus-visible:outline-rose-300 focus-visible:outline-offset-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setMobileOpen(false)}
                        className="block w-full inline-flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 rounded-xl hover:bg-white/30 transition-colors focus-visible:outline-2 focus-visible:outline-blue-500/50 focus-visible:outline-offset-2"
                      >
                        <LogIn className="w-4 h-4" />
                        Login
                      </Link>
                      <Link
                        href="/register"
                        onClick={() => setMobileOpen(false)}
                        className="block w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl text-center shadow-lg shadow-blue-500/25"
                      >
                        <UserPlus className="w-4 h-4" />
                        Register
                      </Link>
                    </>
                  )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}