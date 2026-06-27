import { useState } from 'react'
import { RevealCard } from '../components/GlassCard.jsx'
import { AVATARS } from '../theme.js'

export default function ProfileScreen({ ar, setAr, profile, setProfile }) {
  const [editing, setEditing] = useState(false)
  const [nameVal, setNameVal] = useState(profile.name||'')
  const hasName = profile.name?.trim().length>0
  const av = AVATARS[profile.avatar??0]

  function saveProfile() { setProfile({...profile,name:nameVal.trim()}); setEditing(false) }
  function pickAvatar(idx) { setProfile({...profile,avatar:idx}) }

  return (
    <div style={{ maxWidth:640,margin:'0 auto' }}>
      <div style={{ background:'linear-gradient(160deg,#070B14 0%,#0D1B2A 60%,#1a0508 100%)',padding:'32px 20px 36px',textAlign:'center',borderBottom:'1px solid var(--border)',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 120%,rgba(230,57,70,0.08) 0%,transparent 70%)',pointerEvents:'none' }}/>
        <div style={{ width:84,height:84,borderRadius:'50%',overflow:'hidden',margin:'0 auto 16px',border:'3px solid var(--red)',boxShadow:'0 0 0 5px rgba(230,57,70,0.15),0 8px 32px rgba(0,0,0,0.5)',cursor:'pointer' }} onClick={() => { setNameVal(profile.name||''); setEditing(true) }}>
          <img src={av} width={84} height={84} alt="avatar" style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
        </div>
        {hasName
          ? <div style={{ fontSize:20,fontWeight:800,color:'var(--text-pri)',marginBottom:4,fontFamily:"'Space Grotesk',sans-serif" }}>{profile.name}</div>
          : <div style={{ fontSize:14,color:'var(--text-mut)',marginBottom:4 }}>{ar?'اضغط لتعيين اسمك':'Tap to set your name'}</div>}
        <div style={{ fontSize:12,color:'rgba(239,246,255,0.4)',marginBottom:16 }}>📍 {ar?'الدوحة، قطر':'Doha, Qatar'}</div>
        <button onClick={() => { setNameVal(profile.name||''); setEditing(true) }} style={{ background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:20,padding:'7px 20px',fontSize:12,fontWeight:600,color:'var(--text-sec)',cursor:'pointer' }}>
          {ar?'تعديل الملف':'Edit Profile'}
        </button>
      </div>

      <div style={{ padding:'20px 16px 40px',display:'flex',flexDirection:'column',gap:12 }}>
        <RevealCard delay={0} style={{ padding:18 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center' }}>
            <div>
              <div style={{ fontSize:14,fontWeight:700,color:'var(--text-pri)',marginBottom:2 }}>🌐 {ar?'اللغة':'Language'}</div>
              <div style={{ fontSize:12,color:'var(--text-sec)' }}>Arabic / English</div>
            </div>
            <div style={{ display:'flex',background:'rgba(255,255,255,0.04)',borderRadius:22,padding:3,gap:2,border:'1px solid var(--border)' }}>
              {[{l:'عربي',v:true},{l:'EN',v:false}].map(opt => (
                <button key={opt.l} onClick={() => setAr(opt.v)} style={{ padding:'7px 16px',borderRadius:18,border:'none',cursor:'pointer',background:ar===opt.v?'var(--red)':'transparent',color:ar===opt.v?'#fff':'var(--text-sec)',fontSize:12,fontWeight:700,transition:'all .2s' }}>{opt.l}</button>
              ))}
            </div>
          </div>
        </RevealCard>

        <RevealCard delay={70} style={{ padding:18 }}>
          <div style={{ fontSize:14,fontWeight:700,color:'var(--text-pri)',marginBottom:8 }}>📱 {ar?'تثبيت التطبيق':'Install App'}</div>
          <div style={{ fontSize:13,color:'var(--text-sec)',lineHeight:1.7,marginBottom:14 }}>
            {ar?'Safari: اضغط زر المشاركة ⬆️ ثم إضافة إلى الشاشة الرئيسية':'In Safari: tap Share ⬆️ then Add to Home Screen'}
          </div>
          <div style={{ display:'flex',gap:8 }}>
            {(ar?['١. افتح Safari','٢. اضغط مشاركة','٣. أضف للشاشة']:['1. Open Safari','2. Tap Share ⬆','3. Add to Home']).map(s => (
              <div key={s} style={{ flex:1,background:'rgba(45,212,191,0.06)',borderRadius:10,padding:'8px 6px',textAlign:'center',fontSize:10,color:'var(--teal)',fontWeight:600,lineHeight:1.5,border:'1px solid rgba(45,212,191,0.15)' }}>{s}</div>
            ))}
          </div>
        </RevealCard>

        <RevealCard delay={140} style={{ padding:18,background:'rgba(59,130,246,0.04)',border:'1px solid rgba(59,130,246,0.12)' }}>
          <div style={{ fontSize:13,fontWeight:700,color:'#93C5FD',marginBottom:8 }}>🔒 {ar?'الخصوصية والأمان':'Privacy & Security'}</div>
          <div style={{ fontSize:12,color:'var(--text-sec)',lineHeight:1.7 }}>
            {ar?'صورك تبقى خاصة ولا يتم تخزينها. مفتاح API محمي على الخادم فقط.':'Your images stay private and are never stored. The API key is protected server-side only.'}
          </div>
        </RevealCard>

        <div style={{ textAlign:'center',paddingTop:8 }}>
          <div style={{ fontSize:11,color:'var(--text-mut)' }}>AutoScan AI v2.0 · Powered by Claude</div>
        </div>
      </div>

      {editing && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.82)',zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:20,animation:'fadeIn .2s ease' }}>
          <div style={{ background:'var(--bg-card)',borderRadius:24,padding:28,width:'100%',maxWidth:400,border:'1px solid var(--border)',boxShadow:'0 24px 80px rgba(0,0,0,0.7)' }}>
            <div style={{ fontSize:18,fontWeight:800,color:'var(--text-pri)',marginBottom:24,fontFamily:"'Space Grotesk',sans-serif" }}>{ar?'تعديل الملف الشخصي':'Edit Profile'}</div>
            <div style={{ marginBottom:22 }}>
              <div className="label-upper" style={{ marginBottom:8 }}>{ar?'الاسم':'Name'}</div>
              <input type="text" value={nameVal} onChange={e => setNameVal(e.target.value)} placeholder={ar?'أدخل اسمك':'Enter your name'} style={{ width:'100%' }} onKeyDown={e => e.key==='Enter'&&saveProfile()} autoFocus/>
            </div>
            <div style={{ marginBottom:24 }}>
              <div className="label-upper" style={{ marginBottom:10 }}>{ar?'اختر صورة الملف':'Choose Profile Picture'}</div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10 }}>
                {AVATARS.map((avUrl,idx) => {
                  const selected=(profile.avatar??0)===idx
                  return (
                    <div key={idx} onClick={() => pickAvatar(idx)} style={{ width:60,height:60,borderRadius:'50%',overflow:'hidden',cursor:'pointer',margin:'0 auto',border:`3px solid ${selected?'var(--red)':'transparent'}`,boxShadow:selected?'0 0 0 3px rgba(230,57,70,0.25)':'none',transition:'all .2s' }}>
                      <img src={avUrl} width={60} height={60} alt={`av${idx}`} style={{ width:'100%',height:'100%',objectFit:'cover' }}/>
                    </div>
                  )
                })}
              </div>
            </div>
            <div style={{ display:'flex',gap:10 }}>
              <button className="btn-primary" style={{ flex:1,borderRadius:12,padding:'13px' }} onClick={saveProfile}>{ar?'حفظ':'Save'}</button>
              <button className="btn-ghost" style={{ flex:1,padding:'13px' }} onClick={() => setEditing(false)}>{ar?'إلغاء':'Cancel'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
