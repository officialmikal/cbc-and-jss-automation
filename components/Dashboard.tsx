
import React from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  AlertCircle,
  Trophy,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Student, Payment, Assessment } from '../types';

interface DashboardProps {
  students: Student[];
  payments: Payment[];
  assessments: Assessment[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, payments, assessments }) => {
  const totalFees = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalStudents = students.length;
  
  const avgPerformance = assessments.length > 0 
    ? (assessments.reduce((acc, a) => acc + a.score, 0) / assessments.length).toFixed(1)
    : 0;

  const gradeDistribution = students.reduce((acc: any, s) => {
    acc[s.grade] = (acc[s.grade] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(gradeDistribution).map(k => ({
    name: k,
    count: gradeDistribution[k]
  }));

  const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#0ea5e9', '#8b5cf6'];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Learners enrolled" 
          value={totalStudents.toString()} 
          icon={Users} 
          color="bg-indigo-600"
          trend="+4.5% from last month"
        />
        <StatCard 
          label="Fees Collected" 
          value={`KSh ${totalFees.toLocaleString()}`} 
          icon={CreditCard} 
          color="bg-emerald-600"
          trend="82% of target reached"
        />
        <StatCard 
          label="Mean Performance" 
          value={`${avgPerformance}%`} 
          icon={TrendingUp} 
          color="bg-amber-500"
          trend="Improving vs Term 1"
        />
        <StatCard 
          label="Active Assessments" 
          value={assessments.length.toString()} 
          icon={Calendar} 
          color="bg-sky-500"
          trend="Syncing in real-time"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Grade Distribution</h3>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600"></span>
              <span className="text-[10px] font-black uppercase text-slate-400">Current Enrollment</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                <YAxis fontSize={10} fontWeight="900" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={40}>
                   {barData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-black text-slate-800 tracking-tight">Top Performers</h3>
             <Trophy className="w-6 h-6 text-amber-500" />
          </div>
          <div className="space-y-4">
             {students.slice(0, 4).map((s, idx) => (
               <div key={s.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:text-indigo-600">#{idx+1}</div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-800 text-sm">{s.name}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{s.grade}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-all" />
               </div>
             ))}
             {students.length === 0 && <p className="text-center py-10 text-slate-400 italic">Ranking will update after term exams.</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-8 py-6 bg-slate-50/50 border-b flex items-center justify-between">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Admissions</h3>
          <button className="text-[10px] font-black uppercase text-indigo-600 tracking-widest hover:underline">Full Directory</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black tracking-widest border-b">
                <th className="px-8 py-5">Adm No.</th>
                <th className="px-8 py-5">Learner Name</th>
                <th className="px-8 py-5">Grade</th>
                <th className="px-8 py-5">Adm Date</th>
                <th className="px-8 py-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.slice().reverse().slice(0, 5).map(student => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-800">{student.admissionNo}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-600">{student.name}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{student.grade}</td>
                  <td className="px-8 py-5 text-sm text-slate-400">{new Date(student.admissionDate).toLocaleDateString('en-KE')}</td>
                  <td className="px-8 py-5 text-right">
                    <span className="px-3 py-1 text-[10px] font-black uppercase bg-emerald-100 text-emerald-700 rounded-lg tracking-widest">Active</span>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-slate-300 italic">
                    <AlertCircle className="w-10 h-10 mx-auto mb-4 opacity-20" />
                    No learner data synchronized yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, trend }: any) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all group">
    <div className="flex items-start justify-between mb-4">
      <div className={`p-4 rounded-2xl text-white shadow-lg ${color} shadow-indigo-600/10`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <h4 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h4>
    <div className="mt-4 flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{trend}</p>
    </div>
  </div>
);

export default Dashboard;
