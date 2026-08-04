import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import AppShell from '@/components/app-shell';
import { getSession } from '@/lib/auth';
import { readData } from '@/lib/data';
import type { Member } from '@/lib/types';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect('/login');

  const headerList = await headers();
  const pathname = headerList.get('x-pathname') || '';

  if (user.role !== 'superadmin') {
    const restricted = ['/dashboard', '/dashboard/'];
    if (restricted.includes(pathname)) {
      redirect('/dashboard/feed');
    }
  }

  if (user.role === 'member') {
    const restricted = ['/dashboard/members', '/dashboard/members/'];
    if (restricted.includes(pathname) || pathname.startsWith('/dashboard/members/')) {
      redirect('/dashboard/notifications');
    }
  }

  let profileImage: string | null = null;
  let firstName: string | null = null;
  if (user.memberId) {
    const members = await readData<Member>('members.json');
    const member = members.find((m) => m.id === user.memberId);
    if (member) {
      profileImage = member.profileImage;
      firstName = member.firstName;
    }
  }

  return (
    <AppShell role={user.role} profileImage={profileImage} firstName={firstName}>
      <div className="font-display">{children}</div>
    </AppShell>
  );
}
