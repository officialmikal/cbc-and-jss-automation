
import React, { useState } from 'react';
import { Student, Assessment } from '../types';
import ReportCard from './ReportCard';
import { FileText, Search, Printer, Trophy, Star } from 'lucide-react';

interface ReportsModuleProps {
  students: Student[];
  assessments: Assessment[];
}

const ReportsModule: React.FC<ReportsModuleProps> = ({ students, assessments }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate ranks per class
  const getRankedStudents = () => {
    // 1. Calculate average for each student
    const scoresMap = students.map(s => {
      const studentMarks = assessments.filter(a => a.studentId === s.id);
      const total = studentMarks.reduce((acc, a) => acc + a.score, 0);
      const avg = studentMarks.length > 0 ? total / studentMarks.length : 0;
      return { ...s, avg, markCount: studentMarks.length };
    });

    // 2. Rank by average within each grade
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
            className="w-full pl-10 pr-4 py-2 border rounded-xl"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 text-xs font-bold uppercase text-slate-400">
           <span className="flex items-center gap-1"><Trophy className="w-3 h-3 text-amber-500" /> Auto-Ranking Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(s => {
          const hasMarks = s.markCount > 0;
          return (
            <div 
              key={s.id}
              onClick={() => setSelectedStudent(s)}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group relative overflow-hidden"
            >
              {s.rank === 1 && <div className="absolute top-0 right-0 bg-amber-400 text-white px-2 py-1 text-[8px] font-black uppercase">Class Top</div>}
              
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${s.rank === 1 ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  {s.rank !== '-' ? s.rank : s.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">{s.name}</h4>
                  <p className="text-xs text-slate-400">{s.admissionNo} | {s.grade}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex flex-col">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block w-fit ${hasMarks ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                    {hasMarks ? `${s.avg.toFixed(1)}% MEAN` : 'PENDING'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {s.rank !== '-' && <Trophy className={`w-4 h-4 ${s.rank <= 3 ? 'text-amber-500' : 'text-slate-300'}`} />}
                  <Printer className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedStudent && (
        <ReportCard student={selectedStudent} assessments={assessments} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
};

export default ReportsModule;
