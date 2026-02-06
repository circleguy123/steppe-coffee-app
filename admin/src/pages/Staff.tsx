import { useEffect, useState } from 'react'
import { graphqlQuery } from '../graphql/client'

interface StaffMember {
  id: string
  name: string
  phone: string
  adminRole: string
}

const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  manager: 'Manager',
  accountant: 'Accountant',
  marketer: 'Marketer',
  chief_barista: 'Chief Barista',
}

export default function Staff() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ phone: '', name: '', password: '', adminRole: 'manager' })
  const [saving, setSaving] = useState(false)

  const currentRole = localStorage.getItem('admin_role')

  async function fetchStaff() {
    const res = await graphqlQuery(`query { adminStaff { id name phone adminRole } }`)
    if (res.data?.adminStaff) {
      setStaff(res.data.adminStaff)
    }
    setLoading(false)
  }

  useEffect(() => { fetchStaff() }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await graphqlQuery(`
      mutation($phone: String!, $name: String!, $password: String!, $adminRole: String!) {
        createAdminStaff(phone: $phone, name: $name, password: $password, adminRole: $adminRole) { id }
      }
    `, form)
    setForm({ phone: '', name: '', password: '', adminRole: 'manager' })
    setShowForm(false)
    setSaving(false)
    fetchStaff()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this staff member?')) return
    await graphqlQuery(`mutation($id: String!) { deleteAdminStaff(id: $id) }`, { id })
    fetchStaff()
  }

  if (currentRole !== 'super_admin') {
    return <div style={{ padding: 40 }}><h1>Access Denied</h1><p>Only Super Admin can manage staff.</p></div>
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Staff Management</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addButton}>
          {showForm ? 'Cancel' : '+ Add Staff'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={styles.form}>
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            style={styles.input}
            required
          />
          <input
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            style={styles.input}
            required
          />
          <select
            value={form.adminRole}
            onChange={e => setForm({ ...form, adminRole: e.target.value })}
            style={styles.input}
          >
            <option value="manager">Manager</option>
            <option value="accountant">Accountant</option>
            <option value="marketer">Marketer</option>
            <option value="chief_barista">Chief Barista</option>
          </select>
          <button type="submit" style={styles.submitButton} disabled={saving}>
            {saving ? 'Creating...' : 'Create Staff Member'}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading...</p>
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
            {staff.map(s => (
              <tr key={s.id}>
                <td style={styles.td}>{s.name}</td>
                <td style={styles.td}>{s.phone}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, backgroundColor: s.adminRole === 'super_admin' ? '#FED100' : '#e0e0e0' }}>
                    {roleLabels[s.adminRole] || s.adminRole}
                  </span>
                </td>
                <td style={styles.td}>
                  {s.adminRole !== 'super_admin' && (
                    <button onClick={() => handleDelete(s.id)} style={styles.deleteButton}>Delete</button>
                  )}
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
  addButton: { padding: '10px 20px', backgroundColor: '#FED100', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' },
  form: { display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', padding: 20, backgroundColor: '#fff', borderRadius: 8 },
  input: { padding: 12, borderRadius: 6, border: '1px solid #ddd', fontSize: 14, minWidth: 150 },
  submitButton: { padding: '12px 24px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer' },
  table: { width: '100%', backgroundColor: '#fff', borderRadius: 8, borderCollapse: 'collapse', overflow: 'hidden' },
  th: { textAlign: 'left', padding: 16, backgroundColor: '#f5f5f5', fontWeight: 600, borderBottom: '1px solid #eee' },
  td: { padding: 16, borderBottom: '1px solid #eee' },
  badge: { padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 },
  deleteButton: { padding: '6px 12px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 },
}
