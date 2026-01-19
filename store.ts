
import { Student, Assessment, Payment, FeeStructure, PerformanceLevel, UserRole, Subject } from './types';

const STORAGE_KEYS = {
  STUDENTS: 'es_students',
  ASSESSMENTS: 'es_assessments',
  PAYMENTS: 'es_payments',
  FEE_STRUCTURES: 'es_fee_structures',
  CREDENTIALS: 'es_credentials',
  SUBJECTS: 'es_subjects'
};

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

export const getSubjects = (): Subject[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBJECTS) || '[]');
export const saveSubjects = (subjects: Subject[]) => localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));

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

export const getStudentBalance = (student: Student, structures: FeeStructure[], payments: Payment[]) => {
  const structure = structures.find(f => f.grade === student.grade && f.term === student.term);
  const totalFees = structure ? structure.items.reduce((acc, item) => acc + item.amount, 0) : 15000; // Default if not set
  const paid = payments
    .filter(p => p.studentId === student.id && p.term === student.term)
    .reduce((a, b) => a + b.amount, 0);
  return totalFees - paid;
};

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).join(',')).join('\n');
  const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + rows;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
