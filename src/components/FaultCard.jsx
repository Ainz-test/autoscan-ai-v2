import { useState } from 'react'
import { SeverityBadge } from './GlassCard.jsx'
import { SEVERITY_COLOR, SEVERITY_BG, SEVERITY_BD, ZONE_LABELS } from '../theme.js'

export default function FaultCard({ fault, ar }) {
  const [expanded, setExpanded] = useState(false)
  const sev = fault.severity || 'low'
  const col = SEVERITY_COLOR[sev]
  const bg  = SEVERITY_BG[sev]
  const bd  = SEVERITY_BD[sev]
  const zone = ZONE_LABELS[fault.zone]
  const zoneName = zone ? (ar ? zone.ar : zone.en) : fault.zone

  return (
    <div style={{
      background: 'var(--bg-card)', border: `1px solid ${bd}`,
      borderRadius: 18, overflow: 'hidden', marginBottom: 10,
      boxShadow: expanded ? `0 4px 24px ${col}22` : 'var(--shadow-card)',
      transition: 'box-shadow .2s',
    }}>
      <button onClick={() => setExpanded(!expanded)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px', background: 'transparent', border: 'none',
        cursor: 'pointer', textAlign: 'left',
      }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: col, flexShrink: 0, boxShadow: `0 0 8px ${col}80` }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-pri)', lineHeight: 1.3, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {ar ? fault.nameAr : fault.nameEn}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <SeverityBadge severity={sev} ar={ar} />
            {fault.code && (
              <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: 'var(--text-mut)', background: 'rgba(255,255,255,0.04)', padding: '2px 7px', borderRadius: 6, border: '1px solid var(--border)' }}>
                {fault.code}
              </span>
            )}
            {zoneName && <span style={{ fontSize: 10, color: 'var(--text-mut)', fontWeight: 500 }}>{zoneName}</span>}
          </div>
        </div>
        <div style={{ flexShrink: 0, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          {fault.cost && <span style={{ fontSize: 12, fontWeight: 700, color: col }}>{fault.cost}</span>}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-mut)" strokeWidth="2" strokeLinecap="round" style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .25s' }}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div style={{ padding: '0 16px 16px', animation: 'fadeIn .25s ease' }}>
          <div style={{ height: 1, background: `${col}30`, marginBottom: 14 }} />
          {InfoBlock({ label: ar ? 'وظيفة المكون' : 'Component Function', content: ar ? fault.fnAr : fault.fn, color: 'var(--blue)' })}
          {InfoBlock({ label: ar ? 'الخطر الفوري' : 'Immediate Risk', content: ar ? fault.immediateAr : fault.immediate, color: 'var(--red)' })}
          {InfoBlock({ label: ar ? 'عواقب طويلة الأمد' : 'Long-term Consequences', content: ar ? fault.longtermAr : fault.longterm, color: 'var(--amber)' })}
          {(() => {
            const steps = ar ? (fault.stepsAr || fault.steps) : fault.steps
            if (!steps?.length) return null
            return (
              <div style={{ marginTop: 12 }}>
                <div className="label-upper" style={{ marginBottom: 8 }}>{ar ? 'خطوات الإصلاح' : 'Repair Steps'}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {steps.map((s, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '8px 12px' }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: `${col}20`, color: col, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, marginTop: 1 }}>{i + 1}</div>
                      <span style={{ fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.6 }}>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )
}

function InfoBlock({ label, content, color }) {
  if (!content) return null
  return (
    <div style={{ marginBottom: 10, background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 10, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.6 }}>{content}</div>
    </div>
  )
}
