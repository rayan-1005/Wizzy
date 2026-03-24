import { useEffect, useState } from 'react';
import { listGoals, createGoal, updateGoal, deleteGoal } from '../api';
import { Goal } from '../types';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Btn from '../components/Btn';
import ProgressBar from '../components/ProgressBar';
import { Plus, X, Trash2, ArrowUpCircle } from 'lucide-react';

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [fundGoalId, setFundGoalId] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'emergency_fund', targetAmount: '', targetDate: '' });

  const load = async () => {
    const { data } = await listGoals();
    setGoals(data.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try {
      await createGoal({ ...form, targetAmount: Number(form.targetAmount), targetDate: new Date(form.targetDate).toISOString() });
      setForm({ title: '', category: 'emergency_fund', targetAmount: '', targetDate: '' });
      setShowForm(false);
      await load();
    } finally { setSubmitting(false); }
  };

  const handleFund = async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !fundAmount) return;
    setSubmitting(true);
    try {
      await updateGoal(goalId, { currentAmount: goal.currentAmount + Number(fundAmount) });
      setFundGoalId(null); setFundAmount('');
      await load();
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this goal?')) return;
    await deleteGoal(id);
    setGoals(p => p.filter(g => g.id !== id));
  };

  return (
    <div className="animate-slide-up">
      <PageHeader title="Savings Goals" subtitle="Build your financial future"
        action={<Btn onClick={() => setShowForm(true)}><Plus size={14} /> New Goal</Btn>} />

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-black tracking-tighter text-xl">Create Goal</h2>
              <button onClick={() => setShowForm(false)} className="text-muted hover:text-white"><X size={16} /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { key: 'title', label: 'Goal Title', type: 'text', ph: 'Emergency Fund' },
                { key: 'targetAmount', label: 'Target Amount (₹)', type: 'number', ph: '100000' },
                { key: 'targetDate', label: 'Target Date', type: 'date', ph: '' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs uppercase tracking-wide text-muted font-medium block mb-1.5">{f.label}</label>
                  <input type={f.type} value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} required
                    placeholder={f.ph}
                    className="w-full bg-black border border-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-dim" />
                </div>
              ))}
              <div>
                <label className="text-xs uppercase tracking-wide text-muted font-medium block mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-black border border-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-dim">
                  {['emergency_fund','vacation','down_payment','education','other'].map(c => (
                    <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Btn type="submit" loading={submitting} className="flex-1">Create Goal</Btn>
                <Btn variant="ghost" type="button" onClick={() => setShowForm(false)}>Cancel</Btn>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Fund Modal */}
      {fundGoalId && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-black tracking-tighter text-xl">Add Funds</h2>
              <button onClick={() => setFundGoalId(null)} className="text-muted hover:text-white"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-muted font-medium block mb-1.5">Amount to Add (₹)</label>
                <input type="number" value={fundAmount} onChange={e => setFundAmount(e.target.value)} autoFocus
                  className="w-full bg-black border border-border rounded px-3 py-2.5 text-white text-sm focus:outline-none focus:border-dim"
                  placeholder="5000" />
              </div>
              <div className="flex gap-2">
                <Btn onClick={() => handleFund(fundGoalId)} loading={submitting} className="flex-1">
                  <ArrowUpCircle size={14} /> Add Funds
                </Btn>
                <Btn variant="ghost" onClick={() => setFundGoalId(null)}>Cancel</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Goals Grid */}
      {loading ? (
        <p className="text-muted text-sm animate-pulse">Loading...</p>
      ) : goals.length === 0 ? (
        <Card className="text-center py-16">
          <p className="text-muted mb-4">No goals yet. Create your first savings goal!</p>
          <Btn onClick={() => setShowForm(true)} className="mx-auto"><Plus size={14} /> Create Goal</Btn>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map(g => (
            <Card key={g.id}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-white font-black tracking-tighter text-lg">{g.title}</h3>
                  <span className="text-xs uppercase tracking-wide text-muted">{g.category.replace(/_/g,' ')}</span>
                </div>
                <button onClick={() => handleDelete(g.id)} className="text-muted hover:text-orange transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted">{fmt(g.currentAmount)}</span>
                  <span className="text-white font-semibold">{fmt(g.targetAmount)}</span>
                </div>
                <ProgressBar value={g.progressPercent} accent={g.progressPercent === 100} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-orange font-black tracking-tighter text-xl">{g.progressPercent}%</p>
                  <p className="text-xs text-muted">
                    {g.completedAt ? '✓ Completed' : `${g.daysRemaining} days left`}
                  </p>
                </div>
                {!g.completedAt && (
                  <Btn variant="ghost" onClick={() => setFundGoalId(g.id)}>
                    <ArrowUpCircle size={14} /> Add Funds
                  </Btn>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
