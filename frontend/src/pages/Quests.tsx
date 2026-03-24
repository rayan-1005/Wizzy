import { useEffect, useState } from "react";
import { getTodayQuests, completeQuest } from "../api";
import { Quest } from "../types";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Btn from "../components/Btn";
import ProgressBar from "../components/ProgressBar";
import { Zap, Check, Trophy, ShieldAlert, Target } from "lucide-react";

export default function Quests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    getTodayQuests()
      .then((r) => setQuests(r.data.data))
      .catch(() => console.error("Quest system offline."))
      .finally(() => setLoading(false));
  }, []);

  const handleComplete = async (id: string) => {
    setCompleting(id);
    try {
      await completeQuest(id);
      setQuests((p) =>
        p.map((q) =>
          q.id === id
            ? { ...q, completed: true, completedAt: new Date().toISOString() }
            : q,
        ),
      );
    } finally {
      setCompleting(null);
    }
  };

  const done = quests.filter((q) => q.completed).length;
  const progressPercent = (done / (quests.length || 1)) * 100;

  // Quest Icon Logic based on Type
  const getIcon = (type: string) => {
    if (type.includes("SAVINGS"))
      return <Target size={16} className="text-cyan-400" />;
    if (type.includes("BUDGET"))
      return <ShieldAlert size={16} className="text-red-400" />;
    return <Zap size={16} className="text-[#ff5722]" />;
  };

  return (
    <div className="animate-slide-up max-w-4xl mx-auto pb-10">
      <PageHeader
        title="Active Quests"
        subtitle="Execute daily objectives to optimize your financial XP."
      />

      {/* --- HUD SUMMARY --- */}
      <div className="relative overflow-hidden mb-10 bg-[#0f0f0f] border border-white/5 rounded-2xl p-6 shadow-2xl">
        {/* Decorative Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-full bg-[#ff5722]/5 blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="flex justify-between items-end mb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                  Synchronization Level
                </span>
                <h3 className="text-2xl font-black tracking-tighter text-white">
                  {progressPercent === 100
                    ? "SYSTEM STABILIZED"
                    : "UPLINK IN PROGRESS"}
                </h3>
              </div>
              <span className="text-sm font-black text-[#ff5722]">
                {done} / {quests.length}
              </span>
            </div>
            <ProgressBar
              value={done}
              max={quests.length || 1}
              accent
              className="h-2"
            />
          </div>

          {progressPercent >= 70 && (
            <div className="flex items-center gap-3 bg-[#ff5722]/10 border border-[#ff5722]/20 px-4 py-2 rounded-xl animate-pulse">
              <Trophy size={18} className="text-[#ff5722]" />
              <span className="text-[10px] font-black text-[#ff5722] uppercase tracking-widest">
                Streak Bonus Active
              </span>
            </div>
          )}
        </div>
      </div>

      {/* --- QUEST LIST --- */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-white/5 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {quests.map((q) => (
            <Card
              key={q.id}
              className={`group relative transition-all duration-300 ${q.completed ? "border-transparent bg-neutral-900/30" : "hover:border-[#ff5722]/30 bg-[#0a0a0a]"}`}
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex gap-4">
                  {/* Quest Icon Slot */}
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center border ${q.completed ? "border-white/5 bg-black/40" : "border-[#ff5722]/20 bg-[#ff5722]/5 group-hover:bg-[#ff5722]/10 transition-colors"}`}
                  >
                    {getIcon(q.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        {q.type.replace(/_/g, " ")}
                      </span>
                      {!q.completed && (
                        <span className="text-[9px] px-2 py-0.5 rounded bg-white/5 text-neutral-400 font-bold border border-white/5 uppercase">
                          Exp:{" "}
                          {new Date(q.expiresAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      )}
                    </div>
                    <h4
                      className={`text-base font-bold tracking-tight leading-tight ${q.completed ? "text-neutral-500 line-through" : "text-white"}`}
                    >
                      {q.description}
                    </h4>
                    {q.completed && (
                      <p className="text-[10px] font-black text-[#ff5722] uppercase tracking-tighter mt-1">
                        + {q.xpReward} XP Earned at{" "}
                        {new Date(q.completedAt!).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Interaction Slot */}
                <div className="flex-shrink-0">
                  {!q.completed ? (
                    <Btn
                      onClick={() => handleComplete(q.id)}
                      loading={completing === q.id}
                      className="bg-white/5 border-white/10 hover:bg-[#ff5722] hover:text-white group-hover:border-[#ff5722]/50"
                    >
                      <Check size={14} className="mr-2" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Verify
                      </span>
                    </Btn>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <Check size={18} className="text-green-500" />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {quests.length === 0 && (
            <div className="text-center py-20 bg-black/20 border border-dashed border-white/5 rounded-3xl">
              <Zap size={32} className="mx-auto text-neutral-800 mb-4" />
              <p className="text-neutral-600 font-black uppercase text-xs tracking-[0.3em]">
                No Quests Detected in Sector
              </p>
            </div>
          )}
        </div>
      )}

      {/* System Footer */}
      <footer className="mt-12 pt-8 border-t border-white/5">
        <div className="flex items-center gap-4 text-neutral-600">
          <div className="p-2 bg-neutral-900 rounded-lg">
            <Zap size={14} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">
            Note: Global quest reset occurs at 00:00. <br />
            Maintain a 70%+ completion rate to trigger the{" "}
            <span className="text-[#ff5722]">Streak Multiplier</span>.
          </p>
        </div>
      </footer>
    </div>
  );
}
