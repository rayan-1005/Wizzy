interface Props {
  label: string;
  value: string;
  meta?: string;
  accent?: boolean;
  className?: string;
}
export default function StatCard({ label, value, meta, accent, className = '' }: Props) {
  return (
    <div className={`bg-charcoal border border-border rounded p-4 flex flex-col gap-2 hover:bg-hover hover:border-dim transition-all duration-150 ${className}`}>
      <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      <span className={`text-5xl font-black tracking-tighter leading-none ${accent ? 'text-orange' : 'text-white'}`}>
        {value}
      </span>
      {meta && <span className="text-xs text-muted">{meta}</span>}
    </div>
  );
}
