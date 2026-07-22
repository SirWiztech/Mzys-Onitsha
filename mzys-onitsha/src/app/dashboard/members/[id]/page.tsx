import { readData } from '@/lib/data';
import { notFound } from 'next/navigation';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import type { Member, Branch } from '@/lib/types';

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const members = await readData<Member>('members.json');
  const branches = await readData<Branch>('branches.json');
  const member = members.find((m) => m.id === id);

  if (!member) notFound();

  const branch = branches.find((b) => b.id === member.branchId);

  return (
    <div>
      <div className="mb-6">
        <a href="/dashboard/members" className="text-sm text-mzys-primary hover:underline">
          &larr; Back to Members
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center text-white text-2xl font-bold">
              {member.firstName[0]}{member.lastName[0]}
            </div>
            <h1 className="text-xl font-bold text-mzys-navy mt-4">
              {member.firstName} {member.lastName}
            </h1>
            <p className="text-sm text-mzys-gray-500">{member.email}</p>
            <div className="mt-3">
              <Badge variant={member.status === 'active' ? 'success' : 'default'}>
                {member.status}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-mzys-navy mb-4">Profile Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Phone', value: member.phone },
              { label: 'Date of Birth', value: member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : '-' },
              { label: 'Gender', value: member.gender === 'male' ? 'Male' : 'Female' },
              { label: 'Branch', value: branch?.name || 'Unknown' },
              { label: 'Unit', value: member.cherubSeraph ? member.cherubSeraph.charAt(0).toUpperCase() + member.cherubSeraph.slice(1) : '-' },
              { label: 'Occupation', value: member.occupation || '-' },
              { label: 'Address', value: member.address || '-' },
              { label: 'Registered', value: new Date(member.registrationDate).toLocaleDateString() },
            ].map((field) => (
              <div key={field.label}>
                <p className="text-xs text-mzys-gray-400 uppercase tracking-wider">{field.label}</p>
                <p className="text-sm font-medium text-mzys-gray-800 mt-0.5">{field.value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
