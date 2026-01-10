
import { Student, Assessment, Payment, FeeStructure, PerformanceLevel } from './types';

const STORAGE_KEYS = {
  STUDENTS: 'es_students',
  ASSESSMENTS: 'es_assessments',
  PAYMENTS: 'es_payments',
  FEE_STRUCTURES: 'es_fee_structures'
};

export const getStudents = (): Student[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS) || '[]');
export const saveStudents = (students: Student[]) => localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));

export const getAssessments = (): Assessment[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || '[]');
export const saveAssessments = (assessments: Assessment[]) => localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(assessments));

export const getPayments = (): Payment[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.PAYMENTS) || '[]');
export const savePayments = (payments: Payment[]) => localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));

export const getFeeStructures = (): FeeStructure[] => JSON.parse(localStorage.getItem(STORAGE_KEYS.FEE_STRUCTURES) || '[]');
export const saveFeeStructures = (structures: FeeStructure[]) => localStorage.setItem(STORAGE_KEYS.FEE_STRUCTURES, JSON.stringify(structures));

export const calculatePerformanceLevel = (score: number): PerformanceLevel => {
  if (score >= 80) return PerformanceLevel.EE;
  if (score >= 60) return PerformanceLevel.ME;
  if (score >= 40) return PerformanceLevel.AE;
  return PerformanceLevel.BE;
};
