import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import Bookings from './pages/Bookings'
import Communities from './pages/Communities'
import Users from './pages/Users'

const navItems = [
  { path: '/', label: 'Dashboard' },
  { path: '/events', label: 'Events' },
  { path: '/bookings', label: 'Bookings' },
  { path: '/communities', label: 'Communities' },
  { path: '/users', label: 'Users' },
]

function App() {
  const location = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <nav style={styles.sidebar}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>S</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>Steppe Admin</span>
        </div>
        
        <div style={styles.navList}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                backgroundColor: location.pathname === item.path ? '#FED100' : 'transparent',
                color: location.pathname === item.path ? '#1a1a1a' : '#fff',
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div style={styles.sidebarFooter}>
          <div style={{ fontSize: 12, color: '#666' }}>Steppe Coffee</div>
          <div style={{ fontSize: 11, color: '#555' }}>Admin Panel v1.0</div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: 220,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 40,
    paddingBottom: 20,
    borderBottom: '1px solid #333',
  },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#FED100',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    color: '#1a1a1a',
  },
  navList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1,
  },
  navItem: {
    display: 'block',
    padding: '12px 16px',
    borderRadius: 6,
    color: '#fff',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s',
  },
  sidebarFooter: {
    paddingTop: 20,
    borderTop: '1px solid #333',
  },
  main: {
    flex: 1,
    padding: 32,
    backgroundColor: '#f5f5f5',
    overflowY: 'auto',
  },
}

export default App