import { useEffect, useState } from 'react';
import { getDashboard, getCategories, getTrends, getCoaching } from '../api';
import { DashboardData, CategoryBreakdown, CoachingTip } from '../types';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN');

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-charcoal border border-border rounded px-3 py-2">
        <p className="text-xs text-muted mb-0.5">{label}</p>
        <p className="text-white font-black tracking-tighter">{fmt(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export default function Insights() {
  const [dash, setDash] = useState<DashboardData | null>(null);
  const [cats, setCats] = useState<CategoryBreakdown[]>([]);
  const [trends, setTrends] = useState<{ week: string; total: number; change: number }[]>([]);
  const [tips, setTips] = useState<CoachingTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboard(), getCategories(), getTrends(), getCoaching()])
      .then(([d, c, t, tp]) => {
        setDash(d.data.data);
        setCats(c.data.data);
        setTrends(t.data.data);
        setTips(tp.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted text-sm animate-pulse">Loading insights...</p>;

  return (
    <div className="animate-slide-up">
      <PageHeader title="Insights" subtitle="Understand your spending patterns" />

      <div className="grid grid-cols-12 gap-4">
        {/* Summary Stats */}
        {[
          { label: 'Total Expenses', value: fmt(dash?.totalExpenses ?? 0) },
          { label: 'Free Cash',      value: fmt(dash?.freeCash ?? 0) },
          { label: 'Savings Rate',   value: `${dash?.savingsRate ?? 0}%` },
          { label: 'Top Category',   value: dash?.topCategory ?? '—' },
        ].map(s => (
          <div key={s.label} className="col-span-3 bg-charcoal border border-border rounded p-4">
            <p className="text-xs uppercase tracking-wide text-muted font-medium mb-1">{s.label}</p>
            <p className="text-2xl font-black tracking-tighter text-white">{s.value}</p>
          </div>
        ))}

        {/* Spending by Week (Bar Chart) */}
        <Card className="col-span-7">
          <p className="text-xs uppercase tracking-wide text-muted font-medium mb-4">Weekly Spending Trend</p>
          {trends.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trends} barCategoryGap="30%">
                <XAxis dataKey="week" tick={{ fill: '#999', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#999', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1a1a1a' }} />
                <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                  {trends.map((_, i) => (
                    <Cell key={i} fill={i === trends.length - 1 ? '#FF4D00' : '#333333'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted text-sm text-center py-8">Not enough data yet. Log more expenses!</p>
          )}
        </Card>

        {/* Category Breakdown */}
        <Card className="col-span-5">
          <p className="text-xs uppercase tracking-wide text-muted font-medium mb-4">By Category</p>
          {cats.length > 0 ? (
            <div className="space-y-3">
              {cats.map(c => (
                <div key={c.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted">{c.category}</span>
                    <span className="text-white font-semibold">{fmt(c.total)} <span className="text-muted font-normal">({c.percentage}%)</span></span>
                  </div>
                  <ProgressBar value={c.percentage} accent={c.percentage > 40} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm text-center py-8">No data yet.</p>
          )}
        </Card>

        {/* Coaching Tips */}
        <Card className="col-span-12">
          <p className="text-xs uppercase tracking-wide text-muted font-medium mb-4">Personalized Coaching</p>
          {tips.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {tips.map(tip => (
                <div key={tip.id} className="border border-border rounded p-3">
                  <span className="text-xs uppercase tracking-wide text-orange font-medium">{tip.type}</span>
                  <p className="text-white text-sm mt-1">{tip.message}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm">Keep logging expenses to unlock personalized coaching tips!</p>
          )}
        </Card>
      </div>
    </div>
  );
}
