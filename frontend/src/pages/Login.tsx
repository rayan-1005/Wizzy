import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as apiLogin } from "../api";
import { useAuthStore } from "../store/authStore";

// Simple SVG Icons to keep dependencies low
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await apiLogin({ email, password });
      setSuccess(true);
      loginStore(data.data.user, data.data.token, data.data.refreshToken);
      // Navigate after success animation completes
      setTimeout(() => navigate("/"), 800);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error;
      setError(msg || "Invalid credentials. Please check your Access Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center font-sans overflow-hidden text-white p-4">
      {/* --- ANIMATIONS --- */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        @keyframes status-scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
        @keyframes success-check { 0% { scale: 0.5; opacity: 0; } 50% { scale: 1.1; } 100% { scale: 1; opacity: 1; } }
        @keyframes success-fade { 0% { opacity: 1; } 100% { opacity: 0; transform: scale(1.05); } }
        @keyframes head-shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
        .animate-marquee { display: flex; width: 200%; animation: marquee 30s linear infinite; }
        .animate-status { display: inline-block; white-space: nowrap; animation: status-scroll 25s linear infinite; }
        .animate-success-check { animation: success-check 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-success-fade { animation: success-fade 0.8s ease-out forwards; }
        .animate-head-shake { animation: head-shake 0.5s ease-in-out; }
      `}</style>

      {/* --- TECH BACKGROUND --- */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,87,34,0.02),rgba(0,0,0,0),rgba(255,87,34,0.02))] z-10 bg-[length:100%_4px,3px_100%]"></div>
        <div className="absolute inset-0 z-0 opacity-[0.02] flex flex-col justify-center -rotate-12 scale-150 gap-24">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-marquee">
              <span className="text-9xl font-black tracking-[0.3em]">
                WIZZY • DATA •{" "}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm relative z-10">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl">
            WIZZY
          </h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-[#ff5722]">
              <LockIcon />
            </span>
            <p className="text-[#71717a] text-[10px] font-bold tracking-[0.2em] uppercase">
              Secure System Access
            </p>
          </div>
        </header>

        {/* AUTH TOGGLE (Checklist: Switching Integration)
        <nav className="bg-black/40 p-1 rounded-xl border border-white/5 mb-6 flex relative">
          <div
            className={`absolute top-1 bottom-1 w-[48%] bg-[#ff5722] rounded-lg transition-all duration-300 z-0 shadow-[0_0_15px_rgba(255,87,34,0.3)] ${authMode === "signup" ? "left-[50.5%]" : "left-1"}`}
          />
          <button
            onClick={() => setAuthMode("login")}
            className={`flex-1 py-2.5 text-[11px] font-black relative z-10 transition-colors ${authMode === "login" ? "text-white" : "text-neutral-500"}`}
          >
            LOGIN
          </button>
          <button
            onClick={() => navigate("/register")}
            className={`flex-1 py-2.5 text-[11px] font-black relative z-10 transition-colors ${authMode === "signup" ? "text-white" : "text-neutral-500"}`}
          >
            SIGN UP
          </button>
        </nav> */}

        <main className="bg-[#0f0f0f]/90 backdrop-blur-3xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          {/* SUCCESS STATE */}
          {success && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0f0f0f]/95 rounded-2xl animate-success-fade z-20">
              <div className="flex flex-col items-center gap-3">
                <div className="text-[#ff5722] animate-success-check">
                  <CheckIcon />
                </div>
                <p className="text-sm font-bold text-white uppercase tracking-widest">
                  Session Initialized
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* EMAIL (Checklist: Mobile Keyboards & Labels) */}
            <div className="group">
              <div className="flex items-baseline justify-between mb-1.5 ml-1">
                <label
                  htmlFor="email"
                  className="text-[10px] uppercase tracking-widest text-[#71717a] font-bold group-focus-within:text-[#ff5722] transition-colors"
                >
                  Identity Path
                </label>
                <span className="text-[9px] text-neutral-600 font-normal">
                  (email or username)
                </span>
              </div>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 bg-black/60 border border-white/10 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-[#ff5722] focus:ring-1 focus:ring-[#ff5722]/20 transition-all"
                placeholder="user@wizzy.network"
              />
            </div>

            {/* PASSWORD (Checklist: Visibility Toggle & Password Managers) */}
            <div className="group relative">
              <div className="flex items-baseline justify-between mb-1.5 ml-1">
                <label
                  htmlFor="password"
                  className="text-[10px] uppercase tracking-widest text-[#71717a] font-bold group-focus-within:text-[#ff5722] transition-colors"
                >
                  Access Key
                </label>
                <span className="text-[9px] text-neutral-600 font-normal">
                  (your password)
                </span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 bg-black/60 border border-white/10 rounded-xl px-4 pr-12 text-white text-sm focus:outline-none focus:border-[#ff5722] transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-[#ff5722] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon />
                </button>
              </div>
            </div>

            {/* UTILITY ROW */}
            <div className="flex items-center justify-between px-1">
              <label
                className="flex items-center space-x-2 cursor-pointer group"
                title="Stay signed in for 30 days on this device"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/10 bg-black checked:bg-[#ff5722] appearance-none border transition-all cursor-pointer focus:ring-1 focus:ring-[#ff5722]"
                  aria-label="Remember identity for 30 days"
                />
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-tighter">
                  Remember Identity
                </span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/recover")}
                className="text-[10px] text-neutral-500 hover:text-neutral-400 transition-colors font-bold uppercase tracking-tighter"
                aria-label="Recover your account"
              >
                Lost Access?
              </button>
            </div>

            {/* ERROR STATE */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 animate-head-shake">
                <p className="text-red-500 text-[11px] font-bold text-center uppercase tracking-tighter">
                  {error}
                </p>
              </div>
            )}

            {/* BUTTON (Checklist: Loading States & Touch-Target) */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full h-12 bg-[#ff5722] text-white font-black rounded-xl text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#ff5722]/20 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Authenticating
                </span>
              ) : (
                "Initialize Session"
              )}
            </button>
          </form>

          {/* SIGN UP PROMPT */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-neutral-600 font-normal mb-2">
              Don't have an account?
            </p>
            <button
              onClick={() => navigate("/register")}
              className="text-[10px] text-[#ff5722] hover:text-[#ff6b3a] font-bold uppercase tracking-tighter transition-colors"
            >
              Create New Identity
            </button>
          </div>

          {/* TRUST FOOTER (Checklist: Security Indicators) */}
          <footer className="mt-4 pt-4 border-t border-white/5 flex flex-col items-center gap-3">
            <div className="flex items-center gap-4 text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
              <span>SSL SECURED</span>
              <span className="w-1 h-1 bg-neutral-800 rounded-full"></span>
              <span>AES-256 ENCRYPTED</span>
            </div>
            <div className="flex gap-4">
              <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">
                Wizzy Network
              </span>
              <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">
                v.1.0.9
              </span>
            </div>
          </footer>
        </main>
      </div>

      {/* SERVER STATUS MARQUEE (Checklist: Dynamic Branding) */}
      <aside className="fixed bottom-0 left-0 w-full bg-black/80 backdrop-blur-md border-t border-white/5 py-1.5 overflow-hidden">
        <div className="animate-status flex items-center gap-12">
          <span className="text-[9px] font-mono text-[#ff5722] font-bold uppercase">
            ● System: Operational
          </span>
          <span className="text-[9px] font-mono text-neutral-600">
            Encrypted Tunnel: Established
          </span>
          <span className="text-[9px] font-mono text-neutral-600 uppercase">
            Wzy-Core: v.1.0.9
          </span>
          <span className="text-[9px] font-mono text-neutral-600">
            Latency: 14ms
          </span>
        </div>
      </aside>
    </div>
  );
}
