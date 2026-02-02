import { useEffect, useState } from 'react'
import { graphqlQuery } from '../graphql/client'

export default function Baristas() {
  const [baristas, setBaristas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ phone: '', name: '', password: '' })

  useEffect(() => {
    fetchBaristas()
  }, [])

  async function fetchBaristas() {
    setLoading(true)
    const res = await graphqlQuery(`query { adminBaristas { id name phone role createdAt } }`)
    setBaristas(res.data?.adminBaristas ?? [])
    setLoading(false)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    await graphqlQuery(`
      mutation CreateBarista($phone: String!, $name: String!, $password: String!) {
        createBarista(phone: $phone, name: $name, password: $password) { id }
      }
    ` , { phone: form.phone, name: form.name, password: form.password })
    setForm({ phone: '', name: '', password: '' })
    setShowForm(false)
    fetchBaristas()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this barista?')) return
    await graphqlQuery(`mutation { deleteBarista(id: "${id}") }`)
    fetchBaristas()
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Baristas</h1>
        <button style={styles.addButton} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Barista'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Name *</label>
              <input
                style={styles.input}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Phone *</label>
              <input
                style={styles.input}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+7..."
                required
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Password *</label>
              <input
                type="password"
                style={styles.input}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>
          <button type="submit" style={styles.submitButton}>Create Barista</button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : baristas.length === 0 ? (
        <div style={styles.empty}>
          <p>No baristas yet</p>
          <p style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
            Add baristas to give them access to the staff app
          </p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {baristas.map((barista) => (
              <tr key={barista.id} style={styles.tr}>
                <td style={styles.td}>{barista.name}</td>
                <td style={styles.td}>{barista.phone}</td>
                <td style={styles.td}>
                  <span style={styles.badge}>{barista.role}</span>
                </td>
                <td style={styles.td}>
                  <button 
                    style={styles.deleteButton}
                    onClick={() => handleDelete(barista.id)}
                  >
                    Delete
                  </button>
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
  addButton: { backgroundColor: '#4CAF50', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' },
  form: { backgroundColor: '#fff', padding: 24, borderRadius: 8, marginBottom: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 14, fontWeight: 600 },
  input: { padding: 12, borderRadius: 6, border: '1px solid #ddd', fontSize: 14 },
  submitButton: { backgroundColor: '#FED100', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: 48, backgroundColor: '#fff', borderRadius: 8, color: '#666' },
  table: { width: '100%', backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: 14, backgroundColor: '#f9f9f9', fontWeight: 600, fontSize: 13, color: '#333', borderBottom: '1px solid #eee' },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: 14, fontSize: 14 },
  badge: { padding: '4px 10px', borderRadius: 4, backgroundColor: '#2196F3', color: '#fff', fontSize: 12, fontWeight: 500 },
  deleteButton: { backgroundColor: '#f44336', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' },
}