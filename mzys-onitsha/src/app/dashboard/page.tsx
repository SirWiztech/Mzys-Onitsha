import { readData } from '@/lib/data';
import { getSession } from '@/lib/auth';
import Card from '@/components/ui/card';
import type { Member, Branch, MZYSEvent, FinanceRecord, Complaint } from '@/lib/types';

export default async function DashboardPage() {
  const user = await getSession();
  const [members, branches, events, finances, complaints] = await Promise.all([
    readData<Member>('members.json'),
    readData<Branch>('branches.json'),
    readData<MZYSEvent>('events.json'),
    readData<FinanceRecord>('finances.json'),
    readData<Complaint>('complaints.json'),
  ]);

  const stats = [
    { label: 'Total Members', value: members.length, color: 'text-mzys-primary' },
    { label: 'Branches', value: branches.length, color: 'text-mzys-blue' },
    { label: 'Upcoming Events', value: events.length, color: 'text-mzys-success' },
    { label: 'Open Complaints', value: complaints.filter((c) => c.status === 'open').length, color: 'text-mzys-danger' },
  ];

  if (user?.role === 'admin') {
    const totalDues = finances
      .filter((f) => f.type === 'dues')
      .reduce((sum, f) => sum + f.amount, 0);
    stats.push({ label: 'Total Dues Collected', value: totalDues, color: 'text-mzys-warning' });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-mzys-navy">
          Welcome{user ? `, ${user.email}` : ''}!
        </h1>
        <p className="text-sm text-mzys-gray-500 mt-1">
          Here&apos;s what&apos;s happening with MZYS today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-mzys-gray-500">{stat.label}</p>
            <p className={`text-3xl font-bold mt-1 ${stat.color}`}>
              {typeof stat.value === 'number' && stat.label.includes('Dues')
                ? `\u20A6${stat.value.toLocaleString()}`
                : stat.value}
            </p>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-mzys-navy mb-4">Recent Members</h2>
          {members.length === 0 ? (
            <p className="text-sm text-mzys-gray-400">No members registered yet.</p>
          ) : (
            <div className="space-y-3">
              {members.slice(-5).reverse().map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-mzys-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-mzys-gray-800">
                      {m.firstName} {m.lastName}
                    </p>
                    <p className="text-xs text-mzys-gray-400">{m.occupation || 'No occupation'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-mzys-gray-100 text-mzys-gray-500'}`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-mzys-navy mb-4">Upcoming Events</h2>
          {events.length === 0 ? (
            <p className="text-sm text-mzys-gray-400">No events scheduled.</p>
          ) : (
            <div className="space-y-3">
              {events.slice(-5).reverse().map((e) => (
                <div key={e.id} className="flex items-center justify-between py-2 border-b border-mzys-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-mzys-gray-800">{e.title}</p>
                    <p className="text-xs text-mzys-gray-400">{e.location}</p>
                  </div>
                  <span className="text-xs text-mzys-gray-500">
                    {new Date(e.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
