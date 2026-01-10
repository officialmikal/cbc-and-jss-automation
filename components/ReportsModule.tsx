
import React, { useState } from 'react';
import { Student, Assessment } from '../types';
import ReportCard from './ReportCard';
import { FileText, Search, Printer } from 'lucide-react';

interface ReportsModuleProps {
  students: Student[];
  assessments: Assessment[];
}

const ReportsModule: React.FC<ReportsModuleProps> = ({ students, assessments }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search learner..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <p className="text-sm text-slate-500 font-medium">Click on a learner to view or print their termly report.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => {
          const studentAssessments = assessments.filter(a => a.studentId === s.id);
          const hasMarks = studentAssessments.length > 0;
          return (
            <div 
              key={s.id}
              onClick={() => setSelectedStudent(s)}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  {s.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{s.name}</h4>
                  <p className="text-xs text-slate-400">{s.admissionNo} | {s.grade}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${hasMarks ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {hasMarks ? 'MARKS ENTERED' : 'PENDING'}
                </span>
                <div className="flex gap-2">
                  <Printer className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                  <FileText className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedStudent && (
        <ReportCard 
          student={selectedStudent} 
          assessments={assessments} 
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
};

export default ReportsModule;
