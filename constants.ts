
import { Subject } from './types';

export const GRADES = [
  'PP1', 'PP2', 
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9'
];

// Added missing 'grade' property to satisfy the Subject interface requirements
export const PRE_PRIMARY_SUBJECTS: Subject[] = [
  { id: 'lang_pp', name: 'Language Activities', category: 'Primary', grade: '' },
  { id: 'math_pp', name: 'Mathematical Activities', category: 'Primary', grade: '' },
  { id: 'env_pp', name: 'Environmental Activities', category: 'Primary', grade: '' },
  { id: 'psy_pp', name: 'Psychomotor Activities', category: 'Primary', grade: '' },
  { id: 'cre_pp', name: 'Religious Education', category: 'Primary', grade: '' },
];

// Added missing 'grade' property to satisfy the Subject interface requirements
export const LOWER_PRIMARY_SUBJECTS: Subject[] = [
  { id: 'lit_lp', name: 'Literacy / Indigenous Lang', category: 'Primary', grade: '' },
  { id: 'kis_lp', name: 'Kiswahili / KSL', category: 'Primary', grade: '' },
  { id: 'eng_lp', name: 'English Language', category: 'Primary', grade: '' },
  { id: 'mat_lp', name: 'Mathematics', category: 'Primary', grade: '' },
  { id: 'env_lp', name: 'Environmental Activities', category: 'Primary', grade: '' },
  { id: 'hyg_lp', name: 'Hygiene and Nutrition', category: 'Primary', grade: '' },
  { id: 'cre_lp', name: 'Religious Education', category: 'Primary', grade: '' },
  { id: 'art_lp', name: 'Creative Arts', category: 'Primary', grade: '' },
  { id: 'pe_lp', name: 'Movement and Creative', category: 'Primary', grade: '' },
];

// Added missing 'grade' property to satisfy the Subject interface requirements
export const UPPER_PRIMARY_SUBJECTS: Subject[] = [
  { id: 'eng_up', name: 'English', category: 'Primary', grade: '' },
  { id: 'kis_up', name: 'Kiswahili / KSL', category: 'Primary', grade: '' },
  { id: 'mat_up', name: 'Mathematics', category: 'Primary', grade: '' },
  { id: 'sci_up', name: 'Science and Technology', category: 'Primary', grade: '' },
  { id: 'soc_up', name: 'Social Studies', category: 'Primary', grade: '' },
  { id: 'cre_up', name: 'Religious Education', category: 'Primary', grade: '' },
  { id: 'art_up', name: 'Creative Arts', category: 'Primary', grade: '' },
  { id: 'pe_up', name: 'Physical Education', category: 'Primary', grade: '' },
  { id: 'agr_up', name: 'Agriculture and Nutrition', category: 'Primary', grade: '' },
];

// Added missing 'grade' property to satisfy the Subject interface requirements
export const JSS_SUBJECTS: Subject[] = [
  { id: 'eng_j', name: 'English', category: 'JSS', grade: '' },
  { id: 'kis_j', name: 'Kiswahili / KSL', category: 'JSS', grade: '' },
  { id: 'mat_j', name: 'Mathematics', category: 'JSS', grade: '' },
  { id: 'sci_j', name: 'Integrated Science', category: 'JSS', grade: '' },
  { id: 'soc_j', name: 'Social Studies', category: 'JSS', grade: '' },
  { id: 'pre_j', name: 'Pre-Technical Studies', category: 'JSS', grade: '' },
  { id: 'bus_j', name: 'Business Studies', category: 'JSS', grade: '' },
  { id: 'agr_j', name: 'Agriculture and Nutrition', category: 'JSS', grade: '' },
  { id: 'pe_j', name: 'Physical Education', category: 'JSS', grade: '' },
  { id: 'cre_j', name: 'Religious Education', category: 'JSS', grade: '' },
  { id: 'com_j', name: 'Computer Science', category: 'JSS', grade: '' },
];

// Map the template subjects to include the specific grade passed as an argument
export const getSubjectsByGrade = (grade: string): Subject[] => {
  if (grade.startsWith('PP')) return PRE_PRIMARY_SUBJECTS.map(s => ({ ...s, grade }));
  if (['Grade 1', 'Grade 2', 'Grade 3'].includes(grade)) return LOWER_PRIMARY_SUBJECTS.map(s => ({ ...s, grade }));
  if (['Grade 4', 'Grade 5', 'Grade 6'].includes(grade)) return UPPER_PRIMARY_SUBJECTS.map(s => ({ ...s, grade }));
  return JSS_SUBJECTS.map(s => ({ ...s, grade }));
};

export const SCHOOL_DEFAULTS = {
  name: 'ST. PETERS CBC ACADEMY',
  motto: 'Knowledge is Light',
  box: 'P.O. BOX 12345-00100, Nairobi',
  email: 'info@stpeters.edu.ke',
  phone: '+254 700 123 456',
  logo: 'https://picsum.photos/id/119/200/200'
};
