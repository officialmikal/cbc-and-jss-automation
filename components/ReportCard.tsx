
import React from 'react';
import { Student, Assessment, PerformanceLevel } from '../types';
import { getSubjectsByGrade, SCHOOL_DEFAULTS } from '../constants';
import { Printer, Download, ChevronLeft } from 'lucide-react';

interface ReportCardProps {
  student: Student;
  assessments: Assessment[];
  onClose: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ student, assessments, onClose }) => {
  const subjects = getSubjectsByGrade(student.grade);

  // Assume the report is for the student's registered term/year if assessments exist
  const displayTerm = assessments.length > 0 ? assessments[0].term : (student.term || 1);
  const displayYear = assessments.length > 0 ? assessments[0].year : (student.year || new Date().getFullYear());

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-white z-[100] overflow-auto pb-20 lg:pb-0">
      <div className="max-w-4xl mx-auto p-4 md:p-12">
        <div className="no-print mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button onClick={onClose} className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 text-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors flex items-center justify-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Back to List
          </button>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-colors" onClick={() => handlePrint()}>
              <Download className="w-4 h-4" /> Save PDF
            </button>
            <button onClick={handlePrint} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-600/20">
              <Printer className="w-4 h-4" /> Print
            </button>
          </div>
        </div>

        {/* Report Card Template */}
        <div className="border-[4px] border-slate-900 p-6 md:p-12 rounded shadow-2xl bg-white relative print:border-[2px] print:shadow-none print:p-8">
          <div className="absolute top-10 right-10 w-28 h-28 border-2 border-slate-100 p-2 text-[10px] text-center flex items-center justify-center italic text-slate-200 uppercase font-black leading-tight tracking-tighter print:opacity-50">
             Official School Stamp & Seal Required
          </div>

          <header className="flex flex-col md:flex-row items-center gap-6 md:gap-10 border-b-4 border-slate-900 pb-10 mb-10 text-center md:text-left">
            <img src={SCHOOL_DEFAULTS.logo} alt="School Logo" className="w-28 h-28 object-cover rounded-2xl shadow-md border-4 border-slate-50" />
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9] mb-2">{SCHOOL_DEFAULTS.name}</h1>
              <p className="italic text-indigo-600 font-bold mb-4 tracking-tight">" {SCHOOL_DEFAULTS.motto} "</p>
              <div className="text-[11px] text-slate-500 space-y-1 font-black uppercase tracking-widest">
                <p>{SCHOOL_DEFAULTS.box}</p>
                <p>Email: {SCHOOL_DEFAULTS.email} | Tel: {SCHOOL_DEFAULTS.phone}</p>
              </div>
            </div>
          </header>

          <div className="text-center mb-10">
            <h2 className="text-2xl font-black bg-slate-900 text-white inline-block px-10 py-2.5 rounded-xl uppercase tracking-widest shadow-lg">Progressive Report Card</h2>
            <div className="mt-4 font-black text-slate-800 uppercase tracking-widest text-lg flex justify-center gap-4">
               <span className="bg-slate-100 px-4 py-1 rounded-lg">Term {displayTerm}</span>
               <span className="bg-slate-100 px-4 py-1 rounded-lg">Year {displayYear}</span>
            </div>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 mb-10 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black mb-1.5 tracking-widest">Learner's Full Name</p>
              <p className="text-lg font-black text-slate-800 border-b-2 border-slate-300 pb-1 tracking-tight">{student.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black mb-1.5 tracking-widest">Admission Number</p>
              <p className="text-lg font-black text-slate-800 border-b-2 border-slate-300 pb-1 tracking-tight">{student.admissionNo}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black mb-1.5 tracking-widest">Current Grade Level</p>
              <p className="text-lg font-black text-slate-800 border-b-2 border-slate-300 pb-1 tracking-tight">{student.grade}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-black mb-1.5 tracking-widest">School Attendance</p>
              <p className="text-lg font-black text-slate-800 border-b-2 border-slate-300 pb-1 tracking-tight">___ / ___ Sessions</p>
            </div>
          </section>

          <div className="overflow-x-auto mb-10 custom-scrollbar">
            <table className="w-full border-collapse border-2 border-slate-900 rounded-xl overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="border border-slate-800 px-4 py-4 text-left text-[10px] uppercase font-black tracking-widest">Learning Area (Subject)</th>
                  <th className="border border-slate-800 px-4 py-4 text-center text-[10px] uppercase font-black tracking-widest">Score %</th>
                  <th className="border border-slate-800 px-4 py-4 text-center text-[10px] uppercase font-black tracking-widest">Level</th>
                  <th className="border border-slate-800 px-4 py-4 text-left text-[10px] uppercase font-black tracking-widest">Teacher's Professional Remarks</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map(sub => {
                  const assessment = assessments.find(a => a.subjectId === sub.id && a.studentId === student.id && a.term === displayTerm && a.year === displayYear);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                      <td className="border border-slate-300 px-4 py-3 font-bold text-slate-800 text-sm">{sub.name}</td>
                      <td className="border border-slate-300 px-4 py-3 text-center font-black text-indigo-600 text-lg">{assessment?.score || '-'}</td>
                      <td className="border border-slate-300 px-4 py-3 text-center text-[11px] font-black uppercase text-slate-500">
                        {assessment?.level.split(' ')[0] || '-'}
                      </td>
                      <td className="border border-slate-300 px-4 py-3 text-[11px] font-medium text-slate-600 leading-tight italic max-w-xs">{assessment?.remarks || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10 text-[9px] text-center uppercase font-black text-slate-700">
            <div className="border-2 border-slate-200 p-3 bg-emerald-50 rounded-xl">EE: Exceeding Expectations (80+)</div>
            <div className="border-2 border-slate-200 p-3 bg-blue-50 rounded-xl">ME: Meeting Expectations (60-79)</div>
            <div className="border-2 border-slate-200 p-3 bg-amber-50 rounded-xl">AE: Approaching (40-59)</div>
            <div className="border-2 border-slate-200 p-3 bg-rose-50 rounded-xl">BE: Below Expectations (0-39)</div>
          </div>

          <div className="space-y-8">
            <div className="border-b-2 border-slate-200 pb-4">
              <p className="text-xs font-black text-slate-900 mb-2 uppercase tracking-widest">Class Teacher's General Appraisal:</p>
              <p className="text-sm italic text-slate-400 min-h-[1.5rem] font-medium">____________________________________________________________________________________________________________</p>
            </div>
            <div className="border-b-2 border-slate-200 pb-4">
              <p className="text-xs font-black text-slate-900 mb-2 uppercase tracking-widest">Head Teacher's Final Comments:</p>
              <p className="text-sm italic text-slate-400 min-h-[1.5rem] font-medium">____________________________________________________________________________________________________________</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 pt-10 gap-16">
               <div className="text-center">
                  <div className="border-b-2 border-slate-900 w-full mb-3 shadow-sm"></div>
                  <p className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em]">Class Teacher Signature</p>
               </div>
               <div className="text-center">
                  <div className="border-b-2 border-slate-900 w-full mb-3 shadow-sm"></div>
                  <p className="text-[11px] font-black uppercase text-slate-500 tracking-[0.2em]">Head Teacher Signature & Stamp</p>
               </div>
            </div>
          </div>

          <footer className="mt-16 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 uppercase font-black tracking-widest">
             <span>Powered by ElimuSmart JSS Systems Kenya</span>
             <span>Report Authenticity ID: {student.id.slice(0, 12).toUpperCase()}</span>
             <span>Printed: {new Date().toLocaleDateString('en-KE')}</span>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
