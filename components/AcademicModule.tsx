
import React, { useState } from 'react';
import { Student, Assessment, Subject, PerformanceLevel } from '../types';
import { PRIMARY_SUBJECTS, JSS_SUBJECTS } from '../constants';
import { calculatePerformanceLevel } from '../store';
import { generateTeacherRemarks } from '../services/aiService';
import { Sparkles, Save, Info, CheckCircle2, Loader2, ListOrdered, X } from 'lucide-react';

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
  const [showBulkMarksModal, setShowBulkMarksModal] = useState(false);
  const [bulkMarksCsv, setBulkMarksCsv] = useState('');

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

  const handleBulkMarksSubmit = () => {
    const lines = bulkMarksCsv.split('\n');
    const newBatch: Assessment[] = [];
    lines.forEach(line => {
      const [adm, subId, scoreText] = line.split(',').map(s => s?.trim());
      const student = students.find(s => s.admissionNo === adm);
      const score = parseInt(scoreText) || 0;
      if (student && subId) {
        newBatch.push({
          studentId: student.id,
          subjectId: subId,
          term: 1,
          year: 2024,
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
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex-1">
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
        <button 
          onClick={() => setShowBulkMarksModal(true)}
          className="px-4 py-2 border border-indigo-200 text-indigo-600 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all"
        >
          <ListOrdered className="w-4 h-4" /> Bulk Upload Marks
        </button>
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
                            type="number" min="0" max="100"
                            className="w-20 px-3 py-2 border rounded-lg bg-slate-50"
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
                            <textarea rows={2} className="w-full text-xs p-2 bg-slate-50 border rounded-lg"
                              placeholder="Type remarks or use AI..."
                              value={remarks[sub.id] || ''}
                              onChange={e => setRemarks({...remarks, [sub.id]: e.target.value})}
                            />
                            <button onClick={() => handleGenerateAI(sub.id, sub.name)} disabled={loadingRemarks[sub.id] || !scores[sub.id]}
                              className="absolute bottom-2 right-2 p-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100">
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
              <button onClick={handleSave} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
                <Save className="w-5 h-5" /> Save Assessment Data
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 rounded-2xl shadow-xl">
              <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><Info className="w-5 h-5 text-indigo-200" /> Assessment Helper</h4>
              <div className="space-y-3 text-sm text-indigo-50">
                <p>Ensure performance levels match the achievement.</p>
                <div className="bg-white/10 p-3 rounded-xl border border-white/10">
                  <p className="font-semibold mb-2">Subject IDs for Bulk Upload:</p>
                  <ul className="text-[10px] space-y-1">
                    {subjects.map(s => <li key={s.id}>{s.id}: {s.name}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Marks Modal */}
      {showBulkMarksModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="px-8 py-6 bg-slate-50 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Bulk Marks Upload</h3>
              <button onClick={() => setShowBulkMarksModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-sm text-slate-500 italic">Format: <code className="bg-slate-100 px-1 rounded">AdmissionNo, SubjectID, Score</code></p>
              <textarea 
                className="w-full h-48 p-4 bg-slate-50 border rounded-2xl font-mono text-xs outline-none"
                placeholder="ADM001, eng_p, 85"
                value={bulkMarksCsv}
                onChange={e => setBulkMarksCsv(e.target.value)}
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowBulkMarksModal(false)} className="px-6 py-2">Cancel</button>
                <button onClick={handleBulkMarksSubmit} className="px-8 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg">Upload Marks</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicModule;
