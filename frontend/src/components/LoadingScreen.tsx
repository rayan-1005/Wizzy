import { useEffect, useState } from "react";
import {
  Zap,
  ShieldCheck,
  Banknote,
  BrainCircuit,
  Activity,
} from "lucide-react";

const generateRandomData = () => {
  const currencies = [
    {
      code: "INR",
      rate: 82.74 + (Math.random() - 0.5) * 0.1,
      delta: (Math.random() - 0.5) * 0.05,
    },
    {
      code: "USD",
      rate: 1.0 + (Math.random() - 0.5) * 0.001,
      delta: (Math.random() - 0.5) * 0.001,
    },
    {
      code: "BTC",
      rate: 64230.12 + (Math.random() - 0.5) * 100,
      delta: (Math.random() - 0.5) * 50,
    },
  ];
  const assets = [
    { label: "LIQUID_CASH", percent: 42 + Math.random() * 8 },
    { label: "STRATEGIC_GOALS", percent: 31 + Math.random() * 4 },
    { label: "BOSS_RESERVE", percent: 18 + Math.random() * 3 },
  ];
  return { currencies, assets };
};

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState(generateRandomData());
  const [statusIndex, setStatusIndex] = useState(0);

  const statusMessages = [
    "INITIALIZING_WIZZY_CORE_v3.1",
    "SYNCING_BANK_UPLINK_ENCRYPTED",
    "PARSING_ASSET_VECTORS",
    "FETCHING_DAILY_QUEST_POOL",
    "CALCULATING_BOSS_LEVEL_STREAK",
    "STABILIZING_DASHBOARD_UI",
    "INTEGRITY_CHECK_COMPLETED",
    "READY_FOR_COMMAND",
  ];

  // Progress Bar Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random jumpy progress for "hacker" feel
        const jump = Math.random() > 0.8 ? 5 : 1.2;
        return Math.min(prev + jump, 100);
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Sync Text with Progress
  useEffect(() => {
    const idx = Math.min(
      Math.floor((progress / 100) * statusMessages.length),
      statusMessages.length - 1,
    );
    setStatusIndex(idx);
  }, [progress]);

  // Live Ticker Simulation
  useEffect(() => {
    const ticker = setInterval(() => setData(generateRandomData()), 2000);
    return () => clearInterval(ticker);
  }, []);

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex flex-col font-sans overflow-hidden p-6 md:p-12 relative select-none">
      {/* Background CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Header HUD */}
      <header className="flex justify-between items-center border-b border-white/5 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-[#ff5722] animate-pulse" size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">
            System Boot Protocol
          </span>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono text-neutral-600">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
            <span>NODE_ACTIVE</span>
          </div>
          <span>
            SECURE_SESSION_ID:{" "}
            {Math.random().toString(36).substring(7).toUpperCase()}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full gap-12">
        {/* Logo Section */}
        <div className="text-center space-y-2">
          <h1 className="text-8xl font-black italic tracking-tighter text-white flex items-center justify-center">
            <span className="text-[#ff5722]">W</span>IZZY
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-white/10" />
            <p className="text-[#71717a] text-[10px] font-black tracking-[0.5em] uppercase">
              Autonomous Finance OS
            </p>
            <div className="h-[1px] w-12 bg-white/10" />
          </div>
        </div>

        {/* Data Grid Overlay */}
        <div className="grid grid-cols-12 gap-6 w-full bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
          {/* Asset Section */}
          <div className="col-span-12 md:col-span-7 space-y-6 md:border-r border-white/5 md:pr-8">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                <Activity size={12} /> Asset Vector Calibration
              </span>
            </div>
            <div className="space-y-5">
              {data.assets.map((asset, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-neutral-400 font-mono tracking-tighter">
                      {asset.label}
                    </span>
                    <span className="text-[#ff5722]">
                      {asset.percent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#ff5722] transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,87,34,0.3)]"
                      style={{ width: `${asset.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ticker Section */}
          <div className="col-span-12 md:col-span-5 space-y-4 md:pl-4">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Live Market Feed
            </span>
            <div className="flex flex-col gap-3">
              {data.currencies.map((curr, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
                >
                  <span className="text-xs font-black text-white">
                    {curr.code}
                  </span>
                  <span className="text-xs font-mono text-neutral-300 tracking-tighter">
                    {curr.rate.toLocaleString()}
                  </span>
                  <span
                    className={`text-[10px] font-bold ${curr.delta > 0 ? "text-green-500" : "text-red-500"}`}
                  >
                    {curr.delta > 0 ? "▲" : "▼"} {(curr.delta * 100).toFixed(2)}
                    %
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Progress HUD */}
      <footer className="w-full max-w-4xl mx-auto space-y-6 mt-auto">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-2xl border transition-all duration-500 ${progress < 100 ? "border-[#ff5722]/40 bg-[#ff5722]/10 animate-pulse" : "border-green-500/40 bg-green-500/10"}`}
            >
              {progress < 100 ? (
                <Zap size={20} className="text-[#ff5722]" />
              ) : (
                <ShieldCheck size={20} className="text-green-500" />
              )}
            </div>
            <div>
              <p
                className={`text-lg font-black tracking-tighter uppercase transition-colors duration-500 ${progress < 100 ? "text-white" : "text-green-500"}`}
              >
                {statusMessages[statusIndex]}
              </p>
              <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">
                Core System Subroutines
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-6xl font-black text-[#ff5722] tracking-tighter drop-shadow-[0_0_15px_rgba(255,87,34,0.4)]">
              {Math.floor(progress)}%
            </span>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#ff5722] to-[#ff8a65] rounded-full transition-all duration-300 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_2s_infinite] w-20" />
          </div>
        </div>
      </footer>
    </div>
  );
}
