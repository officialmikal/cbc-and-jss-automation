
import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Wallet, 
  FileText, 
  LogOut,
  Settings as SettingsIcon,
  ShieldCheck,
  Wifi,
  WifiOff
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, onLogout, activeTab, setActiveTab }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.ACCOUNTANT, UserRole.HEADTEACHER] },
    { id: 'students', label: 'Students', icon: Users, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.HEADTEACHER] },
    { id: 'academic', label: 'Academic/CBC', icon: BookOpen, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.HEADTEACHER] },
    { id: 'finance', label: 'Finance', icon: Wallet, roles: [UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.HEADTEACHER] },
    { id: 'reports', label: 'School Reports', icon: FileText, roles: [UserRole.ADMIN, UserRole.HEADTEACHER] },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, roles: [UserRole.ADMIN] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex-shrink-0 flex flex-col no-print">
        <div className="p-6">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-sm">ES</div>
            ElimuSmart
          </div>
          <div className="mt-2 text-[10px] text-indigo-300 font-black bg-indigo-800/50 px-2 py-1 rounded inline-block uppercase tracking-widest">
            {role}
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredMenu.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                ? 'bg-white text-indigo-900 shadow-lg' 
                : 'text-indigo-100 hover:bg-indigo-800/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-indigo-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-indigo-100 hover:bg-indigo-800/50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 relative">
        <header className="mb-8 flex justify-between items-center no-print">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {menuItems.find(m => m.id === activeTab)?.label || 'System'}
            </h1>
            <p className="text-slate-500 text-sm">ElimuSmart Management Portal</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Online/Offline Status Pill */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
              isOnline 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
              : 'bg-rose-50 text-rose-700 border-rose-100'
            }`}>
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-700 uppercase tracking-tighter">Secure</span>
            </div>
          </div>
        </header>

        {!isOnline && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4 text-amber-800 animate-in slide-in-from-top-4">
            <WifiOff className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">
              You are currently working <strong>Offline</strong>. Data will be saved locally. AI remarks and Cloud features are temporarily disabled.
            </p>
          </div>
        )}

        {children}
      </main>
    </div>
  );
};

export default Layout;
