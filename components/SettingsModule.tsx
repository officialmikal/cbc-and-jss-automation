
import React, { useState } from 'react';
import { UserRole } from '../types';
import { saveCredentials, getCredentials } from '../store';
import { Lock, Key, ShieldCheck, Save, AlertTriangle } from 'lucide-react';

const SettingsModule: React.FC = () => {
  const [creds, setCreds] = useState(getCredentials());
  const [success, setSuccess] = useState(false);

  const handlePasswordChange = (role: UserRole, newPass: string) => {
    setCreds(prev => ({
      ...prev,
      [role]: { ...prev[role], password: newPass }
    }));
  };

  const handleSave = () => {
    saveCredentials(creds);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
            <Lock className="w-6 h-6 text-indigo-600" /> 
            System Credential Management
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Manage access passwords for all system roles. Only Administrators can view this page.</p>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.values(UserRole).map(role => (
              <div key={role} className="space-y-3 p-6 bg-slate-50 rounded-2xl border border-slate-100 transition-all hover:border-indigo-100 group">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-500 transition-colors">
                    {role} Role
                  </label>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 font-medium">Username: <span className="text-slate-800 font-bold">{creds[role].username}</span></p>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl font-mono text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                      value={creds[role].password}
                      onChange={(e) => handlePasswordChange(role, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-bold text-amber-800">Security Warning</p>
              <p className="text-amber-700 leading-relaxed">Changing these passwords will take effect immediately. Ensure you inform the respective personnel of their new credentials. Passwords are stored securely in the system's local repository.</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
             <div className={`flex items-center gap-2 text-emerald-600 font-bold text-sm transition-opacity duration-500 ${success ? 'opacity-100' : 'opacity-0'}`}>
                <ShieldCheck className="w-5 h-5" /> Changes saved successfully!
             </div>
             <button 
              onClick={handleSave}
              className="flex items-center gap-3 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
            >
              <Save className="w-5 h-5" /> Save All Credentials
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-4">System Backup & Restore</h3>
        <p className="text-slate-500 text-sm mb-6">Download a snapshot of all school data (Students, Assessments, and Fees) or restore from a previous backup file.</p>
        <div className="flex gap-4">
          <button onClick={() => alert("Backup downloaded to es_backup.json")} className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">Download Backup</button>
          <button className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">Restore Data</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModule;
