import { useState, useEffect } from "react";
import { NavLink, useNavigate, Outlet, Navigate } from "react-router-dom";
import {
  Home,
  DollarSign,
  Zap,
  Target,
  TrendingUp,
  Swords,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { logout as apiLogout } from "../api";
import LoadingScreen from "./LoadingScreen"; // Ensure the path is correct

const nav = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/expenses", icon: DollarSign, label: "Expenses" },
  { to: "/quests", icon: Zap, label: "Quests" },
  { to: "/boss", icon: Swords, label: "Boss" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/insights", icon: TrendingUp, label: "Insights" },
];

export default function Layout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isBooting, setIsBooting] = useState(true); // Control the loading screen
  const { user, logout, refreshToken } = useAuthStore();
  const navigate = useNavigate();

  // 1. Monitor Auth State
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // 2. Simulate System Boot (Match this to your LoadingScreen duration)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooting(false);
    }, 6000); // 6 seconds of "nerdy" data parsing
    return () => clearTimeout(timer);
  }, []);

  // 3. Prevent Crash: Show Loading Screen while booting
  if (isBooting) {
    return <LoadingScreen />;
  }

  // 4. Final safety check for User object
  if (!user) return <Navigate to="/login" />;

  const handleLogout = async () => {
    try {
      if (refreshToken) await apiLogout(refreshToken);
    } catch {}
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex flex-col md:flex-row overflow-hidden font-sans">
      {/* ---------- MOBILE TOP BAR ---------- */}
      <header className="md:hidden h-16 flex items-center justify-between px-5 bg-[#0a0a0a] border-b border-white/5 z-20 shrink-0">
        <div className="flex items-center italic">
          <span className="text-[#ff5722] font-black text-xl">W</span>
          <span className="font-black text-xl tracking-tighter">IZZY</span>
        </div>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="text-[#ff5722]"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* ---------- MOBILE FULL MENU OVERLAY ---------- */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col p-8 animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center italic">
              <span className="text-[#ff5722] font-black text-3xl">W</span>
              <span className="font-black text-3xl tracking-tighter">IZZY</span>
            </div>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 bg-white/5 rounded-full"
            >
              <X size={28} />
            </button>
          </div>

          <nav className="flex flex-col gap-4">
            {nav.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-6 p-5 rounded-2xl text-xl font-black italic tracking-tighter transition-all ${
                    isActive
                      ? "bg-[#ff5722] text-white"
                      : "bg-white/5 text-neutral-500"
                  }`
                }
              >
                <Icon size={24} />
                {label.toUpperCase()}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#ff5722]/20 flex items-center justify-center text-[#ff5722]">
                <User size={18} />
              </div>
              <p className="font-black uppercase tracking-widest text-xs text-neutral-400">
                {user.name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full py-4 bg-red-500/10 text-red-500 rounded-2xl font-black uppercase tracking-widest text-xs border border-red-500/20"
            >
              Terminate Session
            </button>
          </div>
        </div>
      )}

      {/* ---------- DESKTOP SIDEBAR ---------- */}
      <aside className="hidden md:flex group w-20 hover:w-64 bg-[#0a0a0a] border-r border-white/5 flex-col transition-all duration-300 z-30">
        <div className="h-20 flex items-center px-7 border-b border-white/5 overflow-hidden shrink-0">
          <div className="flex items-center italic">
            <span className="text-[#ff5722] font-black text-2xl tracking-tighter">
              W
            </span>
            <span className="ml-0 text-white font-black text-2xl tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
              IZZY
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-2 mt-4">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center h-12 px-4 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-[#ff5722] text-white shadow-[0_0_15px_rgba(255,87,34,0.3)]"
                    : "text-neutral-500 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <Icon size={20} className="shrink-0" />
              <span className="ml-4 font-black uppercase tracking-widest text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-3 text-neutral-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} className="shrink-0" />
            <span className="font-black uppercase tracking-widest text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* ---------- MAIN CONTENT ---------- */}
      <main className="relative flex-1 overflow-y-auto pt-16 md:pt-0 z-10 bg-[#050505]">
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* ---------- MOBILE BOTTOM NAV ---------- */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0a0a0a]/80 backdrop-blur-md border-t border-white/5 flex justify-around items-center z-20">
        {nav.slice(0, 5).map(({ to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `transition-colors ${isActive ? "text-[#ff5722]" : "text-neutral-500"}`
            }
          >
            <Icon size={22} />
          </NavLink>
        ))}
      </nav>

      {/* Static Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0 select-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </div>
  );
}
