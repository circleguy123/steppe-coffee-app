import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { graphqlQuery } from '../graphql/client'

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    setLoading(true)
    try {
      const res = await graphqlQuery(`
        query {
          adminBookings {
            id
            tableNumber
            date
            timeSlot
            partySize
            status
            notes
            user { name phone }
          }
        }
      `)
      setBookings(res.data?.adminBookings ?? [])
    } catch (e) {
      console.log('Error fetching bookings:', e)
    }
    setLoading(false)
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'confirmed': return { backgroundColor: '#4CAF50' }
      case 'pending': return { backgroundColor: '#FF9800' }
      case 'cancelled': return { backgroundColor: '#f44336' }
      default: return { backgroundColor: '#999' }
    }
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Table Bookings</h1>
        <button style={styles.refreshButton} onClick={fetchBookings}>Refresh</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <div style={styles.empty}>
          <p>No bookings yet</p>
          <p style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
            Bookings from the app will appear here
          </p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Table</th>
              <th style={styles.th}>Date & Time</th>
              <th style={styles.th}>Guest</th>
              <th style={styles.th}>Party Size</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} style={styles.tr}>
                <td style={styles.td}><strong>Table {booking.tableNumber}</strong></td>
                <td style={styles.td}>
                  {format(new Date(booking.date), 'MMM d, yyyy')}
                  <br />
                  <span style={{ fontSize: 12, color: '#666' }}>{booking.timeSlot}</span>
                </td>
                <td style={styles.td}>
                  {booking.user?.name ?? 'Unknown'}
                  <br />
                  <span style={{ fontSize: 12, color: '#666' }}>{booking.user?.phone}</span>
                </td>
                <td style={styles.td}>{booking.partySize} guests</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, ...getStatusStyle(booking.status) }}>
                    {booking.status}
                  </span>
                </td>
                <td style={styles.td}>{booking.notes || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Table Overview</h2>
        <div style={styles.tableGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((table) => (
            <div key={table} style={styles.tableCard}>
              <div style={styles.tableHeader}>Table {table}</div>
              <div style={styles.tableStatus}>Available</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, color: '#1a1a1a' },
  refreshButton: { backgroundColor: '#FED100', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: 48, backgroundColor: '#fff', borderRadius: 8, color: '#666' },
  table: { width: '100%', backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: 14, backgroundColor: '#f9f9f9', fontWeight: 600, fontSize: 13, color: '#333', borderBottom: '1px solid #eee' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: 14, fontSize: 14 },
  badge: { padding: '4px 10px', borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 500, textTransform: 'capitalize' },
  section: { marginTop: 48 },
  sectionTitle: { fontSize: 18, fontWeight: 600, marginBottom: 16, color: '#1a1a1a' },
  tableGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 },
  tableCard: { backgroundColor: '#fff', borderRadius: 8, padding: 16, textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  tableHeader: { fontWeight: 600, marginBottom: 6, fontSize: 14 },
  tableStatus: { fontSize: 13, color: '#4CAF50' },
}