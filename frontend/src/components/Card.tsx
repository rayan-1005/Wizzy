interface Props { children: React.ReactNode; className?: string; onClick?: () => void; }
export default function Card({ children, className = '', onClick }: Props) {
  return (
    <div onClick={onClick}
      className={`bg-charcoal border border-border rounded p-4 transition-all duration-150 ${onClick ? 'cursor-pointer hover:bg-hover hover:border-dim' : ''} ${className}`}>
      {children}
    </div>
  );
}
