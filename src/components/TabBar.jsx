const TABS = [
  { id: 'home',    iconPath: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', en: 'Home',    ar: 'الرئيسية' },
  { id: 'scan',    iconPath: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', en: 'Scan',    ar: 'مسح' },
  { id: 'report',  iconPath: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',  en: 'Report',  ar: 'التقرير' },
  { id: 'garages', iconPath: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', en: 'Garages', ar: 'الورش' },
  { id: 'profile', iconPath: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',  en: 'Profile', ar: 'الحساب' },
]

export default function TabBar({ tab, setTab, ar }) {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
      height: 'var(--tabbar-h)',
      background: 'rgba(6,8,16,0.95)',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid var(--border)',
      display: 'flex', alignItems: 'stretch',
    }}>
      {TABS.map(t => {
        const active = tab === t.id
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 3,
            color: active ? 'var(--red)' : 'var(--text-mut)',
            transition: 'color .2s', padding: '8px 0',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: active ? 'rgba(230,57,70,0.12)' : 'transparent',
              transition: 'background .2s', marginBottom: 1,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={t.iconPath} />
              </svg>
            </div>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.03em' }}>
              {ar ? t.ar : t.en}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
