import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { graphqlQuery } from '../graphql/client'

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', message: '', type: 'info', imageUrl: '', linkUrl: '' })

  useEffect(() => {
    fetchAnnouncements()
  }, [])

  async function fetchAnnouncements() {
    setLoading(true)
    const res = await graphqlQuery(`
      query { 
        adminAnnouncements { 
          id title message type imageUrl linkUrl isActive expiresAt createdAt 
        } 
      }
    `)
    setAnnouncements(res.data?.adminAnnouncements ?? [])
    setLoading(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    await graphqlQuery(`
      mutation CreateAnnouncement($input: CreateAnnouncementInput!) {
        createAnnouncement(input: $input) { id }
      }
    `, { input: form })
    setForm({ title: '', message: '', type: 'info', imageUrl: '', linkUrl: '' })
    setShowForm(false)
    fetchAnnouncements()
  }

  async function handleToggle(id: string, isActive: boolean) {
    await graphqlQuery(`
      mutation UpdateAnnouncement($id: String!, $input: UpdateAnnouncementInput!) {
        updateAnnouncement(id: $id, input: $input) { id }
      }
    `, { id, input: { isActive: !isActive } })
    fetchAnnouncements()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this announcement?')) return
    await graphqlQuery(`mutation { deleteAnnouncement(id: "${id}") }`)
    fetchAnnouncements()
  }

  const typeColors: { [key: string]: string } = {
    info: '#2196F3',
    promo: '#4CAF50',
    alert: '#f44336',
    event: '#FF9800',
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Announcements</h1>
        <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Announcement'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Title *</label>
              <input
                style={styles.input}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Type</label>
              <select
                style={styles.input}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="info">Info</option>
                <option value="promo">Promo</option>
                <option value="alert">Alert</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Message *</label>
              <textarea
                style={{ ...styles.input, minHeight: 80 }}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Image URL (optional)</label>
              <input
                style={styles.input}
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Link URL (optional)</label>
              <input
                style={styles.input}
                value={form.linkUrl}
                onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <button type="submit" style={styles.submitButton}>Create Announcement</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : announcements.length === 0 ? (
        <div style={styles.empty}>
          <p>No announcements yet</p>
          <p style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
            Announcements will appear on the app home screen
          </p>
        </div>
      ) : (
        <div style={styles.grid}>
          {announcements.map((item) => (
            <div key={item.id} style={{ ...styles.card, opacity: item.isActive ? 1 : 0.6 }}>
              <div style={styles.cardHeader}>
                <span style={{ ...styles.typeBadge, backgroundColor: typeColors[item.type] || '#999' }}>
                  {item.type}
                </span>
                <span style={{ ...styles.statusBadge, backgroundColor: item.isActive ? '#4CAF50' : '#999' }}>
                  {item.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <h3 style={styles.cardTitle}>{item.title}</h3>
              <p style={styles.cardMessage}>{item.message}</p>
              
              {item.imageUrl && (
                <img src={item.imageUrl} alt="" style={styles.cardImage} />
              )}
              
              <div style={styles.cardFooter}>
                <span style={{ fontSize: 12, color: '#666' }}>
                  {format(new Date(item.createdAt), 'MMM d, yyyy')}
                </span>
                <div style={styles.cardActions}>
                  <button 
                    style={styles.toggleButton}
                    onClick={() => handleToggle(item.id, item.isActive)}
                  >
                    {item.isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button 
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, color: '#1a1a1a' },
  addButton: { backgroundColor: '#4CAF50', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' },
  form: { backgroundColor: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 14, fontWeight: 600 },
  input: { padding: 12, borderRadius: 6, border: '1px solid #ddd', fontSize: 14 },
  submitButton: { backgroundColor: '#FED100', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: 48, backgroundColor: '#fff', borderRadius: 8, color: '#666' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 12 },
  typeBadge: { padding: '4px 10px', borderRadius: 4, color: '#fff', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' },
  statusBadge: { padding: '4px 10px', borderRadius: 4, color: '#fff', fontSize: 11, fontWeight: 600 },
  cardTitle: { fontSize: 18, fontWeight: 600, margin: '0 0 8px 0', color: '#1a1a1a' },
  cardMessage: { fontSize: 14, color: '#666', margin: '0 0 12px 0', lineHeight: 1.5 },
  cardImage: { width: '100%', height: 120, objectFit: 'cover', borderRadius: 6, marginBottom: 12 },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #eee' },
  cardActions: { display: 'flex', gap: 8 },
  toggleButton: { backgroundColor: '#fff', border: '1px solid #ddd', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
  deleteBtn: { backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
}