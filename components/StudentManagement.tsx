
import React, { useState } from 'react';
import { Student } from '../types';
import { GRADES } from '../constants';
import { Plus, Search, Filter, Download, MoreVertical, X, Upload, Trash2, Calendar } from 'lucide-react';

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
  
  const [formData, setFormData] = useState({
    name: '',
    admissionNo: '',
    grade: GRADES[0],
    stream: 'A',
    parentName: '',
    parentPhone: '',
    term: 1,
    year: new Date().getFullYear(),
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
    const today = new Date().toISOString().split('T')[0];
    lines.forEach(line => {
      const [name, adm, grade, stream, parent, phone, date] = line.split(',').map(s => s?.trim());
      if (name && adm) {
        onAddStudent({
          id: crypto.randomUUID(),
          name,
          admissionNo: adm,
          grade: grade || GRADES[0],
          stream: stream || 'A',
          parentName: parent || 'N/A',
          parentPhone: phone || 'N/A',
          term: 1,
          year: 2024,
          admissionDate: date || today
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

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-1 gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or Admission No..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors"
          >
            <Upload className="w-4 h-4" /> Bulk Upload
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Student Info</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Admission #</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Admission Date</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Grade/Class</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Parent Contact</th>
                <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-400">ID: {student.id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">{student.admissionNo}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(student.admissionDate)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">{student.grade}</div>
                    <div className="text-xs text-slate-400">Stream {student.stream}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-slate-700">{student.parentName}</div>
                    <div className="text-xs text-slate-400">{student.parentPhone}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => onDeleteStudent(student.id)}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-300 hover:text-slate-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">No students found matching your search.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="px-8 py-6 bg-slate-50 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Bulk Learner Upload</h3>
              <button onClick={() => setShowBulkModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-sm text-slate-500 italic">Paste CSV data below: <br/> Format: <code className="bg-slate-100 px-1 rounded">Name, AdmNo, Grade, Stream, ParentName, Phone, Date(Optional)</code></p>
              <textarea 
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs focus:ring-2 focus:ring-indigo-500/20 outline-none"
                placeholder="John Doe, ADM001, Grade 4, A, Jane Doe, 0712345678, 2024-01-15"
                value={bulkCsv}
                onChange={e => setBulkCsv(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowBulkModal(false)} className="px-6 py-2 text-slate-600">Cancel</button>
                <button 
                  onClick={handleBulkUpload}
                  className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg"
                >
                  Confirm Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="px-8 py-6 bg-slate-50 flex items-center justify-between border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Register New Learner</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Admission No.</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                    value={formData.admissionNo} onChange={e => setFormData({...formData, admissionNo: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Admission Date</label>
                  <input required type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                    value={formData.admissionDate} onChange={e => setFormData({...formData, admissionDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Grade</label>
                  <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                    value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} >
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Stream</label>
                  <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                    value={formData.stream} onChange={e => setFormData({...formData, stream: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Parent/Guardian</label>
                  <input required type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                    value={formData.parentName} onChange={e => setFormData({...formData, parentName: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Parent Phone</label>
                  <input required type="tel" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
                    value={formData.parentPhone} onChange={e => setFormData({...formData, parentPhone: e.target.value})} />
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 text-slate-600">Cancel</button>
                <button type="submit" className="px-8 py-3 bg-indigo-600 text-white font-black rounded-xl shadow-lg">Register Learner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
