export type UserRole = 'admin' | 'member';

export type MemberStatus = 'active' | 'inactive' | 'transferred';

export type CherubSeraph = 'cherub' | 'seraph' | null;

export type ComplaintStatus = 'open' | 'in-progress' | 'resolved';

export type FinanceType = 'dues' | 'remittance' | 'donation' | 'expense' | 'other';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  memberId: string | null;
  createdAt: string;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  branchId: string;
  cherubSeraph: CherubSeraph;
  occupation: string;
  address: string;
  status: MemberStatus;
  registrationDate: string;
  profileImage: string | null;
}

export interface Branch {
  id: string;
  name: string;
  location: string;
  leaderName: string;
  leaderPhone: string;
  createdAt: string;
}

export interface FinanceRecord {
  id: string;
  memberId: string;
  branchId: string;
  type: FinanceType;
  amount: number;
  description: string;
  date: string;
  recordedBy: string;
}

export interface MZYSEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate: string | null;
  location: string;
  type: 'meeting' | 'conference' | 'program' | 'fellowship' | 'other';
  createdBy: string;
}

export interface Leadership {
  id: string;
  memberId: string;
  position: string;
  level: 'provincial' | 'branch';
  branchId: string | null;
  responsibilities: string;
  startDate: string;
}

export interface Complaint {
  id: string;
  memberId: string;
  title: string;
  description: string;
  category: 'general' | 'financial' | 'leadership' | 'event' | 'other';
  status: ComplaintStatus;
  response: string | null;
  respondedBy: string | null;
  createdAt: string;
  updatedAt: string;
}
