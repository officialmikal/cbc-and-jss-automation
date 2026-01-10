
import React from 'react';
import { Student, Assessment, PerformanceLevel } from '../types';
import { PRIMARY_SUBJECTS, JSS_SUBJECTS, SCHOOL_DEFAULTS } from '../constants';
import { Printer, Download } from 'lucide-react';

interface ReportCardProps {
  student: Student;
  assessments: Assessment[];
  onClose: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ student, assessments, onClose }) => {
  const subjects = student.grade.startsWith('Grade 7') || student.grade.startsWith('Grade 8') || student.grade.startsWith('Grade 9') 
    ? JSS_SUBJECTS 
    : PRIMARY_SUBJECTS;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] overflow-auto">
      <div className="max-w-4xl mx-auto p-4 md:p-12">
        <div className="no-print mb-8 flex items-center justify-between">
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 rounded-lg font-bold">Back to List</button>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-6 py-2 bg-slate-800 text-white rounded-lg" onClick={() => alert("PDF Generation requires backend/library, use Print instead.")}>
              <Download className="w-4 h-4" /> Export PDF
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg">
              <Printer className="w-4 h-4" /> Print Report
            </button>
          </div>
        </div>

        {/* Report Card Content */}
        <div className="border-[3px] border-indigo-900 p-8 rounded shadow-lg bg-white relative">
          <div className="absolute top-8 right-8 w-24 h-24 border border-slate-200 p-2 text-xs text-center flex items-center justify-center italic text-slate-300">
             School Stamp Here
          </div>

          <header className="flex items-center gap-8 border-b-2 border-indigo-900 pb-8 mb-8">
            <img src={SCHOOL_DEFAULTS.logo} alt="Logo" className="w-24 h-24 object-cover rounded" />
            <div className="flex-1">
              <h1 className="text-3xl font-black text-indigo-900 uppercase tracking-tight">{SCHOOL_DEFAULTS.name}</h1>
              <p className="italic text-indigo-700 font-bold mb-2">{SCHOOL_DEFAULTS.motto}</p>
              <div className="text-sm text-slate-600 space-y-1">
                <p>{SCHOOL_DEFAULTS.box}</p>
                <p>Email: {SCHOOL_DEFAULTS.email} | Phone: {SCHOOL_DEFAULTS.phone}</p>
              </div>
            </div>
          </header>

          <div className="text-center mb-8">
            <h2 className="text-xl font-bold bg-indigo-900 text-white inline-block px-8 py-1 rounded">TERMLY PROGRESS REPORT</h2>
            <p className="mt-2 font-bold text-slate-700">TERM 1 - 2024</p>
          </div>

          <section className="grid grid-cols-2 gap-x-12 gap-y-4 mb-8 bg-slate-50 p-6 rounded-lg border border-slate-200">
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Learner's Name</p>
              <p className="font-bold border-b border-slate-300">{student.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Admission No.</p>
              <p className="font-bold border-b border-slate-300">{student.admissionNo}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Grade/Class</p>
              <p className="font-bold border-b border-slate-300">{student.grade}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-bold">Attendance</p>
              <p className="font-bold border-b border-slate-300">68 / 70 Days</p>
            </div>
          </section>

          <table className="w-full border-collapse border border-slate-800 mb-8">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-800 p-2 text-left text-sm uppercase">Learning Area (Subject)</th>
                <th className="border border-slate-800 p-2 text-center text-sm uppercase">Score (%)</th>
                <th className="border border-slate-800 p-2 text-center text-sm uppercase">Performance Level</th>
                <th className="border border-slate-800 p-2 text-left text-sm uppercase">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(sub => {
                const assessment = assessments.find(a => a.subjectId === sub.id && a.studentId === student.id);
                return (
                  <tr key={sub.id}>
                    <td className="border border-slate-800 p-2 font-medium">{sub.name}</td>
                    <td className="border border-slate-800 p-2 text-center font-bold">{assessment?.score || '-'}</td>
                    <td className="border border-slate-800 p-2 text-center text-xs font-bold uppercase">
                      {assessment?.level.split(' ')[0] || '-'}
                    </td>
                    <td className="border border-slate-800 p-2 text-xs italic">{assessment?.remarks || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="grid grid-cols-4 gap-2 mb-8 text-[10px] text-center uppercase font-bold">
            <div className="border border-slate-800 p-2">EE: EXCEEDING EXPECTATIONS (80-100)</div>
            <div className="border border-slate-800 p-2">ME: MEETING EXPECTATIONS (60-79)</div>
            <div className="border border-slate-800 p-2">AE: APPROACHING EXPECTATIONS (40-59)</div>
            <div className="border border-slate-800 p-2">BE: BELOW EXPECTATIONS (0-39)</div>
          </div>

          <div className="space-y-6">
            <div className="border-b border-slate-300 pb-2">
              <p className="text-sm font-bold text-indigo-900 mb-1">Class Teacher's Remarks:</p>
              <p className="text-sm italic">The learner is a disciplined individual who shows keen interest in creative activities. Keep it up.</p>
            </div>
            <div className="border-b border-slate-300 pb-2">
              <p className="text-sm font-bold text-indigo-900 mb-1">Head Teacher's Remarks:</p>
              <p className="text-sm italic">Very good performance. Maintain the focus for next term.</p>
            </div>
            
            <div className="grid grid-cols-2 pt-8 gap-12">
               <div className="text-center">
                  <div className="border-b-2 border-slate-800 w-full mb-2"></div>
                  <p className="text-xs font-bold uppercase">Class Teacher Signature</p>
               </div>
               <div className="text-center">
                  <div className="border-b-2 border-slate-800 w-full mb-2"></div>
                  <p className="text-xs font-bold uppercase">Head Teacher Signature & Stamp</p>
               </div>
            </div>
          </div>

          <footer className="mt-12 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
             ElimuSmart Management System | Generated on {new Date().toLocaleDateString()}
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
