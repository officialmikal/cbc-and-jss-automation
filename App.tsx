
import React, { useState, useEffect } from 'react';
import { UserRole, Student, Assessment, Payment } from './types';
import * as store from './store';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import AcademicModule from './components/AcademicModule';
import FinanceModule from './components/FinanceModule';
import ReportsModule from './components/ReportsModule';
import { LogIn, ShieldAlert } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<{ role: UserRole } | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    setStudents(store.getStudents());
    setAssessments(store.getAssessments());
    setPayments(store.getPayments());
  }, []);

  const handleAddStudent = (s: Student) => {
    const updated = [...students, s];
    setStudents(updated);
    store.saveStudents(updated);
  };

  const handleSaveAssessments = (newBatch: Assessment[]) => {
    // Merge new assessments, replacing old ones for the same student/subject/term
    const updated = [...assessments];
    newBatch.forEach(newItem => {
      const idx = updated.findIndex(a => a.studentId === newItem.studentId && a.subjectId === newItem.subjectId && a.term === newItem.term);
      if (idx > -1) updated[idx] = newItem;
      else updated.push(newItem);
    });
    setAssessments(updated);
    store.saveAssessments(updated);
  };

  const handleAddPayment = (p: Payment) => {
    const updated = [...payments, p];
    setPayments(updated);
    store.savePayments(updated);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
        <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 text-center bg-indigo-600 text-white">
              <div className="w-20 h-20 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center backdrop-blur-md border border-white/30">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">ElimuSmart Portal</h2>
              <p className="text-indigo-100 text-sm mt-1">Kenyan School Management System</p>
            </div>
            <div className="p-8 space-y-4">
              <p className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest mb-4">Select Access Role to Start</p>
              {Object.values(UserRole).map(role => (
                <button
                  key={role}
                  onClick={() => setUser({ role })}
                  className="w-full group flex items-center justify-between px-6 py-4 border border-slate-100 rounded-2xl hover:bg-indigo-50 hover:border-indigo-200 transition-all text-left"
                >
                  <span className="font-bold text-slate-700 group-hover:text-indigo-600">{role}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-100">
                    <LogIn className="w-4 h-4 text-slate-300 group-hover:text-indigo-600" />
                  </div>
                </button>
              ))}
              <div className="mt-6 flex items-center gap-2 justify-center p-3 bg-amber-50 rounded-xl border border-amber-100">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <p className="text-[10px] text-amber-700 font-bold uppercase">Restricted School Personnel Only</p>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-slate-400 text-sm">&copy; 2024 ElimuSmart Solutions Kenya</p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      role={user.role} 
      onLogout={() => setUser(null)} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {activeTab === 'dashboard' && <Dashboard students={students} payments={payments} assessments={assessments} />}
      {activeTab === 'students' && <StudentManagement students={students} onAddStudent={handleAddStudent} />}
      {activeTab === 'academic' && <AcademicModule students={students} assessments={assessments} onSaveAssessments={handleSaveAssessments} />}
      {activeTab === 'finance' && <FinanceModule students={students} payments={payments} onAddPayment={handleAddPayment} />}
      {activeTab === 'reports' && <ReportsModule students={students} assessments={assessments} />}
    </Layout>
  );
};

export default App;
