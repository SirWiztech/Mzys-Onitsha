'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

interface NavbarProps {
  user?: {
    role: string;
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="bg-white border-b border-mzys-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg text-mzys-navy hidden sm:block">MZYS</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    pathname === '/dashboard'
                      ? 'text-mzys-primary'
                      : 'text-mzys-gray-600 hover:text-mzys-navy'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/members"
                  className={`text-sm font-medium transition-colors ${
                    pathname.startsWith('/dashboard/members')
                      ? 'text-mzys-primary'
                      : 'text-mzys-gray-600 hover:text-mzys-navy'
                  }`}
                >
                  Members
                </Link>
                <Link
                  href="/dashboard/events"
                  className={`text-sm font-medium transition-colors ${
                    pathname.startsWith('/dashboard/events')
                      ? 'text-mzys-primary'
                      : 'text-mzys-gray-600 hover:text-mzys-navy'
                  }`}
                >
                  Events
                </Link>
                {user.role === 'admin' && (
                  <Link
                    href="/dashboard/branches"
                    className={`text-sm font-medium transition-colors ${
                      pathname.startsWith('/dashboard/branches')
                        ? 'text-mzys-primary'
                        : 'text-mzys-gray-600 hover:text-mzys-navy'
                    }`}
                  >
                    Branches
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-mzys-gray-600 hover:text-mzys-danger transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-mzys-gray-600 hover:text-mzys-navy transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-mzys-primary rounded-lg hover:bg-mzys-blue transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-mzys-gray-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-mzys-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            {user ? (
              <>
                <Link href="/dashboard" className="block py-2 text-sm text-mzys-gray-600" onClick={() => setMobileOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/dashboard/members" className="block py-2 text-sm text-mzys-gray-600" onClick={() => setMobileOpen(false)}>
                  Members
                </Link>
                <Link href="/dashboard/events" className="block py-2 text-sm text-mzys-gray-600" onClick={() => setMobileOpen(false)}>
                  Events
                </Link>
                {user.role === 'admin' && (
                  <Link href="/dashboard/branches" className="block py-2 text-sm text-mzys-gray-600" onClick={() => setMobileOpen(false)}>
                    Branches
                  </Link>
                )}
                <button onClick={handleLogout} className="block py-2 text-sm text-mzys-danger">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-sm text-mzys-gray-600" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="block py-2 text-sm text-mzys-primary font-medium" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
