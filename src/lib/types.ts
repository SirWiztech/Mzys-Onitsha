export type UserRole = 'member' | 'exco' | 'superadmin';

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
  status: 'active' | 'blocked';
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
  role?: UserRole;
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
  receipt?: string;
  status?: 'pending' | 'approved';
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

export interface Product {
  id: string;
  memberId: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  createdBy: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  productId: string;
  memberId: string;
  body: string;
  createdAt: string;
}

export interface Like {
  id: string;
  productId: string;
  memberId: string;
  createdAt: string;
}
