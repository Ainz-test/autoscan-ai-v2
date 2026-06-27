export default function GlassCard({ children, style, className = '', onClick }) {
  return (
    <div className={`glass-card ${className}`} style={style} onClick={onClick}>
      {children}
    </div>
  )
}

export function RevealCard({ children, style, delay = 0, className = '' }) {
  return (
    <div
      className={`glass-card animate-fade-up ${className}`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both', ...style }}
    >
      {children}
    </div>
  )
}

export function SeverityBadge({ severity, ar }) {
  const labels = { high: { en: 'Critical', ar: 'حرج' }, medium: { en: 'Moderate', ar: 'متوسط' }, low: { en: 'Minor', ar: 'منخفض' } }
  const cls = { high: 'chip-high', medium: 'chip-medium', low: 'chip-low' }
  const dots = { high: '●', medium: '◆', low: '▲' }
  const l = labels[severity] || labels.low
  return (
    <span className={`chip ${cls[severity] || 'chip-low'}`}>
      <span style={{ fontSize: 8 }}>{dots[severity]}</span>
      {ar ? l.ar : l.en}
    </span>
  )
}
