
import { Subject } from './types';

export const GRADES = [
  'PP1', 'PP2', 
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9'
];

export const PRE_PRIMARY_SUBJECTS: Subject[] = [
  { id: 'lang_pp', name: 'Language Activities', category: 'Primary' },
  { id: 'math_pp', name: 'Mathematical Activities', category: 'Primary' },
  { id: 'env_pp', name: 'Environmental Activities', category: 'Primary' },
  { id: 'psy_pp', name: 'Psychomotor Activities', category: 'Primary' },
  { id: 'cre_pp', name: 'Religious Education', category: 'Primary' },
];

export const LOWER_PRIMARY_SUBJECTS: Subject[] = [
  { id: 'lit_lp', name: 'Literacy / Indigenous Lang', category: 'Primary' },
  { id: 'kis_lp', name: 'Kiswahili / KSL', category: 'Primary' },
  { id: 'eng_lp', name: 'English Language', category: 'Primary' },
  { id: 'mat_lp', name: 'Mathematics', category: 'Primary' },
  { id: 'env_lp', name: 'Environmental Activities', category: 'Primary' },
  { id: 'hyg_lp', name: 'Hygiene and Nutrition', category: 'Primary' },
  { id: 'cre_lp', name: 'Religious Education', category: 'Primary' },
  { id: 'art_lp', name: 'Creative Arts', category: 'Primary' },
  { id: 'pe_lp', name: 'Movement and Creative', category: 'Primary' },
];

export const UPPER_PRIMARY_SUBJECTS: Subject[] = [
  { id: 'eng_up', name: 'English', category: 'Primary' },
  { id: 'kis_up', name: 'Kiswahili / KSL', category: 'Primary' },
  { id: 'mat_up', name: 'Mathematics', category: 'Primary' },
  { id: 'sci_up', name: 'Science and Technology', category: 'Primary' },
  { id: 'soc_up', name: 'Social Studies', category: 'Primary' },
  { id: 'cre_up', name: 'Religious Education', category: 'Primary' },
  { id: 'art_up', name: 'Creative Arts', category: 'Primary' },
  { id: 'pe_up', name: 'Physical Education', category: 'Primary' },
  { id: 'agr_up', name: 'Agriculture and Nutrition', category: 'Primary' },
];

export const JSS_SUBJECTS: Subject[] = [
  { id: 'eng_j', name: 'English', category: 'JSS' },
  { id: 'kis_j', name: 'Kiswahili / KSL', category: 'JSS' },
  { id: 'mat_j', name: 'Mathematics', category: 'JSS' },
  { id: 'sci_j', name: 'Integrated Science', category: 'JSS' },
  { id: 'soc_j', name: 'Social Studies', category: 'JSS' },
  { id: 'pre_j', name: 'Pre-Technical Studies', category: 'JSS' },
  { id: 'bus_j', name: 'Business Studies', category: 'JSS' },
  { id: 'agr_j', name: 'Agriculture and Nutrition', category: 'JSS' },
  { id: 'pe_j', name: 'Physical Education', category: 'JSS' },
  { id: 'cre_j', name: 'Religious Education', category: 'JSS' },
  { id: 'com_j', name: 'Computer Science', category: 'JSS' },
];

export const getSubjectsByGrade = (grade: string): Subject[] => {
  if (grade.startsWith('PP')) return PRE_PRIMARY_SUBJECTS;
  if (['Grade 1', 'Grade 2', 'Grade 3'].includes(grade)) return LOWER_PRIMARY_SUBJECTS;
  if (['Grade 4', 'Grade 5', 'Grade 6'].includes(grade)) return UPPER_PRIMARY_SUBJECTS;
  return JSS_SUBJECTS;
};

export const SCHOOL_DEFAULTS = {
  name: 'ST. PETERS CBC ACADEMY',
  motto: 'Knowledge is Light',
  box: 'P.O. BOX 12345-00100, Nairobi',
  email: 'info@stpeters.edu.ke',
  phone: '+254 700 123 456',
  logo: 'https://picsum.photos/id/119/200/200'
};
