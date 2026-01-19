
import React, { useState } from 'react';
import { Student } from '../types';
import { GRADES } from '../constants';
import { Plus, Search, X, Upload, Trash2, Calendar, UserCircle } from 'lucide-react';

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

const StudentManagement: React.FC<StudentManagementProps> = ({ students, onAddStudent, onDeleteStudent }) => {
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkCsv, setBulkCsv] = useState('');
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    name: '',
    admissionNo: '',
    gender: 'Boy',
    grade: GRADES[0],
    stream: 'A',
    parentName: '',
    parentPhone: '',
    term: 1,
    year: currentYear,
    admissionDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent({ id: crypto.randomUUID(), ...formData });
    setFormData({ 
      ...formData, 
      name: '', 
      admissionNo: '', 
      parentName: '', 
      parentPhone: '',
      admissionDate: new Date().toISOString().split('T')[0]
    });
    setShowModal(false);
  };

  const handleBulkUpload = () => {
    const lines = bulkCsv.split('\n');
    let count = 0;
    lines.forEach(line => {
      const [name, adm, gender, grade, stream, parent, phone, date, term, year] = line.split(',').map(s => s?.trim());
      if (name && adm) {
        onAddStudent({
          id: crypto.randomUUID(),
          name,
          admissionNo: adm,
          gender: (gender as 'Boy' | 'Girl') || 'Boy',
          grade: grade || GRADES[0],
          stream: stream || 'A',
          parentName: parent || 'N/A',
          parentPhone: phone || 'N/A',
          term: parseInt(term) || 1,
          year: parseInt(year) || currentYear,
          admissionDate: date || new Date().toISOString().split('T')[0]
        });
        count++;
      }
    });
    alert(`Successfully uploaded ${count} students.`);
    setBulkCsv('');
    setShowBulkModal(false);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search learner..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBulkModal(true)} className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <Upload className="w-4 h-4" /> Bulk Upload
          </button>
          <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg">
            <Plus className="w-4 h-4" /> Add Learner
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Learner Profile</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Adm #</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Grade/Stream</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Gender</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Parent Info</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${student.gender === 'Boy' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-800">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{student.admissionNo}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{student.grade} - {student.stream}</td>
                  <td className="px-6 py-4 text-sm"><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter ${student.gender === 'Boy' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>{student.gender}</span></td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    <p className="font-bold">{student.parentName}</p>
                    <p>{student.parentPhone}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onDeleteStudent(student.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="px-8 py-6 bg-slate-50 flex items-center justify-between border-b">
              <h3 className="text-xl font-bold">Register New Learner</h3>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
                <input required className="w-full px-4 py-3 bg-slate-50 border rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Admission No.</label>
                <input required className="w-full px-4 py-3 bg-slate-50 border rounded-xl" value={formData.admissionNo} onChange={e => setFormData({...formData, admissionNo: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Gender</label>
                <select className="w-full px-4 py-3 bg-slate-50 border rounded-xl" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as 'Boy' | 'Girl'})}>
                  <option value="Boy">Boy</option>
                  <option value="Girl">Girl</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Grade</label>
                <select className="w-full px-4 py-3 bg-slate-50 border rounded-xl" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Parent Name</label>
                <input required className="w-full px-4 py-3 bg-slate-50 border rounded-xl" value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-600">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl">Register Learner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="px-8 py-6 bg-slate-50 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Bulk Import</h3>
              <button onClick={() => setShowBulkModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-xs text-slate-400 italic">Format: Name, AdmNo, Gender, Grade, Stream, ParentName, Phone, Date, Term, Year</p>
              <textarea className="w-full h-48 p-4 bg-slate-50 border rounded-2xl font-mono text-xs outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="John Doe, 1001, Boy, Grade 4, A..." value={bulkCsv} onChange={e => setBulkCsv(e.target.value)} />
              <button onClick={handleBulkUpload} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl">Import Data</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
