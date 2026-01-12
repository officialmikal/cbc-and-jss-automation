
import React, { useState, useEffect } from 'react';
import { Student, Assessment, Subject, PerformanceLevel } from '../types';
import { calculatePerformanceLevel } from '../store';
import { generateTeacherRemarks } from '../services/aiService';
import { Sparkles, Save, Loader2, ListOrdered, X, WifiOff, CalendarDays, Search, User } from 'lucide-react';

interface AcademicModuleProps {
  students: Student[];
  assessments: Assessment[];
  subjects: Subject[];
  onSaveAssessments: (newAssessments: Assessment[]) => void;
}

const AcademicModule: React.FC<AcademicModuleProps> = ({ students, assessments, subjects, onSaveAssessments }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [currentTerm, setCurrentTerm] = useState(1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [scores, setScores] = useState<Record<string, number>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [loadingRemarks, setLoadingRemarks] = useState<Record<string, boolean>>({});
  const [showBulkMarksModal, setShowBulkMarksModal] = useState(false);
  const [bulkMarksCsv, setBulkMarksCsv] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);

  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatus);
    window.addEventListener('offline', handleStatus);
    return () => {
      window.removeEventListener('online', handleStatus);
      window.removeEventListener('offline', handleStatus);
    };
  }, []);

  useEffect(() => {
    if (selectedStudentId) {
      const existing = assessments.filter(a => a.studentId === selectedStudentId && a.term === currentTerm && a.year === currentYear);
      const newScores: Record<string, number> = {};
      const newRemarks: Record<string, string> = {};
      existing.forEach(a => {
        newScores[a.subjectId] = a.score;
        newRemarks[a.subjectId] = a.remarks;
      });
      setScores(newScores);
      setRemarks(newRemarks);
    }
  }, [selectedStudentId, currentTerm, currentYear, assessments]);

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  // Filter subjects based on student's grade
  const relevantSubjects = selectedStudent 
    ? subjects.filter(s => s.grade === selectedStudent.grade)
    : [];

  const handleScoreChange = (subId: string, val: string) => {
    const num = parseInt(val) || 0;
    setScores(prev => ({ ...prev, [subId]: num }));
  };

  const handleGenerateAI = async (subId: string, subjectName: string) => {
    if (!scores[subId] || !isOnline) return;
    setLoadingRemarks(prev => ({ ...prev, [subId]: true }));
    const level = calculatePerformanceLevel(scores[subId]);
    const aiText = await generateTeacherRemarks(subjectName, scores[subId], level);
    setRemarks(prev => ({ ...prev, [subId]: aiText }));
    setLoadingRemarks(prev => ({ ...prev, [subId]: false }));
  };

  const handleSave = () => {
    if (!selectedStudentId) return;
    const newBatch: Assessment[] = relevantSubjects.map(sub => ({
      studentId: selectedStudentId,
      subjectId: sub.id,
      term: currentTerm,
      year: currentYear,
      score: scores[sub.id] || 0,
      level: calculatePerformanceLevel(scores[sub.id] || 0),
      remarks: remarks[sub.id] || ''
    }));
    onSaveAssessments(newBatch);
    alert(`Marks for Term ${currentTerm}, ${currentYear} updated successfully!`);
  };

  const handleBulkMarksSubmit = () => {
    const lines = bulkMarksCsv.split('\n');
    const newBatch: Assessment[] = [];
    lines.forEach(line => {
      const [adm, subId, scoreText, term, year] = line.split(',').map(s => s?.trim());
      const student = students.find(s => s.admissionNo === adm);
      const score = parseInt(scoreText) || 0;
      if (student && subId) {
        newBatch.push({
          studentId: student.id,
          subjectId: subId,
          term: parseInt(term) || currentTerm,
          year: parseInt(year) || currentYear,
          score,
          level: calculatePerformanceLevel(score),
          remarks: 'Performance noted.'
        });
      }
    });
    onSaveAssessments(newBatch);
    alert(`Imported ${newBatch.length} scores.`);
    setShowBulkMarksModal(false);
    setBulkMarksCsv('');
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Search className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Select Learner & Period</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 lg:col-span-7">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Learner</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <select 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-700 appearance-none"
                value={selectedStudentId}
                onChange={e => setSelectedStudentId(e.target.value)}
              >
                <option value="">-- Choose Student --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.admissionNo} - {s.name} ({s.grade})</option>)}
              </select>
            </div>
          </div>
          <div className="md:col-span-3 lg:col-span-2">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Term</label>
            <select 
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              value={currentTerm}
              onChange={e => setCurrentTerm(parseInt(e.target.value))}
            >
              <option value={1}>Term 1</option>
              <option value={2}>Term 2</option>
              <option value={3}>Term 3</option>
            </select>
          </div>
          <div className="md:col-span-3 lg:col-span-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Year</label>
            <select 
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              value={currentYear}
              onChange={e => setCurrentYear(parseInt(e.target.value))}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-50">
          <p className="text-xs text-slate-500 font-medium">Manage assessment marks for dynamic Grade subjects.</p>
          <button 
            onClick={() => setShowBulkMarksModal(true)}
            className="w-full sm:w-auto px-6 py-3 border-2 border-indigo-100 text-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all text-sm"
          >
            <ListOrdered className="w-5 h-5" /> Bulk Import
          </button>
        </div>
      </div>

      {selectedStudent ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="xl:col-span-8 space-y-6">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
              <div className="hidden md:block">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-100">
                      <th className="px-8 py-5 font-bold text-xs text-slate-500 uppercase tracking-widest">Learning Area</th>
                      <th className="px-8 py-5 font-bold text-xs text-slate-500 uppercase tracking-widest text-center">Score (%)</th>
                      <th className="px-8 py-5 font-bold text-xs text-slate-500 uppercase tracking-widest text-center">CBC Level</th>
                      <th className="px-8 py-5 font-bold text-xs text-slate-500 uppercase tracking-widest">Teacher</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {relevantSubjects.map(sub => {
                      const level = calculatePerformanceLevel(scores[sub.id] || 0);
                      return (
                        <tr key={sub.id} className="hover:bg-indigo-50/30 transition-colors">
                          <td className="px-8 py-6">
                            <p className="font-bold text-slate-800">{sub.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium uppercase">{sub.category}</p>
                          </td>
                          <td className="px-8 py-6 text-center">
                            <input 
                              type="number" min="0" max="100"
                              className="w-24 px-4 py-3 border-2 border-slate-100 rounded-xl bg-slate-50 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-black text-indigo-600 text-center"
                              value={scores[sub.id] || ''}
                              onChange={e => handleScoreChange(sub.id, e.target.value)}
                            />
                          </td>
                          <td className="px-8 py-6 text-center">
                            <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-tight ${
                              level === PerformanceLevel.EE ? 'bg-emerald-100 text-emerald-700' :
                              level === PerformanceLevel.ME ? 'bg-blue-100 text-blue-700' :
                              level === PerformanceLevel.AE ? 'bg-amber-100 text-amber-700' :
                              'bg-rose-100 text-rose-700'
                            }`}>
                              {level.split(' ')[0]}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                             <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                                <User className="w-3.5 h-3.5" />
                                {sub.teacherName || 'Not set'}
                             </div>
                          </td>
                        </tr>
                      );
                    })}
                    {relevantSubjects.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">No subjects registered for this grade. Use the Subjects tab to add some.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            {relevantSubjects.length > 0 && (
              <div className="flex justify-center md:justify-end pb-10 md:pb-0">
                <button onClick={handleSave} className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95 text-lg">
                  <Save className="w-6 h-6" /> Save All Records
                </button>
              </div>
            )}
          </div>

          <div className="xl:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <h4 className="font-black text-xl mb-6 flex items-center gap-3 tracking-tight">
                <CalendarDays className="w-6 h-6 text-indigo-300" /> 
                System Context
              </h4>
              <div className="space-y-4 text-indigo-50">
                <div className="bg-indigo-500/30 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex justify-between items-center">
                  <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Entry Target</span>
                  <span className="font-black text-lg">Term {currentTerm} — {currentYear}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300/80 leading-relaxed text-center mt-6">
                  Subjects are dynamically filtered for the learner's grade level ({selectedStudent.grade}).
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 md:p-24 rounded-[3rem] border border-dashed border-slate-200 text-center space-y-6">
          <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-indigo-200" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Ready to Record Marks?</h3>
            <p className="text-slate-500 font-medium">Select a student from the dropdown menu to load their grade-specific learning areas.</p>
          </div>
        </div>
      )}

      {showBulkMarksModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 bg-slate-50/50 border-b flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800">Bulk Marks Entry</h3>
              <button onClick={() => setShowBulkMarksModal(false)} className="p-2"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="p-10 space-y-6">
              <textarea 
                className="w-full h-56 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-mono text-sm outline-none shadow-inner"
                placeholder="ADM102, subId, 78, 1, 2024"
                value={bulkMarksCsv}
                onChange={e => setBulkMarksCsv(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <button onClick={() => setShowBulkMarksModal(false)} className="px-8 py-4 text-slate-600 font-black">Cancel</button>
                <button onClick={handleBulkMarksSubmit} className="px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20">Commit Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicModule;
