
import { Subject } from './types';

export const GRADES = [
  'PP1', 'PP2', 
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9'
];

export const PRIMARY_SUBJECTS: Subject[] = [
  { id: 'eng_p', name: 'English', category: 'Primary' },
  { id: 'kis_p', name: 'Kiswahili', category: 'Primary' },
  { id: 'mat_p', name: 'Mathematics', category: 'Primary' },
  { id: 'env_p', name: 'Environmental Activities', category: 'Primary' },
  { id: 'hyg_p', name: 'Hygiene and Nutrition', category: 'Primary' },
  { id: 'cre_p', name: 'Religious Education', category: 'Primary' },
  { id: 'art_p', name: 'Creative Arts', category: 'Primary' },
  { id: 'pe_p', name: 'Physical Activities', category: 'Primary' },
];

export const JSS_SUBJECTS: Subject[] = [
  { id: 'eng_j', name: 'English', category: 'JSS' },
  { id: 'kis_j', name: 'Kiswahili', category: 'JSS' },
  { id: 'mat_j', name: 'Mathematics', category: 'JSS' },
  { id: 'sci_j', name: 'Integrated Science', category: 'JSS' },
  { id: 'soc_j', name: 'Social Studies', category: 'JSS' },
  { id: 'pre_j', name: 'Pre-Technical Studies', category: 'JSS' },
  { id: 'bus_j', name: 'Business Studies', category: 'JSS' },
  { id: 'lsk_j', name: 'Life Skills', category: 'JSS' },
  { id: 'com_j', name: 'Computer Studies', category: 'JSS' },
  { id: 'hea_j', name: 'Health Education', category: 'JSS' },
];

export const SCHOOL_DEFAULTS = {
  name: 'ST. PETERS CBC ACADEMY',
  motto: 'Knowledge is Light',
  box: 'P.O. BOX 12345-00100, Nairobi',
  email: 'info@stpeters.edu.ke',
  phone: '+254 700 123 456',
  logo: 'https://picsum.photos/id/119/200/200'
};
