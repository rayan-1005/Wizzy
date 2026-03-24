import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register as apiRegister } from "../api";
import { useAuthStore } from "../store/authStore";

// Icons
const EyeIcon = ({ open }: { open: boolean }) => (
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
    {open ? (
      <>
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
        <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
        <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
        <line x1="2" y1="2" x2="22" y2="22" />
      </>
    )}
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

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    monthlyIncome: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // Gamified Password Strength Logic
  const strength = useMemo(() => {
    const pw = form.password;
    if (!pw)
      return {
        score: 0,
        label: "Empty",
        color: "bg-neutral-800",
        hex: "#404040",
      };
    let score = 0;
    if (pw.length > 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const levels = [
      { label: "Vulnerable", color: "bg-red-500", hex: "#ef4444" },
      { label: "Weak", color: "bg-orange-600", hex: "#ea580c" },
      { label: "Fair", color: "bg-yellow-500", hex: "#eab308" },
      { label: "Secure", color: "bg-[#ff5722]", hex: "#ff5722" },
      { label: "Legendary", color: "bg-cyan-400", hex: "#22d3ee" },
    ];
    return { score: (score / 4) * 100, ...levels[score] };
  }, [form.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await apiRegister({
        ...form,
        monthlyIncome: Number(form.monthlyIncome),
      });
      setSuccess(true);
      loginStore(data.data.user, data.data.token, data.data.refreshToken);
      // Navigate after success animation completes
      setTimeout(() => navigate("/"), 800);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })
        ?.response?.data?.error;
      setError(msg || "Network Error: Failed to initialize account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center font-sans overflow-hidden text-white p-4">
      {/* --- BACKGROUND FX & ANIMATIONS --- */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        @keyframes success-check { 0% { scale: 0.5; opacity: 0; } 50% { scale: 1.1; } 100% { scale: 1; opacity: 1; } }
        @keyframes success-fade { 0% { opacity: 1; } 100% { opacity: 0; transform: scale(1.05); } }
        @keyframes head-shake { 0%, 100% { transform: translateX(0); } 10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); } 20%, 40%, 60%, 80% { transform: translateX(5px); } }
        .animate-ticker { display: flex; width: 200%; animation: marquee 40s linear infinite; opacity: 0.03; }
        .animate-success-check { animation: success-check 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-success-fade { animation: success-fade 0.8s ease-out forwards; }
        .animate-head-shake { animation: head-shake 0.5s ease-in-out; }
      `}</style>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,87,34,0.02),rgba(0,0,0,0),rgba(255,87,34,0.02))] z-10 bg-[length:100%_4px,3px_100%]"></div>
        <div className="absolute top-1/2 -translate-y-1/2 -rotate-6 scale-125">
          <div className="animate-ticker text-[12rem] font-black tracking-tighter whitespace-nowrap">
            CREATE ACCOUNT • JOIN THE NETWORK • LEVEL UP •
          </div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-black tracking-tighter">WIZZY</h1>
          <p className="text-[#71717a] text-[10px] mt-2 font-bold tracking-[0.3em] uppercase">
            Initialize New Player Profile
          </p>
        </header>

        <main className="bg-[#0f0f0f]/80 backdrop-blur-2xl border border-white/10 rounded-2xl p-7 shadow-2xl relative overflow-hidden">
          {/* Subtle Orange Glow at Top */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#ff5722] to-transparent opacity-50"></div>

          {/* SUCCESS STATE */}
          {success && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#0f0f0f]/95 rounded-2xl animate-success-fade z-20">
              <div className="flex flex-col items-center gap-3">
                <div className="text-[#ff5722] animate-success-check">
                  <CheckIcon />
                </div>
                <p className="text-sm font-bold text-white uppercase tracking-widest">
                  Profile Created
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between ml-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                    Legal Name
                  </label>
                  <span className="text-[9px] text-neutral-600 font-normal">
                    (full name)
                  </span>
                </div>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  required
                  autoComplete="name"
                  aria-label="Full name"
                  className="w-full h-11 bg-black/40 border border-white/5 rounded-xl px-4 text-sm focus:border-[#ff5722] focus:ring-1 focus:ring-[#ff5722]/20 transition-all outline-none"
                  placeholder="Bruce Wayne"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between ml-1">
                  <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                    Monthly Yield (₹)
                  </label>
                  <span className="text-[9px] text-neutral-600 font-normal">
                    (income estimate)
                  </span>
                </div>
                <input
                  type="number"
                  value={form.monthlyIncome}
                  onChange={(e) => set("monthlyIncome", e.target.value)}
                  required
                  aria-label="Monthly income in rupees"
                  className="w-full h-11 bg-black/40 border border-white/5 rounded-xl px-4 text-sm focus:border-[#ff5722] focus:ring-1 focus:ring-[#ff5722]/20 transition-all outline-none"
                  placeholder="80000"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between ml-1">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  Neural Mail
                </label>
                <span className="text-[9px] text-neutral-600 font-normal">
                  (your email)
                </span>
              </div>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                required
                autoComplete="email"
                aria-label="Email address"
                className="w-full h-11 bg-black/40 border border-white/5 rounded-xl px-4 text-sm focus:border-[#ff5722] focus:ring-1 focus:ring-[#ff5722]/20 transition-all outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between ml-1">
                <label className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  Access Key
                </label>
                <span className="text-[9px] text-neutral-600 font-normal">
                  (password)
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  required
                  autoComplete="new-password"
                  aria-label="Password"
                  className="w-full h-11 bg-black/40 border border-white/5 rounded-xl px-4 pr-12 text-sm focus:border-[#ff5722] focus:ring-1 focus:ring-[#ff5722]/20 transition-all outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>

              {/* GAMIFIED STRENGTH BAR */}
              <div className="mt-2 space-y-1 px-1">
                <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                  <span className="text-neutral-500">Security Rating</span>
                  <span className={strength.color.replace("bg-", "text-")}>
                    {strength.label}
                  </span>
                </div>
                <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color} transition-all duration-500 ease-out shadow-[0_0_8px]`}
                    style={{
                      width: `${strength.score}%`,
                      boxShadow: `0 0 12px ${strength.hex}`,
                    }}
                  />
                </div>
                <p className="text-[8px] text-neutral-600 mt-1">
                  {strength.score === 0
                    ? "Enter a password"
                    : strength.score < 25
                      ? "Add uppercase, numbers, or symbols"
                      : strength.score < 50
                        ? "Consider adding more characters"
                        : strength.score < 75
                          ? "Good security. Keep it safe!"
                          : "Excellent security!"}
                </p>
              </div>
            </div>

            {/* ERROR STATE */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 animate-head-shake">
                <p className="text-red-500 text-[11px] font-bold text-center uppercase tracking-tighter">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              aria-label="Create account and register"
              className="w-full h-12 bg-[#ff5722] text-white font-black rounded-xl text-xs uppercase tracking-[0.2em] shadow-lg shadow-[#ff5722]/20 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing Data
                </span>
              ) : (
                "Confirm Registration"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-center text-neutral-500 text-[10px] font-normal mb-2 uppercase tracking-wider">
              Linked to the grid?
            </p>
            <Link
              to="/login"
              className="block text-center text-[11px] text-[#ff5722] hover:text-[#ff6b3a] font-bold uppercase tracking-tighter transition-colors"
            >
              Log In to Existing Account
            </Link>
          </div>

          {/* SECURITY INFO FOOTER */}
          <footer className="mt-4 pt-4 border-t border-white/5 flex flex-col items-center gap-2">
            <div className="flex items-center gap-4 text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
              <span>SSL SECURED</span>
              <span className="w-1 h-1 bg-neutral-800 rounded-full"></span>
              <span>AES-256 ENCRYPTED</span>
            </div>
          </footer>
        </main>
      </div>

      {/* FOOTER BADGE */}
      <footer className="mt-8 opacity-40 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-[10px] font-mono tracking-tighter uppercase">
          Wizzy-Auth Protocol v2.4 Active
        </span>
      </footer>
    </div>
  );
}