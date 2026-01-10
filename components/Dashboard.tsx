
import React from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
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
  
  // Calculate average performance
  const avgPerformance = assessments.length > 0 
    ? (assessments.reduce((acc, a) => acc + a.score, 0) / assessments.length).toFixed(1)
    : 0;

  const feeData = [
    { name: 'Collected', value: totalFees },
    { name: 'Outstanding', value: totalStudents * 15000 - totalFees }, // Example static target
  ];

  const COLORS = ['#4f46e5', '#e2e8f0'];

  const gradeDistribution = students.reduce((acc: any, s) => {
    acc[s.grade] = (acc[s.grade] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.keys(gradeDistribution).map(k => ({
    name: k,
    count: gradeDistribution[k]
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="Total Students" 
          value={totalStudents.toString()} 
          icon={Users} 
          color="bg-indigo-50 text-indigo-600"
        />
        <StatCard 
          label="Fees Collected" 
          value={`KSh ${totalFees.toLocaleString()}`} 
          icon={CreditCard} 
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard 
          label="Avg Performance" 
          value={`${avgPerformance}%`} 
          icon={TrendingUp} 
          color="bg-amber-50 text-amber-600"
        />
        <StatCard 
          label="Active Assessments" 
          value={assessments.length.toString()} 
          icon={Calendar} 
          color="bg-sky-50 text-sky-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Student Distribution by Grade</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-6">Fee Status (KSh)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {feeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Recent Student Admissions</h3>
          <button className="text-indigo-600 text-sm font-medium hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-3 font-semibold text-sm text-slate-500 uppercase tracking-wider">Adm No.</th>
                <th className="pb-3 font-semibold text-sm text-slate-500 uppercase tracking-wider">Name</th>
                <th className="pb-3 font-semibold text-sm text-slate-500 uppercase tracking-wider">Grade</th>
                <th className="pb-3 font-semibold text-sm text-slate-500 uppercase tracking-wider">Admission Date</th>
                <th className="pb-3 font-semibold text-sm text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.slice(0, 5).map(student => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 text-sm font-medium text-slate-700">{student.admissionNo}</td>
                  <td className="py-4 text-sm text-slate-600">{student.name}</td>
                  <td className="py-4 text-sm text-slate-600">{student.grade}</td>
                  <td className="py-4 text-sm text-slate-600">Jan 12, 2024</td>
                  <td className="py-4">
                    <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">Active</span>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    No students registered yet.
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

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-slate-800">{value}</h4>
    </div>
    <div className={`p-3 rounded-xl ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

export default Dashboard;
