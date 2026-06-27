import { useState } from 'react'
import { RevealCard } from '../components/GlassCard.jsx'

const GARAGES = [
  { id:1, en:'Al-Mana Auto Service Center', ar:'مركز المانع لخدمة السيارات', dist:'1.2 km', rating:4.8, reviews:312, tags:['Engine','Electrical','Tyres'], open:true,  phone:'+974 4444 0001' },
  { id:2, en:'Qatar Motors Garage',         ar:'جراج قطر موتورز',            dist:'2.7 km', rating:4.6, reviews:187, tags:['Engine','Transmission','AC'], open:true,  phone:'+974 4444 0002' },
  { id:3, en:'Gulf Auto Repair',            ar:'خليج لإصلاح السيارات',       dist:'3.5 km', rating:4.4, reviews:94,  tags:['General','Tyres','Battery'], open:false, phone:'+974 4444 0003' },
]

export default function GaragesScreen({ ar }) {
  const [sel, setSel] = useState(null)
  return (
    <div>
      <div style={{ background:'linear-gradient(160deg,#070B14,#0D1B2A)', padding:'28px 20px 24px', borderBottom:'1px solid var(--border)' }}>
        <div style={{ maxWidth:960,margin:'0 auto' }}>
          <div style={{ fontSize:22,fontWeight:800,color:'var(--text-pri)',fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'-0.02em',marginBottom:4 }}>
            {ar?'مراكز الإصلاح القريبة':'Nearby Repair Shops'}
          </div>
          <div style={{ display:'flex',alignItems:'center',gap:6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-mut)" strokeWidth="2"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
            <span style={{ fontSize:13,color:'var(--text-sec)' }}>{ar?'الدوحة، قطر':'Doha, Qatar'}</span>
          </div>
        </div>
      </div>
      <div style={{ maxWidth:960,margin:'0 auto',padding:'20px 16px 40px' }}>
        {GARAGES.map((g,i) => (
          <RevealCard key={g.id} delay={i*80} style={{ marginBottom:12,overflow:'hidden',cursor:'pointer',border:`1px solid ${sel===i?'rgba(230,57,70,0.4)':'var(--border)'}`,boxShadow:sel===i?'0 4px 24px rgba(230,57,70,0.15)':'var(--shadow-card)',transition:'all .2s' }} onClick={() => setSel(sel===i?null:i)}>
            <div style={{ padding:18 }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12 }}>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:15,fontWeight:700,color:'var(--text-pri)',marginBottom:6,lineHeight:1.3 }}>{ar?g.ar:g.en}</div>
                  <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                    {Array.from({length:5},(_,k) => <svg key={k} width="12" height="12" viewBox="0 0 24 24" fill={k<Math.floor(g.rating)?'#F59E0B':'rgba(255,255,255,0.15)'}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}
                    <span style={{ fontSize:13,fontWeight:700,color:'var(--text-pri)' }}>{g.rating}</span>
                    <span style={{ fontSize:11,color:'var(--text-mut)' }}>({g.reviews})</span>
                  </div>
                </div>
                <div style={{ textAlign:'right',flexShrink:0 }}>
                  <div style={{ fontSize:13,fontWeight:700,color:'var(--text-sec)',marginBottom:4 }}>{g.dist}</div>
                  <div style={{ display:'inline-flex',alignItems:'center',gap:4,padding:'3px 8px',borderRadius:20,background:g.open?'rgba(45,212,191,0.1)':'rgba(255,255,255,0.05)',border:`1px solid ${g.open?'rgba(45,212,191,0.3)':'var(--border)'}` }}>
                    <div style={{ width:6,height:6,borderRadius:'50%',background:g.open?'var(--teal)':'var(--text-mut)' }}/>
                    <span style={{ fontSize:10,fontWeight:700,color:g.open?'var(--teal)':'var(--text-mut)' }}>{g.open?(ar?'مفتوح':'Open'):(ar?'مغلق':'Closed')}</span>
                  </div>
                </div>
              </div>
              <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
                {g.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            {sel===i && (
              <div style={{ display:'flex',gap:8,padding:'0 16px 16px',animation:'fadeIn .2s ease' }}>
                <button className="btn-primary" style={{ flex:1,padding:'11px',fontSize:13,borderRadius:12 }} onClick={e => { e.stopPropagation(); window.open(`https://maps.google.com/?q=${encodeURIComponent(g.en)}`,'_blank') }}>
                  {ar?'الاتجاهات':'Directions'}
                </button>
                <a href={`tel:${g.phone}`} onClick={e => e.stopPropagation()} style={{ flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:6,background:'rgba(255,255,255,0.04)',border:'1px solid var(--border)',borderRadius:12,padding:'11px',fontSize:13,fontWeight:600,color:'var(--text-pri)' }}>
                  {ar?'اتصال':'Call'}
                </a>
              </div>
            )}
          </RevealCard>
        ))}
        <div style={{ marginTop:12,padding:'12px 16px',background:'rgba(59,130,246,0.05)',border:'1px solid rgba(59,130,246,0.15)',borderRadius:12 }}>
          <div style={{ fontSize:12,color:'var(--text-sec)',lineHeight:1.7 }}>
            <strong style={{ color:'#93C5FD' }}>{ar?'ملاحظة:':'Note:'}</strong>{' '}
            {ar?'بيانات الورش للعرض التوضيحي فقط.':'Garage data shown for demonstration. Contact to confirm availability.'}
          </div>
        </div>
      </div>
    </div>
  )
}
