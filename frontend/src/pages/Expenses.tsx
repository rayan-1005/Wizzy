import { useEffect, useState } from 'react';
import { listExpenses, createExpense, deleteExpense } from '../api';
import { Transaction } from '../types';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Btn from '../components/Btn';
import { Trash2, Plus, X } from 'lucide-react';

const CATS = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'] as const;
const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function Expenses() {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ amount: '', category: 'Food', description: '', date: new Date().toISOString().slice(0, 10) });

  const load = async () => {
    try {
      const { data } = await listExpenses({ limit: 50 });
      setExpenses(data.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await createExpense({ ...form, amount: Number(form.amount), date: new Date(form.date).toISOString() });
      setForm({ amount: '', category: 'Food', description: '', date: new Date().toISOString().slice(0, 10) });
      setShowForm(false);
      await load();
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return;
    await deleteExpense(id);
    setExpenses(p => p.filter(e => e.id !== id));
  };

  return (
    <div className="animate-slide-up">
      <PageHeader title="Expenses" subtitle="Track every rupee"
        action={<Btn onClick={() => setShowForm(true)}><Plus size={14} /> Log Expense</Btn>} />

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-black tracking-tighter text-xl">Log Expense</h2>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-white"><X size={16} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-muted font-medium block mb-1.5">Amount (₹)</label>
                <input type="number" value={form.amount} onChange={e => setForm(p => ({...p, amount: e.target.value}))} required
                  className="w-full bg-black border border-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-dim" placeholder="500" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-muted font-medium block mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}
                  className="w-full bg-black border border-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-dim">
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-muted font-medium block mb-1.5">Description</label>
                <input type="text" value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
                  className="w-full bg-black border border-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-dim" placeholder="e.g. Lunch at cafe" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-muted font-medium block mb-1.5">Date</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({...p, date: e.target.value}))}
                  className="w-full bg-black border border-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-dim" />
              </div>
              <div className="flex gap-2">
                <Btn type="submit" loading={submitting} className="flex-1">Log Transaction</Btn>
                <Btn variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Btn>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Expenses List */}
      {loading ? (
        <p className="text-muted text-sm animate-pulse">Loading...</p>
      ) : expenses.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-muted">No expenses yet.</p>
          <Btn className="mt-4 mx-auto" onClick={() => setShowForm(true)}><Plus size={14} /> Log your first expense</Btn>
        </Card>
      ) : (
        <div className="space-y-2">
          {expenses.map(e => (
            <div key={e.id} className="flex items-center justify-between bg-charcoal border border-border rounded px-4 py-3 hover:bg-hover transition-all group">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-white text-sm font-medium">{e.description || e.category}</p>
                  <p className="text-muted text-xs">{e.category} · {new Date(e.date).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-black tracking-tighter">{fmt(e.amount)}</span>
                <button onClick={() => handleDelete(e.id)}
                  className="text-muted hover:text-orange opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
