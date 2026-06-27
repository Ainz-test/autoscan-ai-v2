export default function Navbar({ ar, setAr, tab, setTab }) {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 'var(--navbar-h)',
      background: 'rgba(6,8,16,0.88)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
        onClick={() => setTab('home')}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, var(--red), var(--red-dark))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(230,57,70,0.45)', flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2.5"/>
            <path d="M3 7V4h3M21 7V4h-3M3 17v3h3M21 17v3h-3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-pri)', letterSpacing: '-0.02em', lineHeight: 1.1, fontFamily: "'Space Grotesk', sans-serif" }}>
            AutoScan
          </div>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--red)', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>
            AI
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <button
        onClick={() => setAr(!ar)}
        style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 700,
          color: 'var(--text-sec)', cursor: 'pointer', transition: 'all .2s',
        }}
      >
        {ar ? 'EN' : 'عربي'}
      </button>
    </header>
  )
}
