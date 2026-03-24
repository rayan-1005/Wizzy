import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDashboard,
  getTodayQuests,
  getActiveBosses,
  getProfile,
} from "../api";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import Card from "../components/Card";
import PageHeader from "../components/PageHeader";
import { DashboardData, Quest, BossBattle, Progression } from "../types";
import {
  Zap,
  Swords,
  Target,
  TrendingUp,
  ShieldCheck,
  Flame,
  Trophy,
} from "lucide-react";

const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function Dashboard() {
  const [dash, setDash] = useState<DashboardData | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [bosses, setBosses] = useState<BossBattle[]>([]);
  const [prog, setProg] = useState<Progression | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [d, q, b, p] = await Promise.all([
          getDashboard(),
          getTodayQuests(),
          getActiveBosses(),
          getProfile(),
        ]);
        setDash(d.data.data);
        setQuests(q.data.data);
        setBosses(b.data.data);
        setProg(p.data.data.progression);
      } catch (err) {
        console.error("System Sync Failed:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 border-2 border-[#ff5722]/10 rounded-full" />
          <div className="absolute inset-0 border-2 border-transparent border-t-[#ff5722] rounded-full animate-spin" />
          <div
            className="absolute inset-2 border border-transparent border-t-[#ff5722]/40 rounded-full animate-spin"
            style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
          />
        </div>
        <span className="text-[#71717a] text-[9px] font-black uppercase tracking-[0.4em] animate-pulse">
          Synchronizing Data Streams
        </span>
      </div>
    );

  const completedQuests = quests.filter((q) => q.completed).length;
  const activeBoss = bosses.find((b) => b.status !== "DEFEATED");
  const xpPct = prog
    ? Math.round((prog.xpInCurrentLevel / (prog.xpNeededForNext ?? 100)) * 100)
    : 0;

  return (
    <div className="animate-slide-up space-y-5 pb-16">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.4; filter: drop-shadow(0 0 3px #ff5722); }
          50% { opacity: 1; filter: drop-shadow(0 0 10px #ff5722); }
        }
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes flicker {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.8; }
          97% { opacity: 1; }
          98% { opacity: 0.6; }
        }
        @keyframes boss-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,87,34,0); }
          50% { box-shadow: 0 0 0 6px rgba(255,87,34,0.08); }
        }
        @keyframes number-flicker {
          0%, 90%, 100% { opacity: 1; }
          92% { opacity: 0.7; }
        }
        .animate-wizzy-glow { animation: pulse-glow 2s infinite; }
        .animate-boss-pulse { animation: boss-pulse 3s infinite; }
        .animate-flicker { animation: flicker 8s infinite; }
        .number-flicker { animation: number-flicker 6s infinite; }
        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .xp-bar-inner {
          background: linear-gradient(90deg, #ff5722, #ff8a50);
          box-shadow: 0 0 12px rgba(255,87,34,0.4);
          transition: width 1s ease;
        }
      `}</style>

      <PageHeader
        title="Dashboard"
        subtitle={new Date()
          .toLocaleDateString("en-IN", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })
          .toUpperCase()}
      />

      {/* ── PLAYER IDENTITY BANNER ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0a0a0a]">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-64 h-32 bg-[#ff5722] opacity-[0.06] blur-[60px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-48 h-24 bg-orange-800 opacity-[0.05] blur-[50px] pointer-events-none" />
        <div className="noise-overlay absolute inset-0" />

        <div className="relative p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5">
          {/* Level badge */}
          <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border border-[#ff5722]/30 bg-[#ff5722]/5 flex flex-col items-center justify-center gap-0.5 animate-boss-pulse">
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#ff5722]/60">
              LVL
            </span>
            <span className="text-3xl sm:text-4xl font-black text-white number-flicker leading-none">
              {prog?.level ?? 1}
            </span>
          </div>

          {/* Title + XP */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck size={12} className="text-[#ff5722] flex-shrink-0" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#ff5722]">
                {prog?.title ?? "Budget Apprentice"}
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-white tracking-tighter mb-3 animate-flicker">
              OPERATOR PROFILE
            </p>

            {/* XP bar */}
            <div className="space-y-1.5">
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full xp-bar-inner rounded-full"
                  style={{ width: `${xpPct}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-mono font-bold text-neutral-600 uppercase tracking-widest">
                  XP to next rank
                </span>
                <span className="text-[9px] font-mono font-bold text-neutral-500">
                  {prog?.xpInCurrentLevel ?? 0}{" "}
                  <span className="text-white/20">/</span>{" "}
                  {prog?.xpNeededForNext ?? "—"}
                </span>
              </div>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="flex sm:flex-col gap-4 sm:gap-3 sm:border-l sm:border-white/8 sm:pl-5 sm:pr-1">
            <div className="text-center sm:text-right">
              <div className="flex items-center gap-1 justify-start sm:justify-end mb-0.5">
                <Flame size={10} className="text-orange-500" />
                <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600">
                  Streak
                </span>
              </div>
              <span className="text-lg font-black text-white">
                {prog?.streak ?? 0}
                <span className="text-[10px] text-neutral-600 ml-1">days</span>
              </span>
            </div>
            <div className="text-center sm:text-right">
              <div className="flex items-center gap-1 justify-start sm:justify-end mb-0.5">
                <Trophy size={10} className="text-[#ff5722]" />
                <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600">
                  Kills
                </span>
              </div>
              <span className="text-lg font-black text-white">
                {prog?.bossesDefeated ?? 0}
                <span className="text-[10px] text-neutral-600 ml-1">
                  bosses
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── FINANCIAL METRICS ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Income */}
        <div className="col-span-2 sm:col-span-1 lg:col-span-1 relative overflow-hidden rounded-xl border border-white/8 bg-[#0a0a0a] p-4 group hover:border-blue-500/30 transition-all">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-neutral-600 block mb-3">
            Monthly Income
          </span>
          <span className="text-2xl font-black text-white tracking-tighter block number-flicker">
            {fmt(dash?.totalIncome ?? 0)}
          </span>
          <span className="text-[8px] font-bold text-blue-500/70 uppercase tracking-wider mt-1 block">
            Confirmed Credits
          </span>
        </div>

        {/* Expenses */}
        <div
          className={`col-span-2 sm:col-span-1 lg:col-span-1 relative overflow-hidden rounded-xl border bg-[#0a0a0a] p-4 group transition-all ${(dash?.monthlyBudgetUsed ?? 0) > 80 ? "border-red-600/40 hover:border-red-500/60" : "border-white/8 hover:border-[#ff5722]/30"}`}
        >
          <div
            className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent to-transparent ${(dash?.monthlyBudgetUsed ?? 0) > 80 ? "via-red-500/80" : "via-[#ff5722]/60"}`}
          />
          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-neutral-600 block mb-3">
            Expenses
          </span>
          <span
            className={`text-2xl font-black tracking-tighter block number-flicker ${(dash?.monthlyBudgetUsed ?? 0) > 80 ? "text-red-400" : "text-white"}`}
          >
            {fmt(dash?.totalExpenses ?? 0)}
          </span>
          <div className="mt-2 space-y-1">
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${(dash?.monthlyBudgetUsed ?? 0) > 80 ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-[#ff5722] shadow-[0_0_8px_rgba(255,87,34,0.4)]"}`}
                style={{
                  width: `${Math.min(dash?.monthlyBudgetUsed ?? 0, 100)}%`,
                }}
              />
            </div>
            <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-wider">
              {dash?.monthlyBudgetUsed ?? 0}% allocated
            </span>
          </div>
        </div>

        {/* Free Cash */}
        <div className="col-span-1 relative overflow-hidden rounded-xl border border-white/8 bg-[#0a0a0a] p-4 group hover:border-emerald-500/30 transition-all">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-neutral-600 block mb-3">
            Free Cash
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 tracking-tighter block number-flicker">
            {fmt(dash?.freeCash ?? 0)}
          </span>
          <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-wider mt-1 block">
            Power Stat
          </span>
        </div>

        {/* Savings Rate */}
        <div className="col-span-1 relative overflow-hidden rounded-xl border border-white/8 bg-[#0a0a0a] p-4 group hover:border-[#ff5722]/30 transition-all">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#ff5722]/50 to-transparent" />
          <span className="text-[8px] font-black uppercase tracking-[0.25em] text-neutral-600 block mb-3">
            Savings Rate
          </span>
          <span className="text-xl sm:text-2xl font-black text-white tracking-tighter block number-flicker">
            {dash?.savingsRate ?? 0}%
          </span>
          <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-wider mt-1 block">
            Efficiency
          </span>
        </div>
      </div>

      {/* ── DAILY QUESTS ──────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0a0a0a] p-5 cursor-pointer group hover:border-[#ff5722]/20 transition-all"
        onClick={() => navigate("/quests")}
      >
        <div className="noise-overlay absolute inset-0" />
        {/* Header */}
        <div className="relative flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#ff5722]/10 border border-[#ff5722]/20 flex items-center justify-center">
              <Zap size={13} className="text-[#ff5722] animate-wizzy-glow" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white block">
                Daily Quests
              </span>
              <span className="text-[8px] font-bold text-neutral-600 uppercase tracking-wider">
                Mission Briefing
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ff5722] rounded-full transition-all duration-700"
                style={{
                  width: quests.length
                    ? `${(completedQuests / quests.length) * 100}%`
                    : "0%",
                }}
              />
            </div>
            <span className="text-[9px] font-black text-neutral-500 tabular-nums">
              {completedQuests}
              <span className="text-white/20">/</span>
              {quests.length}
            </span>
          </div>
        </div>

        {/* Quest cards */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quests.slice(0, 3).map((q, i) => (
            <div
              key={q.id}
              className={`relative overflow-hidden rounded-xl border p-4 transition-all ${
                q.completed
                  ? "bg-white/[0.02] border-white/5 opacity-50"
                  : "bg-[#ff5722]/[0.03] border-[#ff5722]/15 hover:border-[#ff5722]/30 hover:bg-[#ff5722]/[0.06]"
              }`}
            >
              {/* Quest number */}
              <span className="absolute top-3 right-3 text-[9px] font-black text-white/10 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1.5 mb-2.5">
                <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600 bg-white/5 px-1.5 py-0.5 rounded">
                  {q.type.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-sm font-semibold text-neutral-200 leading-snug mb-3 pr-4">
                {q.description}
              </p>
              <div className="flex items-center justify-between">
                {q.completed ? (
                  <span className="text-[8px] font-black text-[#ff5722] uppercase tracking-[0.2em] flex items-center gap-1">
                    <span>✓</span> Verified
                  </span>
                ) : (
                  <span className="text-[8px] font-bold text-neutral-700 uppercase">
                    Pending
                  </span>
                )}
                <span
                  className={`text-[10px] font-black tabular-nums ${q.completed ? "text-neutral-700" : "text-[#ff5722]"}`}
                >
                  +{q.xpReward} <span className="text-[8px]">XP</span>
                </span>
              </div>
            </div>
          ))}
          {quests.length === 0 && (
            <div className="col-span-full text-neutral-700 text-[9px] font-black text-center py-8 uppercase tracking-[0.4em]">
              No data packets available for today.
            </div>
          )}
        </div>
      </div>

      {/* ── BOSS BATTLE ───────────────────────────────────────────────── */}
      {activeBoss ? (
        <div
          className="relative overflow-hidden rounded-2xl border border-[#ff5722]/25 bg-[#0a0a0a] p-5 sm:p-6 cursor-pointer group hover:border-[#ff5722]/50 transition-all animate-boss-pulse"
          onClick={() => navigate("/boss")}
        >
          {/* Atmospheric glows */}
          <div className="absolute -top-8 -right-8 w-48 h-48 bg-[#ff5722] blur-[80px] opacity-[0.07] pointer-events-none group-hover:opacity-[0.12] transition-opacity" />
          <div className="absolute -bottom-12 left-1/3 w-40 h-40 bg-red-900 blur-[60px] opacity-[0.06] pointer-events-none" />
          <div className="noise-overlay absolute inset-0" />

          {/* Top strip */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#ff5722]/80 to-transparent" />

          <div className="relative">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#ff5722]/15 border border-[#ff5722]/30 flex items-center justify-center">
                  <Swords size={13} className="text-[#ff5722]" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-500">
                  Boss Battle Active
                </span>
              </div>
              <span className="text-[8px] font-black text-[#ff5722] uppercase tracking-[0.2em] bg-[#ff5722]/10 border border-[#ff5722]/20 px-2 py-1 rounded animate-pulse">
                ● {activeBoss.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
              <div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tighter text-white mb-1.5 uppercase leading-none">
                  👾 {activeBoss.name}
                </h3>
                <p className="text-xs text-neutral-500 max-w-sm font-medium leading-relaxed">
                  {activeBoss.description}
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className="text-3xl sm:text-4xl font-black text-[#ff5722] tracking-tighter number-flicker leading-none">
                  {activeBoss.healthPercent}%
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-neutral-600 block mt-1">
                  HP Remaining
                </span>
              </div>
            </div>

            {/* HP bar */}
            <div className="space-y-1.5">
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${activeBoss.healthPercent}%`,
                    background: `linear-gradient(90deg, #dc2626, #ff5722)`,
                    boxShadow: "0 0 12px rgba(255,87,34,0.5)",
                  }}
                />
              </div>
              <div className="flex justify-between text-[8px] font-mono font-bold text-neutral-700 uppercase tracking-wider">
                <span>Boss HP</span>
                <span>Tap to engage →</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-[#080808] p-6 flex items-center justify-center gap-3 opacity-30">
          <Swords size={18} className="text-neutral-700" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-neutral-700">
            Radar Clear — No Threat Detected
          </span>
        </div>
      )}

      {/* ── BOTTOM ROW: ANALYTICS + GOALS ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Performance analytics */}
        <div className="rounded-2xl border border-white/8 bg-[#0a0a0a] p-5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
              <TrendingUp size={12} className="text-neutral-500" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-500">
              Performance Analytics
            </span>
          </div>
          <div className="space-y-0 divide-y divide-white/5">
            {[
              {
                label: "Top Category",
                val: dash?.topCategory ?? "—",
                tag: "Primary Sector",
              },
              {
                label: "Quest Streak",
                val: `${prog?.streak ?? 0} days`,
                tag: "🔥 Active",
              },
              {
                label: "Bosses Defeated",
                val: String(prog?.bossesDefeated ?? 0),
                tag: "Eliminations",
              },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-3.5">
                <div>
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-neutral-600 block">
                    {s.tag}
                  </span>
                  <span className="text-[10px] font-bold text-neutral-400 mt-0.5 block">
                    {s.label}
                  </span>
                </div>
                <span className="text-base font-black text-white tracking-tight tabular-nums">
                  {s.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Goals CTA */}
        <div
          className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0a0a0a] p-5 cursor-pointer group hover:border-[#ff5722]/30 transition-all"
          onClick={() => navigate("/goals")}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff5722]/0 to-[#ff5722]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#ff5722] blur-[60px] opacity-0 group-hover:opacity-[0.06] transition-opacity" />

          <div className="relative flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-[#ff5722]/10 border border-[#ff5722]/20 flex items-center justify-center">
              <Target size={12} className="text-[#ff5722]" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-neutral-500">
              Strategic Goals
            </span>
          </div>

          <div className="relative flex flex-col justify-between h-[calc(100%-3rem)]">
            <div>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tighter text-white leading-none mb-2 group-hover:text-[#ff5722] transition-colors duration-300">
                VIEW
                <br />
                TARGETS
              </h3>
              <p className="text-[9px] font-bold text-neutral-700 uppercase tracking-[0.25em]">
                Milestone tracking active
              </p>
            </div>
            <div className="flex items-center gap-2 mt-6">
              <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              <span className="text-[#ff5722] text-lg font-black group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
