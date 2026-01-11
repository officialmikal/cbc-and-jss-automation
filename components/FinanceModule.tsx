
import React, { useState } from 'react';
import { Student, Payment, PaymentMode, FeeStructure } from '../types';
import { Wallet, Plus, Calendar, Filter, Receipt, AlertCircle, TrendingUp } from 'lucide-react';

interface FinanceModuleProps {
  students: Student[];
  payments: Payment[];
  onAddPayment: (payment: Payment) => void;
}

const FinanceModule: React.FC<FinanceModuleProps> = ({ students, payments, onAddPayment }) => {
  const [view, setView] = useState<'transactions' | 'defaulters'>('transactions');
  const [showPayModal, setShowPayModal] = useState(false);
  const [payForm, setPayForm] = useState({
    studentId: '',
    amount: 0,
    mode: PaymentMode.CASH,
    term: 1
  });

  const getStudentBalance = (sId: string) => {
    const paid = payments.filter(p => p.studentId === sId).reduce((a, b) => a + b.amount, 0);
    return 15000 - paid; // Example standard fee
  };

  const defaulters = students.map(s => ({
    ...s,
    balance: getStudentBalance(s.id)
  })).filter(s => s.balance > 0).sort((a,b) => b.balance - a.balance);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPayment({ id: crypto.randomUUID(), ...payForm, date: new Date().toISOString(), year: 2024 });
    setShowPayModal(false);
    alert("Payment recorded!");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 uppercase font-bold mb-1">Total Collections</p>
          <p className="text-2xl font-black text-indigo-600">KSh {payments.reduce((a,b) => a+b.amount,0).toLocaleString()}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-xs text-slate-400 uppercase font-bold mb-1">Outstanding Balance</p>
          <p className="text-2xl font-black text-rose-500">KSh {defaulters.reduce((a,b) => a+b.balance,0).toLocaleString()}</p>
        </div>
        <div className="flex items-center justify-end">
          <button 
            onClick={() => setShowPayModal(true)}
            className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-xl shadow-emerald-600/20 hover:scale-105 transition-transform"
          >
            <Receipt className="w-5 h-5" /> Receive Payment
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 bg-slate-50/50 border-b flex items-center justify-between">
          <div className="flex p-1 bg-white border rounded-xl">
            <button 
              onClick={() => setView('transactions')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'transactions' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Transactions
            </button>
            <button 
              onClick={() => setView('defaulters')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${view === 'defaulters' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              Fee Defaulters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {view === 'transactions' ? (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-500 uppercase font-black tracking-widest border-b">
                  <th className="px-6 py-4">Learner</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Mode</th>
                  <th className="px-6 py-4 text-right">Amount (KSh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.sort((a,b) => b.date.localeCompare(a.date)).map(p => {
                  const s = students.find(std => std.id === p.studentId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-700">{s?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-slate-500">{new Date(p.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4"><span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded">{p.mode}</span></td>
                      <td className="px-6 py-4 text-right font-black text-indigo-600">{p.amount.toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[10px] text-slate-500 uppercase font-black tracking-widest border-b">
                  <th className="px-6 py-4">Learner</th>
                  <th className="px-6 py-4">Grade</th>
                  <th className="px-6 py-4 text-right">Outstanding (KSh)</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {defaulters.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-700">{s.name}</td>
                    <td className="px-6 py-4 text-slate-500">{s.grade}</td>
                    <td className="px-6 py-4 text-right font-black text-rose-500">{s.balance.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs text-indigo-600 font-bold hover:underline">Sms Parent</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-8 py-6 bg-slate-50 border-b flex justify-between items-center font-bold">Record Payment <button onClick={() => setShowPayModal(false)}>X</button></div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <select className="w-full p-3 bg-slate-50 border rounded-xl" value={payForm.studentId} onChange={e => setPayForm({...payForm, studentId: e.target.value})} required>
                <option value="">-- Select Learner --</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.admissionNo} - {s.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" className="w-full p-3 bg-slate-50 border rounded-xl" placeholder="Amount" value={payForm.amount || ''} onChange={e => setPayForm({...payForm, amount: parseInt(e.target.value)})} required />
                <select className="w-full p-3 bg-slate-50 border rounded-xl" value={payForm.mode} onChange={e => setPayForm({...payForm, mode: e.target.value as PaymentMode})}>
                  <option value={PaymentMode.MPESA}>M-Pesa</option>
                  <option value={PaymentMode.CASH}>Cash</option>
                  <option value={PaymentMode.BANK}>Bank</option>
                </select>
              </div>
              <button type="submit" className="w-full p-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl">Submit Transaction</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModule;
