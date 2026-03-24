interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  loading?: boolean;
  children: React.ReactNode;
}
export default function Btn({ variant = 'primary', loading, children, className = '', ...props }: Props) {
  const base = 'inline-flex items-center gap-2 px-4 py-2.5 rounded text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-orange text-white hover:opacity-90 active:scale-95',
    ghost:   'border border-border text-muted hover:text-white hover:border-dim bg-transparent',
    danger:  'border border-red-800 text-red-400 hover:bg-red-900/20 bg-transparent',
  };
  return (
    <button {...props} disabled={props.disabled || loading} className={`${base} ${variants[variant]} ${className}`}>
      {loading ? <span className="animate-pulse">...</span> : children}
    </button>
  );
}
