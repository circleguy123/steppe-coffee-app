import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { graphqlQuery } from '../graphql/client'

export default function Events() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    setLoading(true)
    const res = await graphqlQuery(`
      query {
        adminEvents {
          id
          title
          description
          eventDate
          eventLength
          ticketsNumber
          price
          location
          isArchived
        }
      }
    `)
    setEvents(res.data?.adminEvents ?? [])
    setLoading(false)
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Events</h1>
        <button style={styles.refreshButton} onClick={fetchEvents}>Refresh</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <div style={styles.empty}><p>No events yet</p></div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Event</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Tickets</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} style={styles.tr}>
                <td style={styles.td}>
                  <strong>{event.title}</strong>
                  <br />
                  <span style={{ fontSize: 12, color: '#666' }}>{event.description?.slice(0, 50)}</span>
                </td>
                <td style={styles.td}>
                  {format(new Date(event.eventDate), 'MMM d, yyyy')}
                  <br />
                  <span style={{ fontSize: 12, color: '#666' }}>{format(new Date(event.eventDate), 'HH:mm')}</span>
                </td>
                <td style={styles.td}>{event.location || '-'}</td>
                <td style={styles.td}>{event.ticketsNumber}</td>
                <td style={styles.td}>{event.price > 0 ? `${event.price} ₸` : 'Free'}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: event.isArchived ? '#f44336' : '#4CAF50' }}>
                    {event.isArchived ? 'Archived' : 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
  badge: { padding: '4px 10px', borderRadius: 4, color: '#fff', fontSize: 12, fontWeight: 500 },
}