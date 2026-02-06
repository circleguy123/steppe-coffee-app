import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import Bookings from './pages/Bookings'
import Communities from './pages/Communities'
import Users from './pages/Users'
import Baristas from './pages/Baristas'
import Announcements from './pages/Announcements'
import Staff from './pages/Staff'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Menu from './pages/Menu'
import Analytics from './pages/Analytics'

const allNavItems = [
  { path: '/', label: 'Dashboard', key: 'dashboard' },
  { path: '/menu', label: 'Menu', key: 'menu' },
  { path: '/orders', label: 'Orders', key: 'orders' },
  { path: '/events', label: 'Events', key: 'events' },
  { path: '/bookings', label: 'Bookings', key: 'bookings' },
  { path: '/communities', label: 'Communities', key: 'communities' },
  { path: '/users', label: 'Customers', key: 'users' },
  { path: '/baristas', label: 'Baristas', key: 'baristas' },
  { path: '/staff', label: 'Staff', key: 'staff' },
  { path: '/announcements', label: 'Announcements', key: 'announcements' },
  { path: '/analytics', label: 'Analytics', key: 'analytics' },
]

const rolePermissions: Record<string, string[]> = {
  super_admin: ['dashboard', 'menu', 'orders', 'events', 'bookings', 'communities', 'users', 'baristas', 'staff', 'announcements', 'analytics'],
  manager: ['dashboard', 'menu', 'orders', 'events', 'bookings', 'communities', 'users', 'baristas', 'announcements', 'analytics'],
  accountant: ['dashboard', 'menu', 'orders', 'users', 'analytics'],
  marketer: ['dashboard', 'menu', 'events', 'users', 'announcements', 'analytics'],
  chief_barista: ['dashboard', 'menu', 'events', 'analytics'],
}

function App() {
  const location = useLocation()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminRole, setAdminRole] = useState<string>('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const role = localStorage.getItem('admin_role')
    if (token && role) {
      setIsAuthenticated(true)
      setAdminRole(role)
    }
  }, [])

  const handleLogin = (role: string) => {
    setIsAuthenticated(true)
    setAdminRole(role)
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_role')
    localStorage.removeItem('admin_user')
    setIsAuthenticated(false)
    setAdminRole('')
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />
  }

  const allowedKeys = rolePermissions[adminRole] || []
  const navItems = allNavItems.filter(item => allowedKeys.includes(item.key))

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
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
          <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
            Role: {adminRole.replace('_', ' ').toUpperCase()}
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>
      </nav>

      <main style={styles.main}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/events" element={<Events />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/users" element={<Users />} />
          <Route path="/baristas" element={<Baristas />} />
          <Route path="/staff" element={<Staff />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/analytics" element={<Analytics />} />
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
  logoutButton: {
    width: '100%',
    padding: 10,
    backgroundColor: 'transparent',
    border: '1px solid #444',
    borderRadius: 6,
    color: '#fff',
    fontSize: 14,
    cursor: 'pointer',
  },
  main: {
    flex: 1,
    padding: 32,
    backgroundColor: '#f5f5f5',
    overflowY: 'auto',
  },
}

export default App
