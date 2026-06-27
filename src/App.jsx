import { useState } from 'react'
import Navbar from './components/Navbar.jsx'
import TabBar from './components/TabBar.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import ScanScreen from './screens/ScanScreen.jsx'
import ReportScreen from './screens/ReportScreen.jsx'
import GaragesScreen from './screens/GaragesScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'

const defaultProfile = { name: '', avatar: 7 }

function loadProfile() {
  try { const s = localStorage.getItem('asc_profile'); return s ? JSON.parse(s) : defaultProfile }
  catch { return defaultProfile }
}
function loadFaults() {
  try { const s = localStorage.getItem('asc_faults'); return s ? JSON.parse(s) : [] }
  catch { return [] }
}

export default function App() {
  const [tab, setTab] = useState('home')
  const [ar, setAr] = useState(false)
  const [faults, setFaultsState] = useState(loadFaults)
  const [profile, setProfileState] = useState(loadProfile)

  function setFaults(f) {
    setFaultsState(f)
    try { localStorage.setItem('asc_faults', JSON.stringify(f)) } catch {}
  }
  function setProfile(p) {
    setProfileState(p)
    try { localStorage.setItem('asc_profile', JSON.stringify(p)) } catch {}
  }

  const screens = {
    home:    <HomeScreen    setTab={setTab} ar={ar} faults={faults} profile={profile} />,
    scan:    <ScanScreen    setTab={setTab} ar={ar} setFaults={setFaults} />,
    report:  <ReportScreen  ar={ar} faults={faults} setTab={setTab} />,
    garages: <GaragesScreen ar={ar} />,
    profile: <ProfileScreen ar={ar} setAr={setAr} profile={profile} setProfile={setProfile} />,
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', direction: ar ? 'rtl' : 'ltr' }}>
      <Navbar ar={ar} setAr={setAr} tab={tab} setTab={setTab} />
      <main className="main-content">{screens[tab]}</main>
      <TabBar tab={tab} setTab={setTab} ar={ar} />
    </div>
  )
}
