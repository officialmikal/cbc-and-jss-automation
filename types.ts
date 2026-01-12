
export enum UserRole {
  ADMIN = 'Admin',
  TEACHER = 'Teacher',
  ACCOUNTANT = 'Accountant',
  HEADTEACHER = 'Head Teacher'
}

export enum PerformanceLevel {
  EE = 'Exceeding Expectations',
  ME = 'Meeting Expectations',
  AE = 'Approaching Expectations',
  BE = 'Below Expectations'
}

export enum PaymentMode {
  CASH = 'Cash',
  MPESA = 'M-Pesa',
  BANK = 'Bank'
}

export interface Student {
  id: string;
  admissionNo: string;
  name: string;
  grade: string;
  stream: string;
  parentName: string;
  parentPhone: string;
  term: number;
  year: number;
  admissionDate: string;
}

export interface Assessment {
  studentId: string;
  subjectId: string;
  term: number;
  year: number;
  score: number;
  level: PerformanceLevel;
  remarks: string;
}

export interface Subject {
  id: string;
  name: string;
  category: 'Primary' | 'JSS';
  grade: string;
  teacherName?: string;
}

export interface FeeStructure {
  grade: string;
  term: number;
  year: number;
  items: {
    name: string;
    amount: number;
  }[];
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  mode: PaymentMode;
  term: number;
  year: number;
}

export interface SchoolInfo {
  name: string;
  motto: string;
  box: string;
  email: string;
  phone: string;
  logo: string;
}
