
import React, { useState } from 'react';
import { Student, Assessment, Subject } from '../types';
import ReportCard from './ReportCard';
import { FileText, Search, Printer, Trophy } from 'lucide-react';

interface ReportsModuleProps {
  students: Student[];
  assessments: Assessment[];
  subjects: Subject[];
}

const ReportsModule: React.FC<ReportsModuleProps> = ({ students, assessments, subjects }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate ranks per class
  const getRankedStudents = () => {
    const scoresMap = students.map(s => {
      const studentMarks = assessments.filter(a => a.studentId === s.id);
      const total = studentMarks.reduce((acc, a) => acc + a.score, 0);
      const avg = studentMarks.length > 0 ? total / studentMarks.length : 0;
      return { ...s, avg, markCount: studentMarks.length };
    });

    const grades = [...new Set(students.map(s => s.grade))];
    const finalData: any[] = [];

    grades.forEach(grade => {
      const gradeStudents = scoresMap.filter(s => s.grade === grade)
        .sort((a, b) => b.avg - a.avg);
      
      gradeStudents.forEach((s, idx) => {
        finalData.push({ ...s, rank: s.markCount > 0 ? idx + 1 : '-' });
      });
    });

    return finalData;
  };

  const rankedData = getRankedStudents();
  const filtered = rankedData.filter(s => 
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
            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest">
           <span className="flex items-center gap-1"><Trophy className="w-3.5 h-3.5 text-amber-500" /> Automated Ranking Systems Enabled</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(s => {
          const hasMarks = s.markCount > 0;
          return (
            <div 
              key={s.id}
              onClick={() => setSelectedStudent(s)}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group relative overflow-hidden"
            >
              {s.rank === 1 && <div className="absolute top-0 right-0 bg-amber-400 text-white px-3 py-1 text-[8px] font-black uppercase">Grade Top</div>}
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg ${s.rank === 1 ? 'bg-amber-100 text-amber-600 shadow-inner' : 'bg-indigo-50 text-indigo-600'}`}>
                  {s.rank !== '-' ? s.rank : s.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{s.name}</h4>
                  <p className="text-xs text-slate-400 font-medium tracking-tight">{s.admissionNo} | {s.grade}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full inline-block w-fit tracking-widest ${hasMarks ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {hasMarks ? `${s.avg.toFixed(1)}% MEAN SCORE` : 'NO MARKS RECORDED'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Printer className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
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
          subjects={subjects.filter(sub => sub.grade === selectedStudent.grade)}
          onClose={() => setSelectedStudent(null)} 
        />
      )}
    </div>
  );
};

export default ReportsModule;
