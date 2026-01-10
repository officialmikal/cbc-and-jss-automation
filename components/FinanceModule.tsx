
import React, { useState } from 'react';
import { Student, Payment, PaymentMode, FeeStructure } from '../types';
import { GRADES } from '../constants';
import { Wallet, Plus, Calendar, Filter, Receipt } from 'lucide-react';

interface FinanceModuleProps {
  students: Student[];
  payments: Payment[];
  onAddPayment: (payment: Payment) => void;
}

const FinanceModule: React.FC<FinanceModuleProps> = ({ students, payments, onAddPayment }) => {
  const [showPayModal, setShowPayModal] = useState(false);
  const [payForm, setPayForm] = useState({
    studentId: '',
    amount: 0,
    mode: PaymentMode.CASH,
    term: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPayment({
      id: crypto.randomUUID(),
      ...payForm,
      date: new Date().toISOString(),
      year: 2024
    });
    setShowPayModal(false);
    alert("Payment recorded!");
  };

  const getStudentBalance = (sId: string) => {
    const paid = payments.filter(p => p.studentId === sId).reduce((a, b) => a + b.amount, 0);
    return 15000 - paid; // Mock standard fee
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 uppercase font-bold">Total Collected</p>
            <p className="text-xl font-bold text-indigo-600">KSh {payments.reduce((a,b) => a + b.amount, 0).toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 uppercase font-bold">Today's Total</p>
            <p className="text-xl font-bold text-emerald-600">KSh 45,200</p>
          </div>
        </div>
        <button 
          onClick={() => setShowPayModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
        >
          <Receipt className="w-5 h-5" /> Receive Payment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><Wallet className="w-5 h-5 text-indigo-500" /> Recent Transactions</h3>
          <div className="flex gap-2">
             <button className="p-2 border rounded-lg hover:bg-slate-50"><Filter className="w-4 h-4" /></button>
             <button className="p-2 border rounded-lg hover:bg-slate-50"><Calendar className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase font-bold">
                <th className="px-6 py-4">Learner</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Mode</th>
                <th className="px-6 py-4 text-right">Amount (KSh)</th>
                <th className="px-6 py-4 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.sort((a,b) => b.date.localeCompare(a.date)).map(p => {
                const s = students.find(std => std.id === p.studentId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium">{s?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.mode === PaymentMode.MPESA ? 'bg-emerald-100 text-emerald-700' :
                        p.mode === PaymentMode.BANK ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {p.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-indigo-600">{p.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right text-rose-500 font-medium">{getStudentBalance(p.studentId).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showPayModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Record Payment</h3>
              <button onClick={() => setShowPayModal(false)} className="text-slate-400 hover:text-slate-600">X</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select Student</label>
                <select 
                  className="w-full p-3 bg-slate-50 border rounded-xl"
                  value={payForm.studentId}
                  onChange={e => setPayForm({...payForm, studentId: e.target.value})}
                  required
                >
                  <option value="">-- Choose Learner --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.admissionNo} - {s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount (KSh)</label>
                  <input 
                    type="number" 
                    className="w-full p-3 bg-slate-50 border rounded-xl"
                    placeholder="0.00"
                    value={payForm.amount || ''}
                    onChange={e => setPayForm({...payForm, amount: parseInt(e.target.value)})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Payment Mode</label>
                  <select 
                    className="w-full p-3 bg-slate-50 border rounded-xl"
                    value={payForm.mode}
                    onChange={e => setPayForm({...payForm, mode: e.target.value as PaymentMode})}
                  >
                    <option value={PaymentMode.MPESA}>M-Pesa</option>
                    <option value={PaymentMode.CASH}>Cash</option>
                    <option value={PaymentMode.BANK}>Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                 <button type="button" onClick={() => setShowPayModal(false)} className="flex-1 p-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
                 <button type="submit" className="flex-1 p-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700">Submit Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModule;
