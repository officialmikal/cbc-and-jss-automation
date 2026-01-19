import React, { useState, useMemo } from 'react';
import { Subject } from '../types';
import { GRADES } from '../constants';
import { Plus, Search, BookOpen, User, Trash2, X, GraduationCap, Edit3, CheckCircle2 } from 'lucide-react';

interface SubjectManagementProps {
  subjects: Subject[];
  onAddSubject: (subject: Subject) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
}

const SubjectManagement: React.FC<SubjectManagementProps> = ({ subjects, onAddSubject, onUpdateSubject, onDeleteSubject }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    grade: GRADES[0],
    category: 'Primary' as 'Primary' | 'JSS',
    teacherName: ''
  });

  // Unique list of teachers already in the system for suggestions
  const existingTeachers = useMemo(() => {
    const teachers = subjects
      .map(s => s.teacherName)
      .filter((name): name is string => !!name && name !== 'To be assigned' && name !== 'Not Assigned');
    return Array.from(new Set(teachers)).sort();
  }, [subjects]);

  const handleOpenModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        name: subject.name,
        grade: subject.grade,
        category: subject.category,
        teacherName: subject.teacherName || ''
      });
    } else {
      setEditingSubject(null);
      setFormData({
        name: '',
        grade: GRADES[0],
        category: 'Primary',
        teacherName: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSubject) {
      onUpdateSubject({
        ...editingSubject,
        ...formData
      });
    } else {
      onAddSubject({
        id: `sub-${Date.now()}`,
        ...formData
      });
    }
    setFormData({ ...formData, name: '', teacherName: '' });
    setShowModal(false);
    setEditingSubject(null);
  };

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.teacherName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search subjects or teachers..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
        >
          <Plus className="w-5 h-5" /> Add New Subject
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map(subject => (
          <div key={subject.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
            <div className="absolute top-4 right-4 flex items-center gap-1">
              <button 
                onClick={() => handleOpenModal(subject)}
                className="p-2 text-slate-300 hover:text-indigo-600 transition-colors opacity-0 group-hover:opacity-100"
                title="Edit Subject"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDeleteSubject(subject.id)}
                className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Delete Subject"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex-1 pr-12">
                <h4 className="font-bold text-slate-800 text-lg leading-tight">{subject.name}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg">
                    {subject.grade}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded-lg ${
                    subject.category === 'JSS' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {subject.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 max-w-[70%]">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className={`text-sm font-bold truncate ${
                  !subject.teacherName || subject.teacherName === 'To be assigned' || subject.teacherName === 'Not Assigned' 
                  ? 'text-slate-400 italic' 
                  : 'text-slate-700'
                }`}>
                  {subject.teacherName || 'Not Assigned'}
                </span>
              </div>
              <button 
                onClick={() => handleOpenModal(subject)}
                className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hover:underline"
              >
                Assign
              </button>
            </div>
          </div>
        ))}

        {filteredSubjects.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <GraduationCap className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No subjects found. Add a subject to get started.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 bg-slate-50/50 border-b flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {editingSubject ? 'Manage Learning Area' : 'Setup Learning Area'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Subject Name</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                    placeholder="e.g. Mathematics, English Language"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Grade</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-700 font-semibold"
                      value={formData.grade}
                      onChange={e => setFormData({...formData, grade: e.target.value})}
                    >
                      {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Category</label>
                    <select 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-slate-700 font-semibold"
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value as 'Primary' | 'JSS'})}
                    >
                      <option value="Primary">Primary (PP1-G6)</option>
                      <option value="JSS">JSS (G7-G9)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Assigned Teacher</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      list="teachers-list"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                      placeholder="Type teacher name or select existing..."
                      value={formData.teacherName}
                      onChange={e => setFormData({...formData, teacherName: e.target.value})}
                    />
                    <datalist id="teachers-list">
                      {existingTeachers.map(teacher => (
                        <option key={teacher} value={teacher} />
                      ))}
                    </datalist>
                  </div>
                  {existingTeachers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                       <p className="w-full text-[9px] font-black text-slate-300 uppercase tracking-tighter mb-1">Quick Select Existing:</p>
                       {existingTeachers.slice(0, 5).map(teacher => (
                         <button
                           key={teacher}
                           type="button"
                           onClick={() => setFormData({...formData, teacherName: teacher})}
                           className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors"
                         >
                           {teacher}
                         </button>
                       ))}
                    </div>
                  )}
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2"
              >
                {editingSubject ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Save Changes
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Register Subject
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectManagement;