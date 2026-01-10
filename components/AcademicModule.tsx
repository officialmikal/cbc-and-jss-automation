
import React, { useState } from 'react';
import { Student, Assessment, Subject, PerformanceLevel } from '../types';
import { PRIMARY_SUBJECTS, JSS_SUBJECTS } from '../constants';
import { calculatePerformanceLevel } from '../store';
import { generateTeacherRemarks } from '../services/aiService';
import { Sparkles, Save, Info, CheckCircle2, Loader2 } from 'lucide-react';

interface AcademicModuleProps {
  students: Student[];
  assessments: Assessment[];
  onSaveAssessments: (newAssessments: Assessment[]) => void;
}

const AcademicModule: React.FC<AcademicModuleProps> = ({ students, assessments, onSaveAssessments }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [loadingRemarks, setLoadingRemarks] = useState<Record<string, boolean>>({});

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const subjects = selectedStudent 
    ? (selectedStudent.grade.startsWith('Grade 7') || selectedStudent.grade.startsWith('Grade 8') || selectedStudent.grade.startsWith('Grade 9') ? JSS_SUBJECTS : PRIMARY_SUBJECTS)
    : [];

  const handleScoreChange = (subId: string, val: string) => {
    const num = parseInt(val) || 0;
    setScores(prev => ({ ...prev, [subId]: num }));
  };

  const handleGenerateAI = async (subId: string, subjectName: string) => {
    if (!scores[subId]) return;
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
      term: 1,
      year: 2024,
      score: scores[sub.id] || 0,
      level: calculatePerformanceLevel(scores[sub.id] || 0),
      remarks: remarks[sub.id] || ''
    }));
    onSaveAssessments(newBatch);
    alert("Marks updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Select Learner to Assess</label>
        <select 
          className="w-full max-w-md px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl"
          value={selectedStudentId}
          onChange={e => setSelectedStudentId(e.target.value)}
        >
          <option value="">-- Choose Student --</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.admissionNo} - {s.name} ({s.grade})</option>)}
        </select>
      </div>

      {selectedStudent && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="xl:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase">Subject</th>
                    <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase">Score (%)</th>
                    <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase">CBC Level</th>
                    <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map(sub => {
                    const level = calculatePerformanceLevel(scores[sub.id] || 0);
                    return (
                      <tr key={sub.id}>
                        <td className="px-6 py-4 font-medium text-slate-700">{sub.name}</td>
                        <td className="px-6 py-4">
                          <input 
                            type="number" 
                            min="0" max="100"
                            className="w-20 px-3 py-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                            value={scores[sub.id] || ''}
                            onChange={e => handleScoreChange(sub.id, e.target.value)}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                            level === PerformanceLevel.EE ? 'bg-emerald-100 text-emerald-700' :
                            level === PerformanceLevel.ME ? 'bg-blue-100 text-blue-700' :
                            level === PerformanceLevel.AE ? 'bg-amber-100 text-amber-700' :
                            'bg-rose-100 text-rose-700'
                          }`}>
                            {level.split(' ')[0]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <textarea 
                              rows={2}
                              className="w-full text-xs p-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 outline-none"
                              placeholder="Type remarks or use AI..."
                              value={remarks[sub.id] || ''}
                              onChange={e => setRemarks({...remarks, [sub.id]: e.target.value})}
                            />
                            <button 
                              onClick={() => handleGenerateAI(sub.id, sub.name)}
                              disabled={loadingRemarks[sub.id] || !scores[sub.id]}
                              className="absolute bottom-2 right-2 p-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 disabled:opacity-50 transition-colors"
                              title="Generate AI Remarks"
                            >
                              {loadingRemarks[sub.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end">
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
              >
                <Save className="w-5 h-5" /> Save Assessment Data
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 rounded-2xl shadow-xl">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-200" /> Assessment Helper
              </h4>
              <div className="space-y-3 text-sm text-indigo-50">
                <p>Ensure you select the correct Performance Level based on the learner's achievement.</p>
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <p className="font-semibold mb-2">CBC Rating Guide:</p>
                  <ul className="space-y-1">
                    <li className="flex justify-between"><span>80-100%</span> <span className="font-bold">EE</span></li>
                    <li className="flex justify-between"><span>60-79%</span> <span className="font-bold">ME</span></li>
                    <li className="flex justify-between"><span>40-59%</span> <span className="font-bold">AE</span></li>
                    <li className="flex justify-between"><span>0-39%</span> <span className="font-bold">BE</span></li>
                  </ul>
                </div>
                <div className="pt-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>AI generates context-aware remarks.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicModule;
