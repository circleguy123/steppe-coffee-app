import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { graphqlQuery } from '../graphql/client'

export default function Users() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    try {
      const res = await graphqlQuery(`
        query {
          adminUsers {
            id
            name
            phone
            birthDate
            createdAt
          }
        }
      `)
      setUsers(res.data?.adminUsers ?? [])
    } catch (e) {
      console.log('Error fetching users:', e)
    }
    setLoading(false)
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Users</h1>
        <button style={styles.refreshButton} onClick={fetchUsers}>Refresh</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <div style={styles.empty}>
          <p>No users found</p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Birth Date</th>
              <th style={styles.th}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>{user.name || 'No name'}</td>
                <td style={styles.td}>{user.phone}</td>
                <td style={styles.td}>
                  {user.birthDate ? format(new Date(user.birthDate), 'MMM d, yyyy') : '-'}
                </td>
                <td style={styles.td}>
                  {user.createdAt ? format(new Date(user.createdAt), 'MMM d, yyyy') : '-'}
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
}