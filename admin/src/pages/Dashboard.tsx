import { useEffect, useState } from 'react'
import { graphqlQuery } from '../graphql/client'

export default function Dashboard() {
  const [stats, setStats] = useState({ events: 0, communities: 0, bookings: 0, users: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await graphqlQuery(`query { adminStats { events communities bookings users } }`)
        if (res.data?.adminStats) {
          setStats(res.data.adminStats)
        }
      } catch (e) {
        console.error(e)
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  const statCards = [
    { label: 'Total Events', value: stats.events, color: '#4CAF50' },
    { label: 'Communities', value: stats.communities, color: '#2196F3' },
    { label: 'Table Bookings', value: stats.bookings, color: '#FF9800' },
    { label: 'Users', value: stats.users, color: '#9C27B0' },
  ]

  return (
    <div>
      <h1 style={styles.title}>Dashboard</h1>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.statsGrid}>
          {statCards.map((stat) => (
            <div key={stat.label} style={{ ...styles.statCard, borderLeft: `4px solid ${stat.color}` }}>
              <div style={styles.statValue}>{stat.value}</div>
              <div style={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          <a href="/events" style={styles.actionCard}>
            <span style={styles.actionIcon}>+</span>
            <span>Manage Events</span>
          </a>
          <a href="/bookings" style={styles.actionCard}>
            <span style={styles.actionIcon}>◫</span>
            <span>View Bookings</span>
          </a>
          <a href="/communities" style={styles.actionCard}>
            <span style={styles.actionIcon}>⊕</span>
            <span>Communities</span>
          </a>
          <a href="/users" style={styles.actionCard}>
            <span style={styles.actionIcon}>◉</span>
            <span>Users</span>
          </a>
        </div>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  title: { fontSize: 28, fontWeight: 700, marginBottom: 32, color: '#1a1a1a' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 48 },
  statCard: { backgroundColor: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  statValue: { fontSize: 32, fontWeight: 700, marginBottom: 4, color: '#1a1a1a' },
  statLabel: { fontSize: 14, color: '#666' },
  section: { marginTop: 32 },
  sectionTitle: { fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#1a1a1a' },
  actionsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 },
  actionCard: { backgroundColor: '#FED100', borderRadius: 8, padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', textDecoration: 'none', color: '#1a1a1a', fontWeight: 500 },
  actionIcon: { fontSize: 24, fontWeight: 700 },
}