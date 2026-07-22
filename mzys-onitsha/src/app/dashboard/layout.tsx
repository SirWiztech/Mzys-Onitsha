import { redirect } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import { getSession } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();
  if (!user) redirect('/login');

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar role={user.role} />
      <div className="flex-1 bg-mzys-gray-50 p-6 lg:p-8">{children}</div>
    </div>
  );
}
