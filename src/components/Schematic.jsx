import { SEVERITY_COLOR } from '../theme.js'

const ZONE_COORDS = {
  engine_bay:         { x: 140, y: 60,  r: 36, label: 'Engine' },
  front_left_wheel:   { x: 72,  y: 100, r: 20, label: 'FL' },
  front_right_wheel:  { x: 208, y: 100, r: 20, label: 'FR' },
  rear_left_wheel:    { x: 72,  y: 195, r: 20, label: 'RL' },
  rear_right_wheel:   { x: 208, y: 195, r: 20, label: 'RR' },
  underbody_front:    { x: 140, y: 115, r: 26, label: 'Front' },
  underbody_rear:     { x: 140, y: 180, r: 26, label: 'Rear' },
  cabin_dashboard:    { x: 140, y: 148, r: 28, label: 'Cabin' },
  battery_electrical: { x: 62,  y: 60,  r: 20, label: 'Batt' },
  fuel_system:        { x: 218, y: 60,  r: 20, label: 'Fuel' },
}

export default function Schematic({ faults, sel, onZone }) {
  const zoneMap = {}
  faults.forEach(f => {
    if (!zoneMap[f.zone]) zoneMap[f.zone] = { count: 0, topSev: 'low' }
    zoneMap[f.zone].count++
    const ord = { high: 0, medium: 1, low: 2 }
    if ((ord[f.severity] ?? 3) < (ord[zoneMap[f.zone].topSev] ?? 3)) zoneMap[f.zone].topSev = f.severity
  })

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 320, margin: '0 auto' }}>
      <svg viewBox="0 0 280 275" style={{ width: '100%' }}>
        <rect x="82" y="42" width="116" height="196" rx="20" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"/>
        <line x1="82" y1="140" x2="198" y2="140" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        <line x1="140" y1="42" x2="140" y2="238" stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
        {[{x:67,y:92,w:18,h:28},{x:195,y:92,w:18,h:28},{x:67,y:178,w:18,h:28},{x:195,y:178,w:18,h:28}].map((wh,i) => (
          <rect key={i} x={wh.x} y={wh.y} width={wh.w} height={wh.h} rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.12)" strokeWidth="1"/>
        ))}
        {Object.entries(ZONE_COORDS).map(([zone, pos]) => {
          const info = zoneMap[zone]
          const hasIssue = !!info
          const isSelected = sel === zone
          const color = hasIssue ? SEVERITY_COLOR[info.topSev] : 'rgba(255,255,255,0.08)'
          const bgColor = hasIssue ? `${SEVERITY_COLOR[info.topSev]}20` : 'rgba(255,255,255,0.03)'
          return (
            <g key={zone} onClick={() => hasIssue && onZone(zone)} style={{ cursor: hasIssue ? 'pointer' : 'default' }}>
              {hasIssue && (
                <circle cx={pos.x} cy={pos.y} r={pos.r + 5} fill="none" stroke={color} strokeWidth="1" opacity="0.25">
                  <animate attributeName="r" values={`${pos.r+5};${pos.r+12};${pos.r+5}`} dur="2.5s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.25;0;0.25" dur="2.5s" repeatCount="indefinite"/>
                </circle>
              )}
              {isSelected && (
                <circle cx={pos.x} cy={pos.y} r={pos.r + 7} fill="none" stroke={color} strokeWidth="2" strokeDasharray="4 3" opacity="0.8">
                  <animateTransform attributeName="transform" type="rotate" from={`0 ${pos.x} ${pos.y}`} to={`360 ${pos.x} ${pos.y}`} dur="4s" repeatCount="indefinite"/>
                </circle>
              )}
              <circle cx={pos.x} cy={pos.y} r={pos.r} fill={bgColor} stroke={color} strokeWidth={hasIssue ? (isSelected ? 2 : 1.5) : 1} opacity={hasIssue ? 1 : 0.5}/>
              {hasIssue
                ? <><text x={pos.x} y={pos.y - 4} textAnchor="middle" fill={color} fontSize="10" fontWeight="800" fontFamily="Inter">{info.count}</text>
                    <text x={pos.x} y={pos.y + 8} textAnchor="middle" fill={color} fontSize="7" fontFamily="Inter" opacity="0.8">{pos.label}</text></>
                : <text x={pos.x} y={pos.y + 4} textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="7" fontFamily="Inter">{pos.label}</text>}
            </g>
          )
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8 }}>
        {[{c:'#E63946',label:'Critical'},{c:'#F59E0B',label:'Moderate'},{c:'#2DD4BF',label:'Minor'}].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.c }}/>
            <span style={{ fontSize: 10, color: 'var(--text-mut)', fontWeight: 600 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
