
import React from 'react';
import { UserRole } from '../types';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Wallet, 
  FileText, 
  LogOut,
  Settings,
  ShieldCheck
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role: UserRole;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, role, onLogout, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.ACCOUNTANT, UserRole.HEADTEACHER] },
    { id: 'students', label: 'Students', icon: Users, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.HEADTEACHER] },
    { id: 'academic', label: 'Academic/CBC', icon: BookOpen, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.HEADTEACHER] },
    { id: 'finance', label: 'Finance', icon: Wallet, roles: [UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.HEADTEACHER] },
    { id: 'reports', label: 'School Reports', icon: FileText, roles: [UserRole.ADMIN, UserRole.HEADTEACHER] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex-shrink-0 flex flex-col no-print">
        <div className="p-6">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">E</div>
            ElimuSmart
          </div>
          <div className="mt-2 text-xs text-indigo-300 font-medium bg-indigo-800/50 px-2 py-1 rounded inline-block">
            {role.toUpperCase()}
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
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <Settings className="w-5 h-5 text-slate-400" />
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-sm font-medium text-slate-700">Authenticated</span>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default Layout;
