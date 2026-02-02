import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { graphqlQuery } from '../graphql/client'

export default function Events() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    eventLength: '',
    ticketsNumber: 50,
    price: 0,
    location: 'Steppe Coffee',
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    setLoading(true)
    const res = await graphqlQuery(`
      query { 
        adminEvents { 
          id title description eventDate eventLength ticketsNumber price location isArchived 
        } 
      }
    `)
    setEvents(res.data?.adminEvents ?? [])
    setLoading(false)
  }

  function resetForm() {
    setForm({
      title: '',
      description: '',
      eventDate: '',
      eventTime: '',
      eventLength: '',
      ticketsNumber: 50,
      price: 0,
      location: 'Steppe Coffee',
    })
    setEditingId(null)
    setShowForm(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const eventDateTime = new Date(`${form.eventDate}T${form.eventTime || '19:00'}`)
    
    if (editingId) {
      await graphqlQuery(`
        mutation UpdateEvent($id: String!, $title: String!, $description: String, $eventDate: DateTime!, $eventLength: String, $ticketsNumber: Int!, $price: Int!, $location: String) {
          updateEvent(id: $id, title: $title, description: $description, eventDate: $eventDate, eventLength: $eventLength, ticketsNumber: $ticketsNumber, price: $price, location: $location) { id }
        }
      `, {
        id: editingId,
        title: form.title,
        description: form.description,
        eventDate: eventDateTime.toISOString(),
        eventLength: form.eventLength,
        ticketsNumber: form.ticketsNumber,
        price: form.price,
        location: form.location,
      })
    } else {
      await graphqlQuery(`
        mutation CreateEvent($title: String!, $description: String, $eventDate: DateTime!, $eventLength: String, $ticketsNumber: Int!, $price: Int!, $location: String) {
          createEvent(title: $title, description: $description, eventDate: $eventDate, eventLength: $eventLength, ticketsNumber: $ticketsNumber, price: $price, location: $location) { id }
        }
      `, {
        title: form.title,
        description: form.description,
        eventDate: eventDateTime.toISOString(),
        eventLength: form.eventLength,
        ticketsNumber: form.ticketsNumber,
        price: form.price,
        location: form.location,
      })
    }
    
    resetForm()
    fetchEvents()
  }

  function handleEdit(event: any) {
    const date = new Date(event.eventDate)
    setForm({
      title: event.title,
      description: event.description || '',
      eventDate: format(date, 'yyyy-MM-dd'),
      eventTime: format(date, 'HH:mm'),
      eventLength: event.eventLength || '',
      ticketsNumber: event.ticketsNumber,
      price: event.price,
      location: event.location || '',
    })
    setEditingId(event.id)
    setShowForm(true)
  }

  async function handleArchive(id: string, isArchived: boolean) {
    await graphqlQuery(`
      mutation ArchiveEvent($id: String!, $isArchived: Boolean!) {
        archiveEvent(id: $id, isArchived: $isArchived) { id }
      }
    `, { id, isArchived: !isArchived })
    fetchEvents()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this event permanently?')) return
    await graphqlQuery(`mutation { deleteEvent(id: "${id}") }`)
    fetchEvents()
  }

  const upcomingEvents = events.filter(e => !e.isArchived && new Date(e.eventDate) >= new Date())
  const pastEvents = events.filter(e => e.isArchived || new Date(e.eventDate) < new Date())

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Events</h1>
        <button style={styles.addButton} onClick={() => { resetForm(); setShowForm(!showForm) }}>
          {showForm ? 'Cancel' : '+ Create Event'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h3 style={{ margin: '0 0 16px 0' }}>{editingId ? 'Edit Event' : 'New Event'}</h3>
          <div style={styles.formGrid}>
            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Title *</label>
              <input
                style={styles.input}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Event name"
                required
              />
            </div>
            <div style={{ ...styles.field, gridColumn: '1 / -1' }}>
              <label style={styles.label}>Description</label>
              <textarea
                style={{ ...styles.input, minHeight: 80 }}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Event description"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Date *</label>
              <input
                type="date"
                style={styles.input}
                value={form.eventDate}
                onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Time *</label>
              <input
                type="time"
                style={styles.input}
                value={form.eventTime}
                onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Duration</label>
              <input
                style={styles.input}
                value={form.eventLength}
                onChange={(e) => setForm({ ...form, eventLength: e.target.value })}
                placeholder="e.g. 2 hours"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Location</label>
              <input
                style={styles.input}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Steppe Coffee"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Tickets Available *</label>
              <input
                type="number"
                style={styles.input}
                value={form.ticketsNumber}
                onChange={(e) => setForm({ ...form, ticketsNumber: parseInt(e.target.value) || 0 })}
                min={0}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Price (KZT)</label>
              <input
                type="number"
                style={styles.input}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: parseInt(e.target.value) || 0 })}
                min={0}
              />
            </div>
          </div>
          <button type="submit" style={styles.submitButton}>
            {editingId ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : events.length === 0 ? (
        <div style={styles.empty}>
          <p>No events yet</p>
          <p style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
            Create your first event to get started
          </p>
        </div>
      ) : (
        <>
          {upcomingEvents.length > 0 && (
            <>
              <h3 style={{ marginBottom: 16 }}>Upcoming Events</h3>
              <div style={styles.grid}>
                {upcomingEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onEdit={handleEdit}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </>
          )}
          
          {pastEvents.length > 0 && (
            <>
              <h3 style={{ margin: '32px 0 16px 0', color: '#666' }}>Past / Archived Events</h3>
              <div style={styles.grid}>
                {pastEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onEdit={handleEdit}
                    onArchive={handleArchive}
                    onDelete={handleDelete}
                    isPast
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

function EventCard({ event, onEdit, onArchive, onDelete, isPast }: any) {
  return (
    <div style={{ ...styles.card, opacity: isPast ? 0.7 : 1 }}>
      <div style={styles.cardDate}>
        {format(new Date(event.eventDate), 'MMM d, yyyy • HH:mm')}
      </div>
      <h3 style={styles.cardTitle}>{event.title}</h3>
      {event.description && (
        <p style={styles.cardDesc}>{event.description}</p>
      )}
      <div style={styles.cardMeta}>
        <span>{event.ticketsNumber} tickets</span>
        <span>•</span>
        <span>{event.price > 0 ? `${event.price} KZT` : 'Free'}</span>
        {event.location && <><span>•</span><span>{event.location}</span></>}
      </div>
      <div style={styles.cardActions}>
        <button style={styles.editBtn} onClick={() => onEdit(event)}>Edit</button>
        <button style={styles.archiveBtn} onClick={() => onArchive(event.id, event.isArchived)}>
          {event.isArchived ? 'Unarchive' : 'Archive'}
        </button>
        <button style={styles.deleteBtn} onClick={() => onDelete(event.id)}>Delete</button>
      </div>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  cardDate: { fontSize: 12, color: '#666', marginBottom: 8, fontWeight: 500 },
  cardTitle: { fontSize: 18, fontWeight: 600, margin: '0 0 8px 0', color: '#1a1a1a' },
  cardDesc: { fontSize: 14, color: '#666', margin: '0 0 12px 0', lineHeight: 1.5 },
  cardMeta: { display: 'flex', gap: 8, fontSize: 13, color: '#999', marginBottom: 16 },
  cardActions: { display: 'flex', gap: 8, borderTop: '1px solid #eee', paddingTop: 12 },
  editBtn: { backgroundColor: '#2196F3', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
  archiveBtn: { backgroundColor: '#FF9800', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
  deleteBtn: { backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
}