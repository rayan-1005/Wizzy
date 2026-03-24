import { useEffect, useState } from 'react';
import { getActiveBosses, attackBoss } from '../api';
import { BossBattle } from '../types';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Btn from '../components/Btn';
import { Swords, Shield } from 'lucide-react';

export default function BossBattlePage() {
  const [bosses, setBosses] = useState<BossBattle[]>([]);
  const [loading, setLoading] = useState(true);
  const [attacking, setAttacking] = useState<string | null>(null);

  useEffect(() => {
    getActiveBosses().then(r => setBosses(r.data.data)).finally(() => setLoading(false));
  }, []);

  const handleAttack = async (id: string) => {
    setAttacking(id);
    try {
      const { data } = await attackBoss(id, 10);
      setBosses(p => p.map(b => b.id === id ? data.data : b));
    } finally { setAttacking(null); }
  };

  const hpColor = (hp: number) => hp > 60 ? 'bg-orange' : hp > 30 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="animate-slide-up">
      <PageHeader title="Boss Battle" subtitle="Defeat spending phantoms by logging hidden expenses" />

      {loading ? (
        <p className="text-muted text-sm animate-pulse">Loading...</p>
      ) : bosses.length === 0 ? (
        <Card className="text-center py-16">
          <Shield size={40} className="text-muted mx-auto mb-4" />
          <p className="text-white font-black text-xl tracking-tighter mb-2">No Active Bosses</p>
          <p className="text-muted text-sm max-w-xs mx-auto">
            Bosses appear when your spending in a category is unusually high. Keep tracking to stay aware!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {bosses.map(boss => (
            <Card key={boss.id}>
              {/* Boss Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-3xl">👻</span>
                    <h2 className="text-2xl font-black tracking-tighter text-white">{boss.name}</h2>
                  </div>
                  <p className="text-muted text-sm">{boss.description}</p>
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded border ${
                  boss.status === 'DEFEATED' ? 'border-dim text-muted' :
                  boss.status === 'WEAKENING' ? 'border-yellow-600 text-yellow-500' :
                  'border-orange text-orange animate-pulse-orange'
                }`}>{boss.status}</span>
              </div>

              {/* HP Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase tracking-wide text-muted font-medium">Boss Health</span>
                  <span className="text-white font-black text-lg tracking-tighter">{boss.healthPercent}%</span>
                </div>
                <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${hpColor(boss.healthPercent)}`}
                    style={{ width: `${boss.healthPercent}%` }}
                  />
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: 'Category', value: boss.category ?? 'General' },
                  { label: 'Days Left', value: `${Math.max(0, Math.ceil((new Date(boss.expiresAt).getTime() - Date.now()) / 86400000))}d` },
                  { label: 'Defeat Reward', value: '+100 XP' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-black border border-border rounded p-3">
                    <p className="text-xs uppercase tracking-wide text-muted mb-1">{label}</p>
                    <p className="text-white font-black tracking-tighter">{value}</p>
                  </div>
                ))}
              </div>

              {/* How to defeat */}
              <div className="border border-border rounded p-3 mb-4">
                <p className="text-xs uppercase tracking-wide text-muted font-medium mb-2">How to Defeat</p>
                <ul className="text-sm text-muted space-y-1">
                  <li>→ Log every expense in the {boss.category ?? 'affected'} category</li>
                  <li>→ Reduce spending by 10% each week</li>
                  <li>→ Complete related daily quests</li>
                </ul>
              </div>

              {boss.status !== 'DEFEATED' && (
                <Btn onClick={() => handleAttack(boss.id)} loading={attacking === boss.id} className="w-full justify-center">
                  <Swords size={14} /> Attack (-10 HP)
                </Btn>
              )}
              {boss.status === 'DEFEATED' && (
                <p className="text-center text-muted text-sm">✓ Defeated on {new Date(boss.expiresAt).toLocaleDateString()}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
