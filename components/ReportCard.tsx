
import React from 'react';
import { Student, Assessment, Subject } from '../types';
import { SCHOOL_DEFAULTS } from '../constants';
import { Printer, ChevronLeft } from 'lucide-react';

interface ReportCardProps {
  student: Student;
  assessments: Assessment[];
  subjects: Subject[];
  onClose: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ student, assessments, subjects, onClose }) => {
  const displayTerm = assessments.length > 0 ? assessments[0].term : 1;
  const displayYear = assessments.length > 0 ? assessments[0].year : 2024;
  const attendance = assessments.length > 0 ? { present: assessments[0].daysPresent, total: assessments[0].totalDays } : null;

  return (
    <div className="fixed inset-0 bg-white z-[100] overflow-auto pb-20 no-print">
      <div className="max-w-4xl mx-auto p-4 md:p-12">
        <div className="mb-8 flex justify-between items-center no-print">
          <button onClick={onClose} className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-2xl font-bold"><ChevronLeft className="w-4 h-4" /> Back</button>
          <button onClick={() => window.print()} className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg"><Printer className="w-4 h-4" /> Print Report</button>
        </div>

        <div className="border-[6px] border-slate-900 p-8 md:p-16 rounded shadow-2xl bg-white print:border-[2px] print:shadow-none print:p-8">
          <header className="flex items-center gap-8 border-b-4 border-slate-900 pb-10 mb-10">
            <img src={SCHOOL_DEFAULTS.logo} alt="Logo" className="w-24 h-24 object-cover border-2 border-slate-900 rounded-lg" />
            <div className="flex-1">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{SCHOOL_DEFAULTS.name}</h1>
              <p className="italic text-indigo-600 font-bold">"{SCHOOL_DEFAULTS.motto}"</p>
              <div className="text-[10px] text-slate-500 font-bold uppercase mt-2">
                <p>{SCHOOL_DEFAULTS.box}</p>
                <p>Email: {SCHOOL_DEFAULTS.email} | Tel: {SCHOOL_DEFAULTS.phone}</p>
              </div>
            </div>
          </header>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-black bg-slate-900 text-white inline-block px-12 py-2 rounded-lg uppercase">Learner Progress Report</h2>
            <div className="mt-4 flex justify-center gap-4 text-sm font-black uppercase text-slate-600">
               <span>Term: {displayTerm}</span>
               <span>Year: {displayYear}</span>
            </div>
          </div>

          <section className="grid grid-cols-2 gap-y-6 mb-10 bg-slate-50 p-6 rounded-2xl">
            <div><p className="text-[9px] text-slate-400 font-black uppercase">Name</p><p className="font-black text-slate-800 border-b border-slate-300">{student.name}</p></div>
            <div><p className="text-[9px] text-slate-400 font-black uppercase">Admission #</p><p className="font-black text-slate-800 border-b border-slate-300">{student.admissionNo}</p></div>
            <div><p className="text-[9px] text-slate-400 font-black uppercase">Grade/Level</p><p className="font-black text-slate-800 border-b border-slate-300">{student.grade}</p></div>
            <div><p className="text-[9px] text-slate-400 font-black uppercase">Gender</p><p className="font-black text-slate-800 border-b border-slate-300">{student.gender}</p></div>
          </section>

          <table className="w-full border-collapse border-2 border-slate-900 mb-10">
            <thead>
              <tr className="bg-slate-900 text-white text-[9px] font-black uppercase">
                <th className="border border-slate-800 px-4 py-3 text-left">Learning Area</th>
                <th className="border border-slate-800 px-4 py-3 text-center">Score %</th>
                <th className="border border-slate-800 px-4 py-3 text-center">Performance Level</th>
                <th className="border border-slate-800 px-4 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {subjects.map(sub => {
                const a = assessments.find(itm => itm.subjectId === sub.id && itm.studentId === student.id && itm.term === displayTerm);
                return (
                  <tr key={sub.id}>
                    <td className="border border-slate-300 px-4 py-2 font-bold">{sub.name}</td>
                    <td className="border border-slate-300 px-4 py-2 text-center font-black">{a?.score || '-'}</td>
                    <td className="border border-slate-300 px-4 py-2 text-center font-bold text-[10px] uppercase text-slate-500">{a?.level.split(' ')[0] || '-'}</td>
                    <td className="border border-slate-300 px-4 py-2 italic text-[10px]">{a?.remarks || 'Progressing well.'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
             <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="text-[10px] font-black uppercase mb-2">Attendance Summary</h4>
                <p className="text-sm font-bold">Days Present: {attendance?.present || '-'} / {attendance?.total || '-'}</p>
             </div>
             <div className="space-y-4">
                <div className="border-b-2 border-slate-300 pb-2">
                   <p className="text-[10px] font-black uppercase">Class Teacher Sign:</p>
                </div>
                <div className="border-b-2 border-slate-300 pb-2">
                   <p className="text-[10px] font-black uppercase">Head Teacher Sign:</p>
                </div>
             </div>
          </div>

          <footer className="text-center text-[9px] text-slate-400 border-t pt-4 font-bold uppercase tracking-widest">
            Generated via ElimuSmart JSS Management System | Kenya
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
