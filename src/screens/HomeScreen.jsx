import { useRef, useEffect, useState } from 'react'
import { RevealCard } from '../components/GlassCard.jsx'
import { FEATURES } from '../theme.js'

export default function HomeScreen({ setTab, ar, faults, profile }) {
  const videoRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  const high = faults.filter(f => f.severity === 'high').length
  const med  = faults.filter(f => f.severity === 'medium').length
  const low  = faults.filter(f => f.severity === 'low').length
  const hasData = faults.length > 0

  useEffect(() => { videoRef.current?.play().catch(() => {}) }, [])

  return (
    <div>
      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: 'linear-gradient(180deg, #060810 0%, #0D1421 100%)' }}>
          <video ref={videoRef} src="/hero.mp4" muted loop playsInline autoPlay
            onCanPlay={() => setVideoLoaded(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: videoLoaded ? 0.35 : 0, transition: 'opacity 1.2s ease', filter: 'saturate(1.2)' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,8,16,0.5) 0%, rgba(6,8,16,0.25) 50%, rgba(6,8,16,0.97) 100%)' }}/>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 100%, rgba(230,57,70,0.07) 0%, transparent 65%)' }}/>
        </div>

        <div style={{
          position: 'relative', zIndex: 1,
          maxWidth: 960, margin: '0 auto',
          padding: '64px 24px 56px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', minHeight: 390,
        }}>
          <div className="ring-badge animate-fade-up" style={{ marginBottom: 24 }}>
            <div className="dot" />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--red)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {ar ? 'مدعوم بالذكاء الاصطناعي' : 'AI-Powered Diagnostics'}
            </span>
          </div>

          <h1 className="animate-fade-up" style={{
            fontSize: 'clamp(32px, 6vw, 62px)', fontWeight: 900, lineHeight: 1.06,
            letterSpacing: '-0.03em', color: 'var(--text-pri)', marginBottom: 8,
            fontFamily: "'Space Grotesk', sans-serif",
            animationDelay: '80ms', animationFillMode: 'both',
          }}>
            {ar ? 'سيارتك تحت المجهر' : 'Your Car,'}
          </h1>
          <h1 className="animate-fade-up" style={{
            fontSize: 'clamp(32px, 6vw, 62px)', fontWeight: 900, lineHeight: 1.06,
            letterSpacing: '-0.03em',
            background: 'linear-gradient(135deg, var(--red), #FF6B7A)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: 22, fontFamily: "'Space Grotesk', sans-serif",
            animationDelay: '150ms', animationFillMode: 'both',
          }}>
            {ar ? 'تخضع للتشخيص الفوري' : 'Diagnosed Instantly.'}
          </h1>

          <p className="animate-fade-up" style={{
            fontSize: 15, lineHeight: 1.75, color: 'var(--text-sec)',
            maxWidth: 480, marginBottom: 36,
            animationDelay: '210ms', animationFillMode: 'both',
          }}>
            {ar
              ? 'ارفع صورة ورقة الفحص واحصل على تشخيص كامل فوري بالذكاء الاصطناعي'
              : 'Upload your OBD-II scan or take a photo and get a complete AI diagnosis with repair costs in seconds.'}
          </p>

          <div className="animate-fade-up" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', animationDelay: '280ms', animationFillMode: 'both' }}>
            <button className="btn-primary" onClick={() => setTab('scan')} style={{ fontSize: 15, padding: '14px 32px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2.5"/>
                <path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              {ar ? 'مسح الآن' : 'Scan Now'}
            </button>
            {hasData && (
              <button className="btn-ghost" onClick={() => setTab('report')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                {ar ? 'عرض التقرير' : 'View Report'}
              </button>
            )}
          </div>

          <div className="animate-fade-up" style={{ display: 'flex', gap: 36, marginTop: 48, animationDelay: '360ms', animationFillMode: 'both' }}>
            {[
              { val: '< 30s', label: ar ? 'وقت التشخيص' : 'Diagnosis Time' },
              { val: '10+',   label: ar ? 'مناطق الفحص' : 'Inspection Zones' },
              { val: '100%',  label: ar ? 'ذكاء اصطناعي' : 'AI-Powered' },
            ].map(s => (
              <div key={s.val} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-pri)', fontFamily: "'Space Grotesk', sans-serif", letterSpacing: '-0.03em' }}>{s.val}</div>
                <div style={{ fontSize: 10, color: 'var(--text-mut)', fontWeight: 600, marginTop: 2, letterSpacing: '0.04em' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="page-container" style={{ paddingTop: 20 }}>

        {/* Last report */}
        {hasData && (
          <RevealCard style={{ padding: 20, marginBottom: 28 }}>
            <div className="label-upper" style={{ marginBottom: 14 }}>{ar ? 'آخر تقرير' : 'Last Report'}</div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[
                { count: high, label: ar ? 'حرج' : 'Critical',  c: 'var(--red)',   bg: 'var(--crit-bg)', bd: 'rgba(230,57,70,0.25)' },
                { count: med,  label: ar ? 'متوسط' : 'Moderate', c: 'var(--amber)', bg: 'var(--med-bg)',  bd: 'rgba(245,158,11,0.25)' },
                { count: low,  label: ar ? 'منخفض' : 'Minor',    c: 'var(--teal)',  bg: 'var(--low-bg)',  bd: 'rgba(45,212,191,0.25)' },
              ].map(item => (
                <div key={item.label} style={{ flex: 1, background: item.bg, borderRadius: 14, padding: '14px 8px', textAlign: 'center', border: `1px solid ${item.bd}` }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: item.c, fontFamily: "'Space Grotesk', sans-serif" }}>{item.count}</div>
                  <div style={{ fontSize: 10, color: item.c, fontWeight: 700, marginTop: 2, letterSpacing: '0.04em' }}>{item.label}</div>
                </div>
              ))}
            </div>
            {high > 0 && (
              <div style={{ background: 'var(--crit-bg)', border: '1px solid rgba(230,57,70,0.3)', borderRadius: 12, padding: '10px 14px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4m0 4h.01" stroke="var(--red)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span style={{ fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.6 }}>
                  {ar ? `${high} عطل حرج — لا تقد السيارة` : `${high} critical fault(s) detected — do not drive.`}
                </span>
              </div>
            )}
            <button className="btn-primary" style={{ width: '100%', borderRadius: 12 }} onClick={() => setTab('report')}>
              {ar ? 'عرض التقرير الكامل' : 'View Full Report'} →
            </button>
          </RevealCard>
        )}

        {/* Features */}
        <div>
          <div className="label-upper" style={{ marginBottom: 16 }}>{ar ? 'الميزات' : 'Features'}</div>
          <div className="grid-features">
            {FEATURES.map((f, i) => (
              <RevealCard key={f.en} delay={i * 70} style={{ padding: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-pri)', marginBottom: 6 }}>{ar ? f.ar : f.en}</div>
                <div style={{ fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.65 }}>{ar ? f.subAr : f.sub}</div>
              </RevealCard>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div style={{ marginTop: 40 }}>
          <div className="label-upper" style={{ marginBottom: 16 }}>{ar ? 'كيف يعمل' : 'How It Works'}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { n:'01', en:'Select Your Vehicle', ar:'اختر سيارتك', sub:'Enter your vehicle make, model, and year for accurate AI diagnosis.', subAr:'أدخل نوع ونموذج وسنة سيارتك للحصول على تشخيص دقيق.' },
              { n:'02', en:'Upload or Capture',   ar:'ارفع أو التقط', sub:'Upload your OBD scan image or take a photo with your camera.', subAr:'ارفع صورة الفحص أو التقط صورة بكاميرتك.' },
              { n:'03', en:'Get AI Analysis',     ar:'احصل على التحليل', sub:'Claude AI reads every fault and delivers a full diagnostic report instantly.', subAr:'يقرأ الذكاء الاصطناعي كل عطل ويقدم تقريراً تشخيصياً كاملاً فوراً.' },
            ].map((step, i) => (
              <RevealCard key={step.n} delay={i * 90} style={{ padding: '18px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', fontSize: 12, fontWeight: 900, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {step.n}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-pri)', marginBottom: 4 }}>{ar ? step.ar : step.en}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-sec)', lineHeight: 1.65 }}>{ar ? step.subAr : step.sub}</div>
                </div>
              </RevealCard>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 44, textAlign: 'center', paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 12, color: 'var(--text-mut)', lineHeight: 1.8 }}>
            {ar ? 'AutoScan AI — تشخيص ذكي للسيارات · مدعوم بـ Claude AI' : 'AutoScan AI — Intelligent Vehicle Diagnostics · Powered by Claude AI'}
          </div>
        </div>
      </div>
    </div>
  )
}
