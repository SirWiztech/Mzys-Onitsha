'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  CalendarDays,
  MessageCircle,
  Wallet,
  TrendingUp,
  UserPlus,
  ArrowRight,
  MoreHorizontal,
  ShieldCheck,
  Cake,
  Gift,
  BadgeCheck,
  Crown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import MagicBento from '@/components/magic-bento';
import type { BentoCard } from '@/components/magic-bento';
import { Avatar, AvatarFallback } from '@radix-ui/react-avatar';
import * as Separator from '@radix-ui/react-separator';
import type { Member, Branch, MZYSEvent, FinanceRecord, Complaint } from '@/lib/types';

const chartData = [
  { month: 'Jan', members: 12, events: 4, revenue: 45000 },
  { month: 'Feb', members: 19, events: 6, revenue: 82000 },
  { month: 'Mar', members: 25, events: 8, revenue: 120000 },
  { month: 'Apr', members: 32, events: 5, revenue: 96000 },
  { month: 'May', members: 28, events: 7, revenue: 110000 },
  { month: 'Jun', members: 35, events: 9, revenue: 145000 },
];

const initials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export default function DashboardPage() {
  const [data, setData] = useState<{
    members: Member[];
    branches: Branch[];
    events: MZYSEvent[];
    finances: FinanceRecord[];
    complaints: Complaint[];
    role: string;
    currentMember: Member | null;
    memberId: string | null;
    totalUsers: number;
  }>({ members: [], branches: [], events: [], finances: [], complaints: [], role: 'member', currentMember: null, memberId: null, totalUsers: 0 });

  useEffect(() => {
    const load = async () => {
      const [members, branches, events, finances, complaints, auth] = await Promise.all([
        fetch('/api/members').then((r) => r.json()),
        fetch('/api/branches').then((r) => r.json()),
        fetch('/api/events').then((r) => r.json()),
        fetch('/api/finances').then((r) => r.json()),
        fetch('/api/complaints').then((r) => r.json()),
        fetch('/api/auth').then((r) => r.json()),
      ]);

      const role = auth.user?.role || 'member';
      const memberId = auth.user?.memberId || null;
      const currentMember = memberId
        ? (members as Member[]).find((m: Member) => m.id === memberId) || null
        : null;

      let totalUsers = 0;
      if (role === 'superadmin') {
        try {
          const users = await fetch('/api/users').then((r) => r.json());
          totalUsers = users.length;
        } catch {}
      }

      setData({ members, branches, events, finances, complaints, role, currentMember, memberId, totalUsers });
    };
    load();
  }, []);

  const { members, branches, events, finances, complaints, role, currentMember, totalUsers } = data;

  const totalDues = finances
    .filter((f) => f.type === 'dues')
    .reduce((sum, f) => sum + f.amount, 0);

  const stats: Array<{
    label: string;
    value: string;
    icon: typeof Users;
    href: string;
    color: string;
    bg: string;
    iconColor: string;
  }> = [
    {
      label: 'Total Members',
      value: String(members.length),
      icon: Users,
      href: '/dashboard/members',
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Branches',
      value: String(branches.length),
      icon: Building2,
      href: '/dashboard/branches',
      color: 'from-violet-500 to-violet-600',
      bg: 'bg-violet-50',
      iconColor: 'text-violet-600',
    },
    {
      label: 'Events',
      value: String(events.length),
      icon: CalendarDays,
      href: '/dashboard/events',
      color: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      label: 'Open Complaints',
      value: String(complaints.filter((c) => c.status === 'open').length),
      icon: MessageCircle,
      href: '/dashboard/complaints',
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  if (role === 'exco' || role === 'superadmin') {
    stats.push({
      label: 'Dues Collected',
      value: `\u20A6${totalDues.toLocaleString()}`,
      icon: Wallet,
      href: '/dashboard/finances',
      color: 'from-rose-500 to-rose-600',
      bg: 'bg-rose-50',
      iconColor: 'text-rose-600',
    });
  }

  if (role === 'superadmin') {
    stats.push({
      label: 'Total Users',
      value: String(totalUsers),
      icon: ShieldCheck,
      href: '/dashboard/admin/users',
      color: 'from-amber-500 to-amber-600',
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    });
  }

  const recentMembers = [...members].reverse().slice(0, 5);
  const getBranchName = (id: string) => branches.find((b) => b.id === id)?.name || '-';

  const upcomingBirthdays = members
    .filter((m) => m.dateOfBirth)
    .map((m) => {
      const dob = new Date(m.dateOfBirth);
      const today = new Date();
      const thisYear = today.getFullYear();
      const bdayThisYear = new Date(thisYear, dob.getMonth(), dob.getDate());
      const diffDays = Math.ceil((bdayThisYear.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...m, bdayThisYear, diffDays };
    })
    .filter((m) => m.diffDays >= 0 && m.diffDays <= 60)
    .sort((a, b) => a.diffDays - b.diffDays)
    .slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold overflow-hidden shrink-0">
          {currentMember?.profileImage ? (
            <img src={currentMember.profileImage} alt="" className="w-full h-full object-cover" />
          ) : (
            currentMember ? `${currentMember.firstName[0]}${currentMember.lastName[0]}` : 'U'
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome{currentMember ? `, ${currentMember.firstName}` : ''}!
            </h1>
            <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
              role === 'superadmin'
                ? 'bg-amber-50 text-amber-700'
                : role === 'exco'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-emerald-50 text-emerald-700'
            }`}>
              {role === 'superadmin' ? <Crown className="w-3 h-3" /> : <BadgeCheck className="w-3 h-3" />}
              Verified {role === 'superadmin' ? 'Super Admin' : role === 'exco' ? 'Exco' : 'Member'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Here&apos;s your MZYS overview.
          </p>
        </div>
      </div>

      {/* Stats Grid — MagicBento */}
      {(() => {
        const bentoCards: BentoCard[] = stats.map((stat) => ({
          color: '#0B1120',
          title: stat.value,
          description: `Click to view ${stat.label.toLowerCase()}`,
          label: stat.label,
        }));
        if (bentoCards.length < 6) {
          bentoCards.push(
            { color: '#0B1120', title: 'MZYS', description: 'Membership Management System', label: 'Platform' },
            { color: '#0B1120', title: 'Onitsha', description: 'MZYS Onitsha branch', label: 'Location' },
          );
        }
        return <MagicBento cards={bentoCards.slice(0, 6)} enableTilt={false} enableMagnetism={true} clickEffect={true} enableBorderGlow={true} />;
      })()}

      {/* Chart + Recent Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Activity Overview</h2>
              <p className="text-xs text-gray-500 mt-0.5">Member growth & engagement</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                Members
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Events
              </span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="membersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="eventsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    fontSize: '13px',
                  }}
                />
                <Area type="monotone" dataKey="members" stroke="#3B82F6" strokeWidth={2} fill="url(#membersGradient)" />
                <Area type="monotone" dataKey="events" stroke="#10B981" strokeWidth={2} fill="url(#eventsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Members */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Recent Members</h2>
              <p className="text-xs text-gray-500 mt-0.5">Latest registrations</p>
            </div>
            <Link
              href="/dashboard/members"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentMembers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No members yet.</p>
            ) : (
              recentMembers.map((m, i) => (
                <div key={m.id}>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
                      <AvatarFallback>{initials(`${m.firstName} ${m.lastName}`)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {m.firstName} {m.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{getBranchName(m.branchId)}</p>
                    </div>
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        m.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  {i < recentMembers.length - 1 && (
                    <Separator.Root className="my-3 h-px bg-gray-100" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Birthdays */}
      {(role === 'exco' || role === 'superadmin') && upcomingBirthdays.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Cake className="w-5 h-5 text-pink-500" />
            <h2 className="text-base font-semibold text-gray-900">Upcoming Birthdays</h2>
            <span className="text-xs text-gray-400 ml-1">(&ndash; next 60 days)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
            {upcomingBirthdays.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {m.firstName} {m.lastName}
                  </p>
                  <p className="text-[11px] text-pink-600 font-medium">
                    {new Date(m.dateOfBirth).toLocaleDateString('en', { day: 'numeric', month: 'short' })}
                    {m.diffDays === 0 ? ' &mdash; Today!' : m.diffDays <= 7 ? ` &mdash; in ${m.diffDays}d` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Section: Upcoming Events + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Upcoming Events</h2>
              <p className="text-xs text-gray-500 mt-0.5">Scheduled activities</p>
            </div>
            <Link
              href="/dashboard/events"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </Link>
          </div>
          {events.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No events scheduled.</p>
          ) : (
            <div className="space-y-3">
              {events
                .slice()
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((e, i) => (
                  <div key={e.id}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex flex-col items-center justify-center text-white shrink-0">
                        <span className="text-[10px] font-medium leading-none uppercase">
                          {new Date(e.date).toLocaleDateString('en', { month: 'short' })}
                        </span>
                        <span className="text-base font-bold leading-none mt-0.5">
                          {new Date(e.date).getDate()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{e.title}</p>
                        <p className="text-xs text-gray-400 truncate">{e.location}</p>
                      </div>
                      <span className="text-[11px] text-gray-400 capitalize bg-gray-50 px-2 py-1 rounded-md">
                        {e.type}
                      </span>
                    </div>
                    {i < 4 && <Separator.Root className="my-3 h-px bg-gray-100" />}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {(role === 'exco' || role === 'superadmin') ? (
              <Link
                href="/dashboard/members/add"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    Add Member
                  </p>
                  <p className="text-xs text-gray-400">Register a new member</p>
                </div>
              </Link>
            ) : (
              <Link
                href="/dashboard/members"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                    View Members
                  </p>
                  <p className="text-xs text-gray-400">Browse member directory</p>
                </div>
              </Link>
            )}
            <Separator.Root className="h-px bg-gray-100" />
            <Link
              href="/dashboard/events"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 group-hover:text-emerald-600 transition-colors">
                  Create Event
                </p>
                <p className="text-xs text-gray-400">Schedule an activity</p>
              </div>
            </Link>
            <Separator.Root className="h-px bg-gray-100" />
            <Link
              href="/dashboard/finances"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <Wallet className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 group-hover:text-amber-600 transition-colors">
                  Record Payment
                </p>
                <p className="text-xs text-gray-400">Log dues or donation</p>
              </div>
            </Link>
            <Separator.Root className="h-px bg-gray-100" />
            <Link
              href="/dashboard/complaints"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-50 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800 group-hover:text-rose-600 transition-colors">
                  View Complaints
                </p>
                <p className="text-xs text-gray-400">Respond to open tickets</p>
              </div>
            </Link>
            {role === 'superadmin' && (
              <>
                <Separator.Root className="h-px bg-gray-100" />
                <Link
                  href="/dashboard/admin/users"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-amber-600 transition-colors">
                      User Management
                    </p>
                    <p className="text-xs text-gray-400">Block or unblock users</p>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
