
import React, { useState, useEffect } from 'react';
import { Student, Payment, PaymentMode, FeeStructure } from '../types';
import { getFeeStructures, saveFeeStructures, getStudentBalance, exportToCSV } from '../store';
import { Wallet, Plus, Receipt, AlertCircle, X, Download, Settings, Trash2 } from 'lucide-react';
import { GRADES } from '../constants';

interface FinanceModuleProps {
  students: Student[];
  payments: Payment[];
  onAddPayment: (payment: Payment) => void;
}

const FinanceModule: React.FC<FinanceModuleProps> = ({ students, payments, onAddPayment }) => {
  const [view, setView] = useState<'transactions' | 'defaulters' | 'structures'>('transactions');
  const [showPayModal, setShowPayModal] = useState(false);
  const [showStructureModal, setShowStructureModal] = useState(false);
  const [structures, setStructures] = useState<FeeStructure[]>(getFeeStructures());
  
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const [payForm, setPayForm] = useState({
    studentId: '',
    amount: 0,
    mode: PaymentMode.CASH,
    term: 1,
    year: currentYear,
    date: new Date().toISOString().split('T')[0]
  });

  const [structForm, setStructForm] = useState<{grade: string, term: number, year: number, items: {name: string, amount: number}[]}>({
    grade: GRADES[0],
    term: 1,
    year: currentYear,
    items: [{ name: 'Tuition', amount: 0 }]
  });

  const defaulters = students.map(s => ({
    ...s,
    balance: getStudentBalance(s, structures, payments)
  })).filter(s => s.balance > 0).sort((a,b) => b.balance - a.balance);

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPayment({ 
      id: crypto.randomUUID(), 
      ...payForm, 
      date: new Date(payForm.date).toISOString() 
    });
    setShowPayModal(false);
  };

  const handleStructureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStructures = [...structures.filter(s => !(s.grade === structForm.grade && s.term === structForm.term)), structForm as FeeStructure];
    setStructures(newStructures);
    saveFeeStructures(newStructures);
    setShowStructureModal(false);
  };

  const addStructItem = () => setStructForm({...structForm, items: [...structForm.items, { name: '', amount: 0 }]});
  const removeStructItem = (index: number) => setStructForm({...structForm, items: structForm.items.filter((_, i) => i !== index)});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Total Collections</p>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-slate-400">KSh</span>
            <p className="text-3xl font-black text-indigo-600">{payments.reduce((a,b) => a+b.amount,0).toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
          <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Outstanding Debt</p>
          <div className="flex items-baseline gap-2">
             <span className="text-sm font-bold text-slate-400">KSh</span>
             <p className="text-3xl font-black text-rose-500">{defaulters.reduce((a,b) => a+b.balance,0).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <button onClick={() => setShowPayModal(true)} className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:scale-[1.02] transition-all">
            <Receipt className="w-5 h-5" /> Receive Payment
          </button>
          <button onClick={() => setShowStructureModal(true)} className="flex items-center justify-center gap-2 w-full py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-900 transition-all">
            <Settings className="w-5 h-5" /> Set Fee Structure
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 bg-slate-50/50 border-b flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex p-1 bg-white border border-slate-200 rounded-2xl">
            {['transactions', 'defaulters', 'structures'].map((v: any) => (
              <button 
                key={v}
                onClick={() => setView(v)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === v ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-indigo-600'}`}
              >
                {v}
              </button>
            ))}
          </div>
          <button 
            onClick={() => exportToCSV(view === 'transactions' ? payments : defaulters, `elimusmart_${view}`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          {view === 'transactions' && (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black tracking-widest border-b">
                  <th className="px-8 py-5">Learner</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5">Mode</th>
                  <th className="px-8 py-5 text-right">Amount (KSh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.sort((a,b) => b.date.localeCompare(a.date)).map(p => {
                  const s = students.find(std => std.id === p.studentId);
                  return (
                    <tr key={p.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-800">{s?.name || 'Unknown'}</div>
                        <div className="text-[10px] font-medium text-slate-400">T{p.term} - {p.year}</div>
                      </td>
                      <td className="px-8 py-5 text-slate-500 text-sm font-medium">{new Date(p.date).toLocaleDateString('en-KE')}</td>
                      <td className="px-8 py-5"><span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase tracking-widest">{p.mode}</span></td>
                      <td className="px-8 py-5 text-right font-black text-indigo-600">{p.amount.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {view === 'defaulters' && (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black tracking-widest border-b">
                  <th className="px-8 py-5">Learner</th>
                  <th className="px-8 py-5">Grade</th>
                  <th className="px-8 py-5 text-right">Balance (KSh)</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {defaulters.map(s => (
                  <tr key={s.id} className="hover:bg-rose-50/30 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-800">{s.name}</td>
                    <td className="px-8 py-5 text-slate-500 font-medium">{s.grade}</td>
                    <td className="px-8 py-5 text-right font-black text-rose-500">{s.balance.toLocaleString()}</td>
                    <td className="px-8 py-5 text-right">
                       <button className="px-4 py-1.5 bg-rose-100 text-rose-600 text-[10px] font-black uppercase rounded-lg hover:bg-rose-200 transition-all">Sms Alert</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {view === 'structures' && (
             <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black tracking-widest border-b">
                  <th className="px-8 py-5">Grade</th>
                  <th className="px-8 py-5">Term</th>
                  <th className="px-8 py-5">Items</th>
                  <th className="px-8 py-5 text-right">Total (KSh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {structures.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-5 font-bold text-slate-800">{s.grade}</td>
                    <td className="px-8 py-5 text-slate-500 font-medium">Term {s.term} ({s.year})</td>
                    <td className="px-8 py-5 text-[10px] text-slate-400 font-medium italic">
                      {s.items.map(i => i.name).join(', ')}
                    </td>
                    <td className="px-8 py-5 text-right font-black text-slate-800">
                      {s.items.reduce((acc, i) => acc + i.amount, 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showPayModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 bg-slate-50/50 border-b flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Record Payment</h3>
              <button onClick={() => setShowPayModal(false)} className="p-2 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="p-10 space-y-6">
              <div className="space-y-4">
                <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-semibold" value={payForm.studentId} onChange={e => setPayForm({...payForm, studentId: e.target.value})} required>
                  <option value="">-- Select Learner --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.admissionNo} - {s.name}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-4">
                  <input type="number" placeholder="Amount" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black" value={payForm.amount || ''} onChange={e => setPayForm({...payForm, amount: parseInt(e.target.value)})} required />
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" value={payForm.mode} onChange={e => setPayForm({...payForm, mode: e.target.value as PaymentMode})}>
                    {Object.values(PaymentMode).map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <input type="date" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl" value={payForm.date} onChange={e => setPayForm({...payForm, date: e.target.value})} required />
              </div>
              <button type="submit" className="w-full py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">POST TRANSACTION</button>
            </form>
          </div>
        </div>
      )}

      {showStructureModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 bg-slate-50/50 border-b flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Fee Structure Setup</h3>
              <button onClick={() => setShowStructureModal(false)} className="p-2 rounded-xl transition-all"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleStructureSubmit} className="p-10 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <select className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={structForm.grade} onChange={e => setStructForm({...structForm, grade: e.target.value})}>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <select className="w-full px-5 py-4 bg-slate-50 border rounded-2xl" value={structForm.term} onChange={e => setStructForm({...structForm, term: parseInt(e.target.value)})}>
                  {[1,2,3].map(t => <option key={t} value={t}>Term {t}</option>)}
                </select>
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fee Items</p>
                {structForm.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input className="flex-1 px-4 py-3 bg-slate-50 border rounded-xl" placeholder="Item Name (e.g. Activity)" value={item.name} onChange={e => {
                      const newItems = [...structForm.items];
                      newItems[idx].name = e.target.value;
                      setStructForm({...structForm, items: newItems});
                    }} />
                    <input type="number" className="w-32 px-4 py-3 bg-slate-50 border rounded-xl font-bold" placeholder="Amount" value={item.amount || ''} onChange={e => {
                      const newItems = [...structForm.items];
                      newItems[idx].amount = parseInt(e.target.value);
                      setStructForm({...structForm, items: newItems});
                    }} />
                    <button type="button" onClick={() => removeStructItem(idx)} className="p-3 text-rose-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
                <button type="button" onClick={addStructItem} className="text-xs font-black text-indigo-600 flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Add Row</button>
              </div>
              <button type="submit" className="w-full py-5 bg-slate-800 text-white font-black rounded-2xl shadow-xl active:scale-95 transition-all">SAVE FEE STRUCTURE</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModule;
