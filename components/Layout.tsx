
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
  WifiOff,
  Menu,
  X
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    { id: 'academic', label: 'Academic', icon: BookOpen, roles: [UserRole.ADMIN, UserRole.TEACHER, UserRole.HEADTEACHER] },
    { id: 'finance', label: 'Finance', icon: Wallet, roles: [UserRole.ADMIN, UserRole.ACCOUNTANT, UserRole.HEADTEACHER] },
    { id: 'reports', label: 'Reports', icon: FileText, roles: [UserRole.ADMIN, UserRole.HEADTEACHER] },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, roles: [UserRole.ADMIN] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(role));

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-indigo-950 text-white z-[70] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} no-print`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-sm">ES</div>
              ElimuSmart
            </div>
            <button className="lg:hidden" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-6 h-6 text-indigo-300" />
            </button>
          </div>
          <div className="mt-3 text-[10px] text-indigo-300 font-black bg-indigo-900/50 px-2 py-1.5 rounded-lg inline-block uppercase tracking-widest border border-indigo-800/30">
            {role}
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredMenu.map(item => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${
                activeTab === item.id 
                ? 'bg-white text-indigo-950 shadow-xl shadow-black/10' 
                : 'text-indigo-100 hover:bg-indigo-900/50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-indigo-600' : ''}`} />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-indigo-900/50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-rose-300 hover:bg-rose-500/10 rounded-2xl transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <span className="font-semibold text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 no-print">
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2">
            <Menu className="w-6 h-6 text-slate-600" />
          </button>
          <h1 className="font-bold text-slate-800 text-lg">ElimuSmart</h1>
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        </header>

        {/* Desktop Header & Content Scroll */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 lg:p-10 pb-24 lg:pb-10 relative custom-scrollbar">
          <header className="hidden lg:flex justify-between items-center mb-10 no-print">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {menuItems.find(m => m.id === activeTab)?.label || 'System'}
              </h1>
              <p className="text-slate-500 text-sm font-medium">Empowering Future Generations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                isOnline 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                : 'bg-rose-50 text-rose-700 border-rose-100'
              }`}>
                {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-100">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">Secure Terminal</span>
              </div>
            </div>
          </header>

          {!isOnline && (
            <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-3xl flex items-center gap-5 text-amber-900 animate-in slide-in-from-top-4 shadow-sm">
              <WifiOff className="w-6 h-6 flex-shrink-0 text-amber-600" />
              <p className="text-sm font-semibold leading-snug">
                <strong>Offline Mode Enabled:</strong> Your changes will be saved to local storage and synced later. Some cloud-based AI features are currently unavailable.
              </p>
            </div>
          )}

          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 lg:hidden flex justify-around items-center h-20 px-2 z-[50] no-print">
        {filteredMenu.slice(0, 5).map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all ${
              activeTab === item.id 
              ? 'text-indigo-600 bg-indigo-50' 
              : 'text-slate-400'
            }`}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
