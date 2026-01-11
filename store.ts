
import { Student, Assessment, Payment, FeeStructure, PerformanceLevel, UserRole } from './types';

const STORAGE_KEYS = {
  STUDENTS: 'es_students',
  ASSESSMENTS: 'es_assessments',
  PAYMENTS: 'es_payments',
  FEE_STRUCTURES: 'es_fee_structures',
  CREDENTIALS: 'es_credentials'
};

// Initial default credentials
const DEFAULT_CREDENTIALS: Record<UserRole, { username: string; password: string }> = {
  [UserRole.ADMIN]: { username: 'admin', password: 'admin123' },
  [UserRole.TEACHER]: { username: 'teacher', password: 'teacher123' },
  [UserRole.ACCOUNTANT]: { username: 'accountant', password: 'pay123' },
  [UserRole.HEADTEACHER]: { username: 'headteacher', password: 'school123' },
};

export const getStudents = (): Student[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
export const saveStudents = (students: Student[]) => localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));

export const getAssessments = (): Assessment[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || '[]');
export const saveAssessments = (assessments: Assessment[]) => localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));

export const getPayments = (): Payment[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
export const savePayments = (payments: Payment[]) => localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

export const getFeeStructures = (): FeeStructure[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.FEE_STRUCTURES) || '[]');
export const saveFeeStructures = (structures: FeeStructure[]) => localStorage.setItem(STORAGE_KEYS.FEE_STRUCTURES, JSON.stringify(structures));

export const getCredentials = (): Record<UserRole, { username: string; password: string }> => {
  const saved = localStorage.getItem(STORAGE_KEYS.CREDENTIALS);
  return saved ? JSON.parse(saved) : DEFAULT_CREDENTIALS;
};

export const saveCredentials = (creds: Record<UserRole, { username: string; password: string }>) => {
  localStorage.setItem(STORAGE_KEYS.CREDENTIALS, JSON.stringify(creds));
};

export const calculatePerformanceLevel = (score: number): PerformanceLevel => {
  if (score >= 80) return PerformanceLevel.EE;
  if (score >= 60) return PerformanceLevel.ME;
  if (score >= 40) return PerformanceLevel.AE;
  return PerformanceLevel.BE;
};
