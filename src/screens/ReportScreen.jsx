import { useState } from 'react'
import GlassCard from '../components/GlassCard.jsx'
import FaultCard from '../components/FaultCard.jsx'
import Schematic from '../components/Schematic.jsx'
import { SEVERITY_COLOR, ZONE_LABELS } from '../theme.js'

export default function ReportScreen({ ar, faults, setTab }) {
  const [view, setView]       = useState('list')
  const [selZone, setSelZone] = useState(null)
  const [filter, setFilter]   = useState('all')

  const high = faults.filter(f => f.severity==='high').length
  const med  = faults.filter(f => f.severity==='medium').length
  const low  = faults.filter(f => f.severity==='low').length
  const filtered = filter==='all' ? faults : faults.filter(f => f.severity===filter)
  const grouped = [
    { sev:'high',   label:ar?'حرج':'Critical',  faults:filtered.filter(f=>f.severity==='high') },
    { sev:'medium', label:ar?'متوسط':'Moderate', faults:filtered.filter(f=>f.severity==='medium') },
    { sev:'low',    label:ar?'منخفض':'Minor',    faults:filtered.filter(f=>f.severity==='low') },
  ].filter(g => g.faults.length>0)

  if (!faults.length) return (
    <div className="page-container" style={{ maxWidth:520, textAlign:'center', paddingTop:60 }}>
      <div style={{ width:72,height:72,borderRadius:'50%',background:'rgba(255,255,255,0.04)',border:'1px solid var(--border)',margin:'0 auto 20px',display:'flex',alignItems:'center',justifyContent:'center' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-mut)" strokeWidth="1.5"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
      </div>
      <div style={{ fontSize:20,fontWeight:700,color:'var(--text-pri)',marginBottom:8 }}>{ar?'لا يوجد تقرير بعد':'No Report Yet'}</div>
      <div style={{ fontSize:14,color:'var(--text-sec)',marginBottom:28 }}>{ar?'قم بمسح ورقة الفحص للحصول على تقريرك':'Scan your inspection sheet to generate a report'}</div>
      <button className="btn-primary" onClick={() => setTab('scan')}>{ar?'ابدأ المسح':'Start Scan'} →</button>
    </div>
  )

  return (
    <div>
      <div style={{ padding:'24px 20px 0', maxWidth:960, margin:'0 auto' }}>
        <div style={{ marginBottom:16 }}>
          <div style={{ fontSize:22,fontWeight:800,color:'var(--text-pri)',fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'-0.02em',marginBottom:4 }}>
            {ar?'تقرير التشخيص':'Diagnostic Report'}
          </div>
          <div style={{ fontSize:13,color:'var(--text-sec)' }}>
            {faults.length} {ar?'عطل مكتشف':'faults detected'}
            {high>0 && <span style={{ color:'var(--red)',fontWeight:700,marginLeft:8 }}>· {ar?`${high} حرج`:`${high} critical`}</span>}
          </div>
        </div>

        <div style={{ display:'flex',gap:10,marginBottom:16 }}>
          {[
            { count:high, label:ar?'حرج':'Critical',  sev:'high',   c:'var(--red)',   bg:'var(--crit-bg)', bd:'rgba(230,57,70,0.3)' },
            { count:med,  label:ar?'متوسط':'Moderate', sev:'medium', c:'var(--amber)', bg:'var(--med-bg)',  bd:'rgba(245,158,11,0.3)' },
            { count:low,  label:ar?'منخفض':'Minor',    sev:'low',    c:'var(--teal)',  bg:'var(--low-bg)',  bd:'rgba(45,212,191,0.3)' },
          ].map(item => (
            <button key={item.sev} onClick={() => setFilter(filter===item.sev?'all':item.sev)} style={{ flex:1,background:filter===item.sev?item.bg:'rgba(255,255,255,0.03)',borderRadius:14,padding:'12px 6px',textAlign:'center',border:`1px solid ${filter===item.sev?item.bd:'var(--border)'}`,cursor:'pointer',transition:'all .2s' }}>
              <div style={{ fontSize:24,fontWeight:900,color:filter===item.sev?item.c:'var(--text-sec)',fontFamily:"'Space Grotesk',sans-serif" }}>{item.count}</div>
              <div style={{ fontSize:10,color:filter===item.sev?item.c:'var(--text-mut)',fontWeight:700,marginTop:2,letterSpacing:'0.04em' }}>{item.label}</div>
            </button>
          ))}
        </div>

        {high>0 && (
          <div style={{ display:'flex',gap:10,alignItems:'flex-start',background:'var(--crit-bg)',border:'1px solid rgba(230,57,70,0.3)',borderRadius:12,padding:'12px 14px',marginBottom:16 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0,marginTop:2 }}>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" stroke="var(--red)" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize:12,color:'var(--text-sec)',lineHeight:1.6 }}>
              {ar?`${high} عطل حرج — لا تقد السيارة. راجع فنياً متخصصاً فوراً.`:`${high} critical fault(s) detected — do not drive. Seek immediate professional service.`}
            </span>
          </div>
        )}

        <div style={{ display:'flex',background:'rgba(255,255,255,0.04)',borderRadius:12,padding:3,gap:2,marginBottom:4 }}>
          {[{v:'list',en:'List View',ar:'قائمة'},{v:'map',en:'Vehicle Map',ar:'مخطط'}].map(opt => (
            <button key={opt.v} onClick={() => setView(opt.v)} style={{ flex:1,border:'none',cursor:'pointer',borderRadius:10,padding:'8px 12px',fontSize:13,fontWeight:600,transition:'all .2s',background:view===opt.v?'rgba(230,57,70,0.15)':'transparent',color:view===opt.v?'var(--red)':'var(--text-mut)' }}>
              {ar?opt.ar:opt.en}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:960,margin:'0 auto',padding:'16px 20px 40px' }}>
        {view==='list' ? (
          <div>
            {grouped.map(group => (
              <div key={group.sev} style={{ marginBottom:24 }}>
                <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:12 }}>
                  <div style={{ width:8,height:8,borderRadius:'50%',background:SEVERITY_COLOR[group.sev] }}/>
                  <span style={{ fontSize:12,fontWeight:700,color:SEVERITY_COLOR[group.sev],letterSpacing:'0.06em',textTransform:'uppercase' }}>{group.label} ({group.faults.length})</span>
                </div>
                {group.faults.map(fault => <FaultCard key={fault.id} fault={fault} ar={ar}/>)}
              </div>
            ))}
            {!filtered.length && <div style={{ textAlign:'center',color:'var(--text-mut)',padding:'40px 0',fontSize:14 }}>{ar?'لا توجد أعطال في هذه الفئة':'No faults in this category'}</div>}
          </div>
        ) : (
          <div>
            <GlassCard style={{ padding:'20px',marginBottom:16 }}>
              <div style={{ fontSize:12,color:'var(--text-sec)',textAlign:'center',marginBottom:16 }}>{ar?'اضغط على منطقة لعرض الأعطال':'Tap a highlighted zone to see faults'}</div>
              <Schematic faults={faults} sel={selZone} onZone={z => setSelZone(selZone===z?null:z)}/>
            </GlassCard>
            {selZone && (
              <div>
                <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:12 }}>
                  <div className="label-upper">{ZONE_LABELS[selZone]?.[ar?'ar':'en']||selZone}</div>
                  <button onClick={() => setSelZone(null)} style={{ background:'none',border:'none',color:'var(--text-mut)',cursor:'pointer',fontSize:18,padding:0 }}>×</button>
                </div>
                {faults.filter(f=>f.zone===selZone).map(fault => <FaultCard key={fault.id} fault={fault} ar={ar}/>)}
              </div>
            )}
            {!selZone && <div style={{ textAlign:'center',color:'var(--text-mut)',fontSize:13,padding:'20px 0' }}>{ar?'اضغط على منطقة ملونة':'Tap a highlighted zone on the map'}</div>}
          </div>
        )}
      </div>
    </div>
  )
}
