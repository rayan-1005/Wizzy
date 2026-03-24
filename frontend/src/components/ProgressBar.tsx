interface Props { value: number; max?: number; accent?: boolean; className?: string; }
export default function ProgressBar({ value, max = 100, accent, className = '' }: Props) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className={`w-full h-1.5 bg-border rounded-full overflow-hidden ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-500 ${accent ? 'bg-orange' : 'bg-white'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
