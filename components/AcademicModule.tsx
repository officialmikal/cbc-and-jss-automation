
import React, { useState, useEffect } from 'react';
import { Student, Assessment, Subject, PerformanceLevel } from '../types';
import { calculatePerformanceLevel } from '../store';
import { generateTeacherRemarks } from '../services/aiService';
import { Sparkles, Save, X, Clock, Upload, List } from 'lucide-react';

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
  const [attendance, setAttendance] = useState({ present: 0, total: 90 });
  
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkCsv, setBulkCsv] = useState('');

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const relevantSubjects = selectedStudent ? subjects.filter(s => s.grade === selectedStudent.grade) : [];

  useEffect(() => {
    if (selectedStudentId) {
      const existing = assessments.filter(a => a.studentId === selectedStudentId && a.term === currentTerm && a.year === currentYear);
      const newScores: Record<string, number> = {};
      const newRemarks: Record<string, string> = {};
      existing.forEach(a => {
        newScores[a.subjectId] = a.score;
        newRemarks[a.subjectId] = a.remarks;
        if (a.daysPresent !== undefined) setAttendance({ present: a.daysPresent, total: a.totalDays || 90 });
      });
      setScores(newScores);
      setRemarks(newRemarks);
    }
  }, [selectedStudentId, currentTerm, currentYear, assessments]);

  const handleSave = () => {
    if (!selectedStudentId) return;
    const newBatch: Assessment[] = relevantSubjects.map(sub => ({
      studentId: selectedStudentId,
      subjectId: sub.id,
      term: currentTerm,
      year: currentYear,
      score: scores[sub.id] || 0,
      level: calculatePerformanceLevel(scores[sub.id] || 0),
      remarks: remarks[sub.id] || '',
      daysPresent: attendance.present,
      totalDays: attendance.total
    }));
    onSaveAssessments(newBatch);
    alert(`Assessment for ${selectedStudent?.name} saved!`);
  };

  const handleBulkImport = () => {
    const lines = bulkCsv.split('\n');
    const batch: Assessment[] = [];
    lines.forEach(line => {
      const [adm, subName, score, rem] = line.split(',').map(s => s?.trim());
      const student = students.find(s => s.admissionNo === adm);
      const subject = subjects.find(s => s.name.toLowerCase() === subName?.toLowerCase() && s.grade === student?.grade);
      
      if (student && subject && score) {
        const numScore = parseInt(score);
        batch.push({
          studentId: student.id,
          subjectId: subject.id,
          term: currentTerm,
          year: currentYear,
          score: numScore,
          level: calculatePerformanceLevel(numScore),
          remarks: rem || 'Satisfactory progress.',
          daysPresent: 90,
          totalDays: 90
        });
      }
    });
    onSaveAssessments(batch);
    alert(`Imported marks for ${batch.length} records.`);
    setShowBulkModal(false);
    setBulkCsv('');
  };

  const handleGenerateAI = async (subId: string, subjectName: string) => {
    if (!scores[subId]) return;
    setLoadingRemarks(prev => ({ ...prev, [subId]: true }));
    const comment = await generateTeacherRemarks(subjectName, scores[subId], calculatePerformanceLevel(scores[subId]));
    setRemarks(prev => ({ ...prev, [subId]: comment }));
    setLoadingRemarks(prev => ({ ...prev, [subId]: false }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Learner Selection</label>
            <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all" value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)}>
              <option value="">-- Choose Learner --</option>
              {students.map(s => <option key={s.id} value={s.id}>{s.admissionNo} - {s.name} ({s.grade})</option>)}
            </select>
          </div>
          <div className="flex gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Term</label>
              <select className="p-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold" value={currentTerm} onChange={e => setCurrentTerm(parseInt(e.target.value))}>
                {[1,2,3].map(t => <option key={t} value={t}>Term {t}</option>)}
              </select>
            </div>
            <button onClick={() => setShowBulkModal(true)} className="flex items-center gap-2 px-6 py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-900 transition-all">
              <Upload className="w-5 h-5" /> Bulk Import
            </button>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-6">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b">
                  <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    <th className="px-8 py-5">Learning Area</th>
                    <th className="px-8 py-5 text-center">Score</th>
                    <th className="px-8 py-5">AI Remarks & Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {relevantSubjects.map(sub => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-700">{sub.name}</div>
                        <div className="text-[10px] text-indigo-500 font-black uppercase tracking-tighter">
                          {calculatePerformanceLevel(scores[sub.id] || 0).split(' ')[0]}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <input type="number" className="w-20 p-3 text-center bg-slate-50 border rounded-xl font-black focus:ring-4 focus:ring-indigo-500/10" value={scores[sub.id] || ''} onChange={e => setScores({...scores, [sub.id]: parseInt(e.target.value)})} />
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex gap-3">
                          <input className="flex-1 text-xs px-4 py-3 bg-slate-50 border rounded-xl" value={remarks[sub.id] || ''} onChange={e => setRemarks({...remarks, [sub.id]: e.target.value})} placeholder="Teacher's remark..." />
                          <button onClick={() => handleGenerateAI(sub.id, sub.name)} disabled={loadingRemarks[sub.id]} className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all disabled:opacity-50">
                            {loadingRemarks[sub.id] ? <span className="animate-spin block">...</span> : <Sparkles className="w-5 h-5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl"><Clock className="w-6 h-6" /></div>
                <h4 className="font-black text-slate-800">Termly Attendance</h4>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Days Attended</label>
                  <input type="number" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={attendance.present} onChange={e => setAttendance({...attendance, present: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Total Term Days</label>
                  <input type="number" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={attendance.total} onChange={e => setAttendance({...attendance, total: parseInt(e.target.value)})} />
                </div>
              </div>
            </div>
            <button onClick={handleSave} className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black shadow-2xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest">
              SAVE ASSESSMENT RECORD
            </button>
          </div>
        </div>
      )}

      {showBulkModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="px-10 py-8 bg-slate-50 border-b flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Bulk Marks Import</h3>
              <button onClick={() => setShowBulkModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="p-10 space-y-6">
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-widest mb-1">CSV Format Required</p>
                <p className="text-xs text-indigo-600 italic">AdmissionNo, SubjectName, Score, Remarks</p>
              </div>
              <textarea 
                className="w-full h-56 p-6 bg-slate-50 border border-slate-200 rounded-[2rem] font-mono text-xs outline-none focus:ring-4 focus:ring-indigo-500/10" 
                placeholder="1001, Mathematics, 85, Excellent work!&#10;1002, English, 60, Meeting expectations." 
                value={bulkCsv} 
                onChange={e => setBulkCsv(e.target.value)} 
              />
              <button onClick={handleBulkImport} className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20">PROCESS MARKS IMPORT</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicModule;
