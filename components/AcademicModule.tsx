
import React, { useState, useEffect } from 'react';
import { Student, Assessment, Subject, PerformanceLevel } from '../types';
import { getSubjectsByGrade } from '../constants';
import { calculatePerformanceLevel } from '../store';
import { generateTeacherRemarks } from '../services/aiService';
import { Sparkles, Save, Info, CheckCircle2, Loader2, ListOrdered, X, WifiOff, CalendarDays, Search, User } from 'lucide-react';

interface AcademicModuleProps {
  students: Student[];
  assessments: Assessment[];
  onSaveAssessments: (newAssessments: Assessment[]) => void;
}

const AcademicModule: React.FC<AcademicModuleProps> = ({ students, assessments, onSaveAssessments }) => {
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

  // Load existing assessments when student/term/year changes
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
  const subjects = selectedStudent ? getSubjectsByGrade(selectedStudent.grade) : [];

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
    const newBatch: Assessment[] = subjects.map(sub => ({
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
      {/* Search & Period Selection Header */}
      <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Search className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Select Learner & Period</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6 lg:col-span-7">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Learner (Admission No / Name)</label>
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
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Assessment Term</label>
            <select 
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-700"
              value={currentTerm}
              onChange={e => setCurrentTerm(parseInt(e.target.value))}
            >
              <option value={1}>Term 1</option>
              <option value={2}>Term 2</option>
              <option value={3}>Term 3</option>
            </select>
          </div>
          <div className="md:col-span-3 lg:col-span-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Academic Year</label>
            <select 
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold text-slate-700"
              value={currentYear}
              onChange={e => setCurrentYear(parseInt(e.target.value))}
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-50">
          <p className="text-xs text-slate-500 font-medium">Please select a learner to load the grade-appropriate CBC learning areas.</p>
          <button 
            onClick={() => setShowBulkMarksModal(true)}
            className="w-full sm:w-auto px-6 py-3 border-2 border-indigo-100 text-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all text-sm"
          >
            <ListOrdered className="w-5 h-5" /> Bulk Import Marks
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
                      <th className="px-8 py-5 font-bold text-xs text-slate-500 uppercase tracking-widest">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subjects.map(sub => {
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
                            <div className="relative group">
                              <textarea rows={2} className="w-full text-xs p-3 bg-slate-50 border-2 border-slate-100 rounded-xl resize-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium"
                                placeholder="Type remarks or use AI..."
                                value={remarks[sub.id] || ''}
                                onChange={e => setRemarks({...remarks, [sub.id]: e.target.value})}
                              />
                              <button 
                                onClick={() => handleGenerateAI(sub.id, sub.name)} 
                                disabled={loadingRemarks[sub.id] || !scores[sub.id] || !isOnline}
                                className={`absolute bottom-3 right-3 p-2 rounded-xl transition-all shadow-sm ${
                                  !isOnline ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white border border-slate-100'
                                }`}
                                title={isOnline ? "Generate AI Remarks" : "Offline - AI Disabled"}
                              >
                                {loadingRemarks[sub.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : (isOnline ? <Sparkles className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />)}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View for Assessments */}
              <div className="md:hidden divide-y divide-slate-100">
                {subjects.map(sub => {
                  const level = calculatePerformanceLevel(scores[sub.id] || 0);
                  return (
                    <div key={sub.id} className="p-6 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800 text-lg">{sub.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{sub.category}</p>
                        </div>
                        <span className={`text-[9px] px-2 py-1 rounded-lg font-black uppercase ${
                          level === PerformanceLevel.EE ? 'bg-emerald-100 text-emerald-700' :
                          level === PerformanceLevel.ME ? 'bg-blue-100 text-blue-700' :
                          level === PerformanceLevel.AE ? 'bg-amber-100 text-amber-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {level.split(' ')[0]}
                        </span>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="w-28 shrink-0">
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Score %</label>
                          <input 
                            type="number"
                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl font-black text-indigo-600"
                            value={scores[sub.id] || ''}
                            onChange={e => handleScoreChange(sub.id, e.target.value)}
                          />
                        </div>
                        <div className="flex-1 relative">
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Remarks</label>
                          <textarea 
                            rows={1}
                            className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl text-xs font-medium"
                            value={remarks[sub.id] || ''}
                            onChange={e => setRemarks({...remarks, [sub.id]: e.target.value})}
                          />
                          <button 
                            onClick={() => handleGenerateAI(sub.id, sub.name)}
                            className="absolute right-2 bottom-2 p-1.5 bg-white border border-slate-200 rounded-lg text-indigo-600"
                          >
                             {loadingRemarks[sub.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="flex justify-center md:justify-end pb-10 md:pb-0">
              <button onClick={handleSave} className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95 text-lg">
                <Save className="w-6 h-6" /> Save All Records
              </button>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
              <h4 className="font-black text-xl mb-6 flex items-center gap-3 tracking-tight">
                <CalendarDays className="w-6 h-6 text-indigo-300" /> 
                Period Insight
              </h4>
              <div className="space-y-4 text-indigo-50">
                <div className="bg-indigo-500/30 backdrop-blur-md p-5 rounded-2xl border border-white/10 flex justify-between items-center">
                  <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Active Period</span>
                  <span className="font-black text-lg">Term {currentTerm} — {currentYear}</span>
                </div>
                <div className="bg-white/5 p-5 rounded-2xl space-y-2 border border-white/5">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-60">Status Summary</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Recorded Marks</span>
                    <span className="font-black">{Object.keys(scores).length} / {subjects.length}</span>
                  </div>
                  <div className="w-full h-2 bg-indigo-950/50 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${(Object.keys(scores).length / subjects.length) * 100}%` }}></div>
                  </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300/80 leading-relaxed text-center mt-6">
                  Ensure all scores are double-checked against student workbooks before final submission.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" />
                CBC Standards
              </h4>
              <div className="space-y-3">
                {[
                  { l: 'EE', d: '80 - 100%', c: 'text-emerald-600 bg-emerald-50' },
                  { l: 'ME', d: '60 - 79%', c: 'text-blue-600 bg-blue-50' },
                  { l: 'AE', d: '40 - 59%', c: 'text-amber-600 bg-amber-50' },
                  { l: 'BE', d: 'Below 40%', c: 'text-rose-600 bg-rose-50' },
                ].map(std => (
                  <div key={std.l} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${std.c}`}>{std.l}</span>
                    <span className="text-xs font-bold text-slate-500">{std.d}</span>
                  </div>
                ))}
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
            <p className="text-slate-500 font-medium">Select a student from the dropdown menu above to begin entering their academic performance for this term.</p>
          </div>
        </div>
      )}

      {/* Bulk Marks Modal */}
      {showBulkMarksModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 bg-slate-50/50 border-b flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Bulk Marks Entry</h3>
                <p className="text-sm font-medium text-slate-500">Accelerate your record keeping</p>
              </div>
              <button onClick={() => setShowBulkMarksModal(false)} className="p-3 bg-white hover:bg-rose-50 hover:text-rose-600 rounded-2xl border border-slate-100 transition-all group">
                <X className="w-6 h-6 text-slate-400 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 flex items-start gap-4">
                <Info className="w-6 h-6 text-indigo-600 shrink-0" />
                <p className="text-sm font-semibold text-indigo-900 leading-relaxed">
                  Prepare your data in CSV format. Format your columns as follows: <br/>
                  <code className="bg-white px-2 py-0.5 rounded-lg border border-indigo-200 mt-2 block w-fit font-mono font-black text-indigo-600">AdmissionNo, SubjectID, Score, Term, Year</code>
                </p>
              </div>
              <textarea 
                className="w-full h-56 p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-mono text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all resize-none shadow-inner"
                placeholder="ADM102, math_up, 78, 1, 2024"
                value={bulkMarksCsv}
                onChange={e => setBulkMarksCsv(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
                <button onClick={() => setShowBulkMarksModal(false)} className="px-8 py-4 text-slate-600 font-black uppercase tracking-widest text-xs hover:text-slate-800">Cancel</button>
                <button onClick={handleBulkMarksSubmit} className="w-full sm:w-auto px-12 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all uppercase tracking-widest text-xs">Commit Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicModule;
