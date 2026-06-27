import { useState, useRef, useEffect } from 'react'
import GlassCard from '../components/GlassCard.jsx'
import { MAKES, MODELS_MAP, buildDiagnosisPrompt } from '../theme.js'

const CURRENT_YEAR = new Date().getFullYear()
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i)
const STAGES = [
  { en: 'Extracting text via OCR…', ar: 'استخراج النص عبر OCR…' },
  { en: 'Running AI diagnosis…',    ar: 'تشغيل نموذج الذكاء الاصطناعي…' },
  { en: 'Mapping fault locations…', ar: 'تحديد مواقع الأعطال…' },
]

export default function ScanScreen({ setTab, ar, setFaults }) {
  const [step, setStep]         = useState('vehicle')
  const [make, setMake]         = useState('Toyota')
  const [model, setModel]       = useState('Land Cruiser')
  const [year, setYear]         = useState(2006)
  const [progress, setProgress] = useState(0)
  const [subStep, setSubStep]   = useState(0)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const galleryRef = useRef(null)
  const videoRef   = useRef(null)
  const streamRef  = useRef(null)
  const models = MODELS_MAP[make] || MODELS_MAP.default

  useEffect(() => {
    if (step === 'camera') startCamera()
    return stopCamera
  }, [step])

  function startCamera() {
    if (!navigator.mediaDevices?.getUserMedia) { setErrorMsg(ar ? 'الكاميرا غير مدعومة.' : 'Camera not supported. Use Upload Photo.'); return }
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      .then(s => { streamRef.current = s; if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play() } })
      .catch(() => setErrorMsg(ar ? 'تعذّر الوصول للكاميرا.' : 'Camera access denied. Use Upload Photo.'))
  }
  function stopCamera() {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null }
  }
  function capturePhoto() {
    const v = videoRef.current; if (!v) return
    const c = document.createElement('canvas'); c.width = v.videoWidth||640; c.height = v.videoHeight||480
    c.getContext('2d').drawImage(v, 0, 0)
    c.toBlob(blob => { setPreviewUrl(URL.createObjectURL(blob)); stopCamera(); runPipeline(blob) }, 'image/jpeg', 0.92)
  }
  function handleGallery(e) {
    const file = e.target.files?.[0]; if (!file) return
    const ok = ['image/jpeg','image/png','image/webp','image/heic','image/heif']
    if (!ok.includes(file.type) && file.type !== '') { fail(ar ? 'نوع الملف غير مدعوم.' : 'Invalid file type. Use JPEG or PNG.'); return }
    if (file.size > 25*1024*1024) { fail(ar ? 'حجم الملف كبير جداً.' : 'File too large. Max 25MB.'); return }
    e.target.value = ''; setPreviewUrl(URL.createObjectURL(file)); runPipeline(file)
  }
  function fail(msg) { setErrorMsg(msg); setStep('error') }

  function runPipeline(imageFile) {
    setStep('processing'); setProgress(0); setSubStep(0); setErrorMsg(null)
    let p = 0
    const tick = setInterval(() => {
      p += 1; if (p >= 90) clearInterval(tick)
      setProgress(p)
      if (p === 28) setSubStep(1)
      if (p === 62) setSubStep(2)
    }, 80)
    const reader = new FileReader()
    reader.onerror = () => { clearInterval(tick); fail(ar ? 'تعذّر قراءة الصورة.' : 'Could not read the image.') }
    reader.onload = () => {
      const b64 = reader.result.split(',')[1]
      const mt  = imageFile.type || 'image/jpeg'
      const body = JSON.stringify({
        model: 'claude-sonnet-4-6', max_tokens: 4000,
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: mt, data: b64 } },
          { type: 'text', text: buildDiagnosisPrompt(make, model, year) }
        ]}]
      })
      fetch('/api/diagnose', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
        .then(res => {
          clearInterval(tick); setProgress(100)
          if (res.status === 404) { fail(ar ? 'ملف api/diagnose.js غير موجود.' : 'API proxy missing.'); return null }
          if (!res.ok) { fail('Server error ' + res.status); return null }
          return res.json()
        })
        .then(data => {
          if (!data) return
          if (data.error) {
            const msg = data.error.message || JSON.stringify(data.error)
            fail(msg.includes('credit')||msg.includes('billing') ? 'Add billing credit at console.anthropic.com/billing. '+msg : 'API error: '+msg)
            return
          }
          const raw = data.content?.[0]?.text || ''
          if (!raw) { fail(ar ? 'استجابة فارغة.' : 'Empty AI response. Please try again.'); return }
          let faults = []
          try {
            let clean = raw.replace(/```json/gi,'').replace(/```/g,'').trim()
            if (clean[0]==='{') { const obj=JSON.parse(clean); clean=JSON.stringify(obj.faults||obj.results||obj.data||[]) }
            if (clean[0]!=='[') { const m=clean.match(/\[[\s\S]*\]/); clean=m?m[0]:'[]' }
            const parsed = JSON.parse(clean)
            faults = Array.isArray(parsed) ? parsed : []
            if (!faults.length && typeof parsed==='object' && parsed!==null) {
              Object.keys(parsed).forEach(k => { if (Array.isArray(parsed[k])&&parsed[k].length) faults=parsed[k] })
            }
          } catch(e) {
            try {
              const matches = raw.match(/\{[^{}]*"severity"[^{}]*\}/g)
              if (matches?.length) { faults = matches.map(s => { try{return JSON.parse(s)}catch{return null} }).filter(Boolean) }
              else { fail(ar ? 'تنسيق غير متوقع.' : 'Unexpected AI format.'); return }
            } catch { fail('Parse error: '+e.message); return }
          }
          const order = { high:0, medium:1, low:2 }
          faults.sort((a,b) => (order[a.severity]??3)-(order[b.severity]??3))
          setFaults(faults)
          setTimeout(() => setStep('done'), 300)
        })
        .catch(err => {
          clearInterval(tick)
          fail(err.message?.includes('fetch') ? (ar ? 'خطأ في الشبكة.' : 'Network error.') : 'Unexpected error: '+err.message)
        })
    }
    reader.readAsDataURL(imageFile)
  }

  if (step==='error') return (
    <div className="page-container" style={{ maxWidth: 640 }}>
      {previewUrl && <img src={previewUrl} alt="scan" style={{ width:'100%', maxHeight:160, objectFit:'cover', borderRadius:14, marginBottom:16, opacity:.5 }}/>}
      <GlassCard style={{ padding:24, border:'1.5px solid rgba(230,57,70,0.4)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
          <div style={{ width:40,height:40,borderRadius:12,background:'rgba(230,57,70,0.12)',display:'flex',alignItems:'center',justifyContent:'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01" strokeLinecap="round"/></svg>
          </div>
          <div style={{ fontSize:16, fontWeight:800, color:'var(--red)' }}>{ar ? 'فشل التحليل' : 'Analysis Failed'}</div>
        </div>
        <div style={{ background:'var(--bg-card2)', borderRadius:12, padding:14, marginBottom:16 }}>
          {(errorMsg||'Unknown error').split('\n').map((p,i) => <p key={i} style={{ fontSize:13,color:'var(--text-sec)',lineHeight:1.6,margin:i>0?'8px 0 0':0 }}>{p}</p>)}
        </div>
        {[
          ar?'تأكد من وجود api/diagnose.js في GitHub':'Ensure api/diagnose.js exists in GitHub repo',
          ar?'تحقق من ANTHROPIC_API_KEY في Vercel':'Verify ANTHROPIC_API_KEY in Vercel',
          ar?'تأكد من وجود رصيد في console.anthropic.com':'Check billing credit at console.anthropic.com',
          ar?'أعد النشر في Vercel بعد أي تغيير':'Redeploy on Vercel after any changes',
        ].map((tip,i) => (
          <div key={i} style={{ display:'flex',gap:8,alignItems:'flex-start',background:'rgba(230,57,70,0.06)',borderRadius:8,padding:'8px 10px',marginBottom:6 }}>
            <span style={{ color:'var(--red)',fontSize:11,flexShrink:0,marginTop:2,fontWeight:700 }}>{i+1}.</span>
            <span style={{ fontSize:12,color:'var(--text-sec)',lineHeight:1.5 }}>{tip}</span>
          </div>
        ))}
        <div style={{ display:'flex',gap:10,marginTop:16 }}>
          <button className="btn-primary" style={{ flex:1,borderRadius:12 }} onClick={() => { setErrorMsg(null); setStep('choose') }}>
            {ar?'حاول مجدداً':'Try Again'}
          </button>
          <button className="btn-ghost" style={{ flex:1 }} onClick={() => setTab('home')}>{ar?'الرئيسية':'Home'}</button>
        </div>
      </GlassCard>
    </div>
  )

  if (step==='done') return (
    <div className="page-container" style={{ maxWidth:640, textAlign:'center' }}>
      <div style={{ width:72,height:72,borderRadius:'50%',background:'rgba(45,212,191,0.12)',border:'2px solid rgba(45,212,191,0.4)',margin:'0 auto 20px',display:'flex',alignItems:'center',justifyContent:'center' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>
      </div>
      <div style={{ fontSize:22,fontWeight:800,color:'var(--text-pri)',marginBottom:8,fontFamily:"'Space Grotesk',sans-serif" }}>{ar?'اكتمل التحليل':'Analysis Complete'}</div>
      <div style={{ fontSize:14,color:'var(--text-sec)',marginBottom:28 }}>{ar?'جاهز لعرض التقرير الكامل':'Ready to view your full diagnostic report'}</div>
      {previewUrl && <img src={previewUrl} alt="scan" style={{ width:'100%',maxHeight:200,objectFit:'cover',borderRadius:16,marginBottom:24,border:'1px solid rgba(45,212,191,0.2)' }}/>}
      <div style={{ display:'flex',gap:10 }}>
        <button className="btn-primary" style={{ flex:1 }} onClick={() => setTab('report')}>{ar?'عرض التقرير':'View Report'} →</button>
        <button className="btn-ghost" onClick={() => setStep('vehicle')}>{ar?'مسح آخر':'New Scan'}</button>
      </div>
    </div>
  )

  if (step==='processing') return (
    <div className="page-container" style={{ maxWidth:480, textAlign:'center' }}>
      {previewUrl && (
        <div style={{ position:'relative',borderRadius:16,overflow:'hidden',marginBottom:28 }}>
          <img src={previewUrl} alt="scan" style={{ width:'100%',maxHeight:220,objectFit:'cover' }}/>
          <div style={{ position:'absolute',inset:0,background:'rgba(6,8,16,0.5)' }}>
            <div style={{ position:'absolute',left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,var(--red),transparent)',animation:'scanLine 2s linear infinite' }}/>
          </div>
        </div>
      )}
      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:16,fontWeight:700,color:'var(--text-pri)',marginBottom:20 }}>{ar?'جارٍ التحليل…':'Analyzing…'}</div>
        <div className="progress-track" style={{ marginBottom:8 }}>
          <div className="progress-fill" style={{ width:`${progress}%` }}/>
        </div>
        <div style={{ display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text-mut)' }}>
          <span>{STAGES[subStep][ar?'ar':'en']}</span><span>{progress}%</span>
        </div>
      </div>
      <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
        {STAGES.map((s,i) => (
          <div key={i} style={{ display:'flex',alignItems:'center',gap:12,padding:'10px 14px',borderRadius:12,background:i<=subStep?'rgba(230,57,70,0.06)':'rgba(255,255,255,0.02)',border:`1px solid ${i<=subStep?'rgba(230,57,70,0.2)':'var(--border)'}`,transition:'all .3s' }}>
            <div style={{ width:20,height:20,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,background:i<subStep?'rgba(45,212,191,0.15)':i===subStep?'rgba(230,57,70,0.15)':'transparent',border:`1px solid ${i<subStep?'rgba(45,212,191,0.4)':i===subStep?'rgba(230,57,70,0.4)':'var(--border)'}` }}>
              {i<subStep ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
               :i===subStep ? <div style={{ width:8,height:8,borderRadius:'50%',background:'var(--red)',animation:'pulseRed 1.5s infinite' }}/>
               :<div style={{ width:6,height:6,borderRadius:'50%',background:'var(--text-mut)' }}/>}
            </div>
            <span style={{ fontSize:13,color:i<=subStep?'var(--text-pri)':'var(--text-mut)',fontWeight:i===subStep?600:400 }}>{ar?s.ar:s.en}</span>
          </div>
        ))}
      </div>
    </div>
  )

  if (step==='camera') return (
    <div style={{ position:'relative',height:'calc(100dvh - var(--navbar-h) - var(--tabbar-h))' }}>
      <video ref={videoRef} playsInline muted style={{ width:'100%',height:'100%',objectFit:'cover',background:'#000' }}/>
      <div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',pointerEvents:'none' }}>
        <div style={{ width:260,height:180,border:'2px solid rgba(230,57,70,0.8)',borderRadius:12,boxShadow:'0 0 0 4000px rgba(0,0,0,0.45)',position:'relative' }}>
          {[['top','left'],['top','right'],['bottom','left'],['bottom','right']].map(([v,h]) => (
            <div key={v+h} style={{ position:'absolute',[v]:-2,[h]:-2,width:20,height:20,borderTop:v==='top'?'3px solid var(--red)':'none',borderBottom:v==='bottom'?'3px solid var(--red)':'none',borderLeft:h==='left'?'3px solid var(--red)':'none',borderRight:h==='right'?'3px solid var(--red)':'none' }}/>
          ))}
        </div>
      </div>
      <div style={{ position:'absolute',bottom:0,left:0,right:0,padding:'20px 24px',background:'linear-gradient(0deg,rgba(0,0,0,0.9) 0%,transparent 100%)',display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <button className="btn-ghost" style={{ padding:'10px 18px',fontSize:13 }} onClick={() => setStep('choose')}>{ar?'إلغاء':'Cancel'}</button>
        <button onClick={capturePhoto} style={{ width:72,height:72,borderRadius:'50%',background:'var(--red)',border:'4px solid rgba(255,255,255,0.3)',cursor:'pointer',boxShadow:'0 0 0 6px rgba(230,57,70,0.2)' }}/>
        <div style={{ width:80 }}/>
      </div>
    </div>
  )

  if (step==='choose') return (
    <div className="page-container" style={{ maxWidth:520 }}>
      <PageHeader title={ar?'رفع صورة الفحص':'Upload Scan Image'} sub={`${make} ${model} ${year}`} onBack={() => setStep('vehicle')} ar={ar}/>
      <div style={{ display:'flex',flexDirection:'column',gap:12,marginTop:8 }}>
        <UploadCard icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>}
          title={ar?'التقاط بالكاميرا':'Take Photo'} sub={ar?'صوّر ورقة الفحص مباشرةً':'Capture your inspection sheet directly'} onClick={() => setStep('camera')}/>
        <UploadCard icon={<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>}
          title={ar?'رفع من المعرض':'Upload from Gallery'} sub={ar?'اختر صورة موجودة':'Select an existing image — JPEG, PNG, WebP'} onClick={() => galleryRef.current?.click()}/>
      </div>
      <input ref={galleryRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleGallery}/>
      <div style={{ marginTop:20,padding:'14px 16px',background:'rgba(45,212,191,0.05)',border:'1px solid rgba(45,212,191,0.15)',borderRadius:12 }}>
        <div style={{ fontSize:12,color:'var(--text-sec)',lineHeight:1.7 }}>
          <strong style={{ color:'var(--teal)' }}>{ar?'نصيحة:':'Tip:'}</strong>{' '}
          {ar?'ضع الورقة على سطح مستوٍ وتأكد من وضوح النص.':'Place the sheet on a flat surface and ensure text is clearly visible.'}
        </div>
      </div>
    </div>
  )

  return (
    <div className="page-container" style={{ maxWidth:520 }}>
      <PageHeader title={ar?'تفاصيل السيارة':'Vehicle Details'} sub={ar?'أدخل بيانات سيارتك للتشخيص الدقيق':'Enter your vehicle details for accurate diagnosis'} ar={ar}/>
      <div style={{ display:'flex',flexDirection:'column',gap:16,marginTop:8 }}>
        <FieldGroup label={ar?'الصانع':'Make'}>
          <select value={make} onChange={e => { setMake(e.target.value); setModel(MODELS_MAP[e.target.value]?.[0]||'Select Model') }} style={{ width:'100%' }}>
            {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </FieldGroup>
        <FieldGroup label={ar?'الموديل':'Model'}>
          <select value={model} onChange={e => setModel(e.target.value)} style={{ width:'100%' }}>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </FieldGroup>
        <FieldGroup label={ar?'سنة الصنع':'Year'}>
          <select value={year} onChange={e => setYear(+e.target.value)} style={{ width:'100%' }}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </FieldGroup>
      </div>
      <div style={{ marginTop:20,padding:'14px 16px',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:14,display:'flex',gap:12,alignItems:'center' }}>
        <div style={{ width:42,height:42,borderRadius:12,background:'rgba(230,57,70,0.1)',border:'1px solid rgba(230,57,70,0.2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--red)" strokeWidth="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        </div>
        <div>
          <div style={{ fontSize:13,fontWeight:700,color:'var(--text-pri)',marginBottom:2 }}>{make} {model}</div>
          <div style={{ fontSize:12,color:'var(--text-sec)' }}>{year} · {ar?'جاهز للمسح':'Ready to scan'}</div>
        </div>
      </div>
      <button className="btn-primary" style={{ width:'100%',marginTop:20,padding:'15px',fontSize:15 }} onClick={() => setStep('choose')}>
        {ar?'التالي — رفع الصورة':'Next — Upload Image'} →
      </button>
    </div>
  )
}

function PageHeader({ title, sub, onBack, ar }) {
  return (
    <div style={{ marginBottom:24 }}>
      {onBack && (
        <button onClick={onBack} style={{ background:'none',border:'none',display:'flex',alignItems:'center',gap:6,color:'var(--text-mut)',fontSize:13,cursor:'pointer',padding:'0 0 16px',fontWeight:600 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          {ar?'رجوع':'Back'}
        </button>
      )}
      <div style={{ fontSize:22,fontWeight:800,color:'var(--text-pri)',fontFamily:"'Space Grotesk',sans-serif",letterSpacing:'-0.02em',marginBottom:4 }}>{title}</div>
      {sub && <div style={{ fontSize:13,color:'var(--text-sec)' }}>{sub}</div>}
    </div>
  )
}
function FieldGroup({ label, children }) {
  return <div><div className="label-upper" style={{ marginBottom:8 }}>{label}</div>{children}</div>
}
function UploadCard({ icon, title, sub, onClick }) {
  return (
    <button onClick={onClick} style={{ display:'flex',alignItems:'center',gap:16,width:'100%',background:'var(--bg-card)',border:'1px solid var(--border)',borderRadius:18,padding:'20px 18px',cursor:'pointer',textAlign:'left',transition:'all .2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(230,57,70,0.4)'; e.currentTarget.style.background='rgba(230,57,70,0.04)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.background='var(--bg-card)' }}>
      <div style={{ width:52,height:52,borderRadius:14,background:'rgba(230,57,70,0.08)',border:'1px solid rgba(230,57,70,0.2)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--red)',flexShrink:0 }}>{icon}</div>
      <div>
        <div style={{ fontSize:15,fontWeight:700,color:'var(--text-pri)',marginBottom:4 }}>{title}</div>
        <div style={{ fontSize:12,color:'var(--text-sec)' }}>{sub}</div>
      </div>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-mut)" strokeWidth="2" style={{ marginLeft:'auto',flexShrink:0 }}><path d="M9 18l6-6-6-6"/></svg>
    </button>
  )
}
