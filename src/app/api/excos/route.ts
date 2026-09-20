import { NextResponse } from 'next/server';
import { readData } from '@/lib/data';
import { POSITION_ORDER, STATIC_IMAGES } from '@/lib/leadership';
import type { Member, User, UserRole } from '@/lib/types';

const GLOW_COLORS = [
  'rgba(59, 130, 246, 0.67)',
  'rgba(139, 92, 246, 0.67)',
  'rgba(16, 185, 129, 0.67)',
  'rgba(245, 158, 11, 0.67)',
  'rgba(6, 182, 212, 0.67)',
];

export async function GET() {
  const [members, users] = await Promise.all([
    readData<Member>('members.json'),
    readData<User>('users.json'),
  ]);

  const roleByMemberId = new Map<string, UserRole>();
  for (const u of users) {
    if (u.memberId) roleByMemberId.set(u.memberId, u.role);
  }

  const council = members
    .map((m) => ({ ...m, role: m.role || roleByMemberId.get(m.id) }))
    .filter((m) => m.role === 'superadmin' || m.role === 'exco')
    .map((m) => {
      const info = POSITION_ORDER.find((p) => p.email === m.email);
      const order = info?.order ?? 99;
      return {
        id: m.id,
        name: `${m.firstName} ${m.lastName}`.trim(),
        position: info?.position || 'Exco',
        branch: m.address || '',
        isPresident: m.role === 'superadmin',
        order,
        image: m.profileImage || STATIC_IMAGES[m.email] || null,
        glowColor: GLOW_COLORS[(order - 1) % GLOW_COLORS.length],
      };
    })
    .sort((a, b) => a.order - b.order);

  return NextResponse.json(council);
}
