'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ToastProvider } from '@/components/ui/toast';
import GlassIcon from '@/components/glass-icon';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  CalendarDays,
  Shield,
  ShieldCheck,
  MessageCircle,
  Building2,
  Wallet,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  User,
  Package,
  Bell,
  Rows,
  Receipt,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  minRole?: 'exco' | 'superadmin';
};

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, minRole: 'superadmin' },
  { href: '/dashboard/feed', label: 'Products Feed', icon: Rows },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/profile', label: 'My Profile', icon: User },
  { href: '/dashboard/dues', label: 'My Dues', icon: Receipt },
  { href: '/dashboard/members', label: 'Members', icon: Users, minRole: 'exco' },
  { href: '/dashboard/members/add', label: 'Add Member', icon: UserPlus, minRole: 'exco' },
  { href: '/dashboard/events', label: 'Events', icon: CalendarDays },
  { href: '/dashboard/leadership', label: 'Leadership', icon: Shield },
  { href: '/dashboard/complaints', label: 'Support', icon: MessageCircle },
  { href: '/dashboard/profile', label: 'My Products', icon: Package },
  { href: '/dashboard/branches', label: 'Branches', icon: Building2, minRole: 'exco' },
  { href: '/dashboard/finances', label: 'Finances', icon: Wallet, minRole: 'exco' },
  { href: '/dashboard/admin/users', label: 'User Mgmt', icon: ShieldCheck, minRole: 'superadmin' },
];

function hasAccess(role: string | undefined, minRole?: 'exco' | 'superadmin'): boolean {
  if (!minRole) return true;
  if (minRole === 'superadmin') return role === 'superadmin';
  return role === 'exco' || role === 'superadmin';
}

export default function AppShell({
  children,
  role,
  profileImage,
  firstName,
}: {
  children: React.ReactNode;
  role?: string;
  profileImage?: string | null;
  firstName?: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = navItems.filter((item) => hasAccess(role, item.minRole));

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/');
    router.refresh();
  };

  return (
    <ToastProvider>
    <div className="h-screen bg-[#F8FAFC] flex overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-0 lg:w-16'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className={`flex items-center justify-between h-16 px-4 border-b border-gray-100 ${!sidebarOpen && 'lg:px-2 lg:justify-center'}`}>
          {sidebarOpen && (
            <Link href="/" className="flex items-center gap-2.5">
              <img src="/images/main-mzys-logo.png" alt="" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg text-mzys-navy tracking-tight">MZYS</span>
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-7 h-7 rounded-lg items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors flex"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {filtered.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                }`}
                title={item.label}
              >
                <GlassIcon
                  icon={<item.icon className="w-[1.2em] h-[1.2em]" />}
                  label={item.label}
                  active={active}
                />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className={`p-3 border-t border-gray-100 ${!sidebarOpen && 'lg:p-2'}`}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0 text-gray-400" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="shrink-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <Link href="/dashboard/profile">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold overflow-hidden ${
                  role === 'superadmin' ? 'bg-amber-500' : role === 'exco' ? 'bg-blue-500' : 'bg-gray-400'
                }`}>
                  {profileImage ? (
                    <img src={profileImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    firstName?.[0]?.toUpperCase() || role?.[0]?.toUpperCase() || 'U'
                  )}
                </div>
              </Link>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-700">
                  Welcome{firstName ? `, ${firstName}` : ''}
                </p>
                <p className="text-xs text-gray-400">MZYS Dashboard</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
    </ToastProvider>
  );
}
