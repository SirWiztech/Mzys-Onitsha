'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Badge from '@/components/ui/badge';
import { Shield, ShieldCheck, Lock, Unlock, ArrowUpCircle, ArrowDownCircle, Trash2 } from 'lucide-react';

interface SafeUser {
  id: string;
  email: string;
  role: string;
  memberId: string | null;
  status: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState('');

  const load = async () => {
    const [u, auth] = await Promise.all([
      fetch('/api/users').then((r) => {
        if (!r.ok) throw new Error('Unauthorized');
        return r.json();
      }),
      fetch('/api/auth').then((r) => r.json()),
    ]);
    setUsers(u);
    setUserRole(auth.user?.role || '');
    setLoading(false);
  };

  useEffect(() => { load().catch(() => setError('Access denied')); }, []);

  const toggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, status: newStatus }),
    });
    if (res.ok) load();
  };

  const updateRole = async (userId: string, newRole: string) => {
    const res = await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role: newRole }),
    });
    if (res.ok) load();
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`Delete ${email}? This also removes their member profile and all their content. This cannot be undone.`)) {
      return;
    }
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    if (res.ok) load();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">{error}</p>
          <p className="text-sm text-gray-400 mt-1">
            Only the Super Admin can access this page.
          </p>
        </div>
      </div>
    );
  }

  const roleBadge = (role: string) => {
    const map: Record<string, { label: string; variant: 'default' | 'warning' | 'success' }> = {
      superadmin: { label: 'Super Admin', variant: 'warning' },
      exco: { label: 'Exco', variant: 'success' },
      member: { label: 'Member', variant: 'default' },
    };
    return map[role] || { label: role, variant: 'default' as const };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage accounts &mdash; promote to Exco, demote, block, or unblock users
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Loading users...</p>
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Registered</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const badge = roleBadge(u.role);
                  const isSelf = u.role === 'superadmin' && userRole === 'superadmin';
                  return (
                    <tr key={u.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                            u.role === 'superadmin'
                              ? 'bg-amber-500'
                              : u.role === 'exco'
                              ? 'bg-blue-500'
                              : 'bg-gray-400'
                          }`}>
                            {u.email[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{u.email}</p>
                            {u.memberId && (
                              <p className="text-xs text-gray-400">Has member profile</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`flex items-center gap-1.5 text-sm ${
                          u.status === 'active' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {u.status === 'active' ? (
                            <ShieldCheck className="w-4 h-4" />
                          ) : (
                            <Lock className="w-4 h-4" />
                          )}
                          {u.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isSelf ? (
                            <span className="text-xs text-gray-400 italic">Current user</span>
                          ) : (
                            <>
                              {u.role === 'member' && u.status === 'active' && (
                                <Button size="sm" variant="secondary" onClick={() => updateRole(u.id, 'exco')}>
                                  <ArrowUpCircle className="w-3.5 h-3.5 mr-1" /> Make Exco
                                </Button>
                              )}
                              {u.role === 'exco' && u.status === 'active' && (
                                <Button size="sm" variant="secondary" onClick={() => updateRole(u.id, 'member')}>
                                  <ArrowDownCircle className="w-3.5 h-3.5 mr-1" /> Demote
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant={u.status === 'active' ? 'secondary' : 'primary'}
                                onClick={() => toggleStatus(u.id, u.status)}
                              >
                                {u.status === 'active' ? (
                                  <><Lock className="w-3.5 h-3.5 mr-1" /> Block</>
                                ) : (
                                  <><Unlock className="w-3.5 h-3.5 mr-1" /> Unblock</>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => deleteUser(u.id, u.email)}
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
