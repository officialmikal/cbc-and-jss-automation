import React, { useState, useEffect } from 'react';
import { UserRole, Student, Assessment, Payment, Subject } from './types';
import * as store from './store';
import { getSubjectsByGrade } from './constants';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import StudentManagement from './components/StudentManagement';
import AcademicModule from './components/AcademicModule';
import FinanceModule from './components/FinanceModule';
import ReportsModule from './components/ReportsModule';
import SettingsModule from './components/SettingsModule';
import SubjectManagement from './components/SubjectManagement';
import { LogIn, ShieldAlert, Lock, User as UserIcon, AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<{ role: UserRole; username: string } | null>(null);
  const [activeTab, setActiveTab] = useState('subjects');
  const [students, setStudents] = useState<Student[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  // Login Form State
  const [loginRole, setLoginRole] = useState<UserRole>(UserRole.ADMIN);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Initial Load
    try {
      setStudents(store.getStudents());
      setAssessments(store.getAssessments());
      setPayments(store.getPayments());
      
      const savedSubjects = store.getSubjects();
      if (!savedSubjects || savedSubjects.length === 0) {
        const seed: Subject[] = [];
        // Default subjects for standard grades
        ['PP1', 'Grade 1', 'Grade 4', 'Grade 7'].forEach(g => {
          getSubjectsByGrade(g).forEach(s => {
            seed.push({ ...s, id: `${s.id}-${g}`, grade: g, teacherName: 'To be assigned' });
          });
        });
        setSubjects(seed);
        store.saveSubjects(seed);
      } else {
        setSubjects(savedSubjects);
      }

      // Session Check
      const savedUser = localStorage.getItem('es_session');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Initialization error:", e);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAuthenticating(true);

    setTimeout(() => {
      const dynamicCreds = store.getCredentials();
      const creds = dynamicCreds[loginRole];
      if (username === creds.username && password === creds.password) {
        const authenticatedUser = { role: loginRole, username };
        setUser(authenticatedUser);
        localStorage.setItem('es_session', JSON.stringify(authenticatedUser));
      } else {
        setError('Invalid credentials. Please check and try again.');
      }
      setIsAuthenticating(false);
    }, 600);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('es_session');
    setPassword('');
    setUsername('');
    setActiveTab('subjects');
  };

  const handleAddStudent = (s: Student) => {
    setStudents(prev => {
      const updated = [...prev, s];
      store.saveStudents(updated);
      return updated;
    });
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm("Delete this student permanently?")) {
      setStudents(prev => {
        const updated = prev.filter(s => s.id !== id);
        store.saveStudents(updated);
        return updated;
      });
      setAssessments(prev => {
        const updated = prev.filter(a => a.studentId !== id);
        store.saveAssessments(updated);
        return updated;
      });
    }
  };

  const handleAddSubject = (s: Subject) => {
    setSubjects(prev => {
      const updated = [...prev, s];
      store.saveSubjects(updated);
      return updated;
    });
  };

  const handleUpdateSubject = (updatedSub: Subject) => {
    setSubjects(prev => {
      const updated = prev.map(s => s.id === updatedSub.id ? updatedSub : s);
      store.saveSubjects(updated);
      return updated;
    });
  };

  const handleDeleteSubject = (id: string) => {
    if (window.confirm("Remove this subject?")) {
      setSubjects(prev => {
        const updated = prev.filter(s => s.id !== id);
        store.saveSubjects(updated);
        return updated;
      });
    }
  };

  const handleSaveAssessments = (newBatch: Assessment[]) => {
    setAssessments(prev => {
      const updated = [...prev];
      newBatch.forEach(newItem => {
        const idx = updated.findIndex(a => a.studentId === newItem.studentId && a.subjectId === newItem.subjectId && a.term === newItem.term && a.year === newItem.year);
        if (idx > -1) updated[idx] = newItem;
        else updated.push(newItem);
      });
      store.saveAssessments(updated);
      return updated;
    });
  };

  const handleAddPayment = (p: Payment) => {
    setPayments(prev => {
      const updated = [...prev, p];
      store.savePayments(updated);
      return updated;
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="w-full max-w-lg relative z-10">
          <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
            <div className="p-10 text-center bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative">
              <div className="w-20 h-20 bg-white/10 rounded-3xl mx-auto mb-6 flex items-center justify-center backdrop-blur-md border border-white/30 shadow-inner">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tighter">ElimuSmart</h2>
              <p className="text-indigo-100/80 text-sm mt-1 font-medium">School Management System</p>
              
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {Object.values(UserRole).map(role => (
                  <button
                    key={role}
                    onClick={() => setLoginRole(role)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                      loginRole === role 
                      ? 'bg-white text-indigo-600 border-white shadow-lg' 
                      : 'bg-indigo-500/30 text-indigo-100 border-indigo-400/30 hover:bg-indigo-500/50'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-10">
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in slide-in-from-top-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-semibold">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Username"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 w-5 h-5" />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-700"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isAuthenticating}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {isAuthenticating ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                </button>
              </form>
            </div>
          </div>
          <p className="mt-8 text-center text-slate-500 text-sm">
            &copy; 2024 ElimuSmart Solutions Kenya
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      role={user.role} 
      onLogout={handleLogout} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {activeTab === 'dashboard' && <Dashboard students={students} payments={payments} assessments={assessments} />}
      {activeTab === 'students' && <StudentManagement students={students} onAddStudent={handleAddStudent} onDeleteStudent={handleDeleteStudent} />}
      {activeTab === 'academic' && <AcademicModule students={students} assessments={assessments} subjects={subjects} onSaveAssessments={handleSaveAssessments} />}
      {activeTab === 'subjects' && <SubjectManagement subjects={subjects} onAddSubject={handleAddSubject} onUpdateSubject={handleUpdateSubject} onDeleteSubject={handleDeleteSubject} />}
      {activeTab === 'finance' && <FinanceModule students={students} payments={payments} onAddPayment={handleAddPayment} />}
      {activeTab === 'reports' && <ReportsModule students={students} assessments={assessments} subjects={subjects} />}
      {activeTab === 'settings' && user.role === UserRole.ADMIN && <SettingsModule />}
    </Layout>
  );
};

export default App;