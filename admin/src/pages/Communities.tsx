import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { graphqlQuery } from '../graphql/client'

export default function Communities() {
  const [communities, setCommunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCommunities()
  }, [])

  async function fetchCommunities() {
    setLoading(true)
    const res = await graphqlQuery(`
      query {
        communities {
          id
          name
          description
          isPublic
          createdAt
          members {
            id
            role
            user { name }
          }
        }
      }
    `)
    setCommunities(res.data?.communities ?? [])
    setLoading(false)
  }

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Communities</h1>
        <button style={styles.refreshButton} onClick={fetchCommunities}>Refresh</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : communities.length === 0 ? (
        <div style={styles.empty}><p>No communities yet</p></div>
      ) : (
        <div style={styles.grid}>
          {communities.map((community) => (
            <div key={community.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>{community.name}</h3>
                <span style={{ ...styles.badge, backgroundColor: community.isPublic ? '#4CAF50' : '#FF9800' }}>
                  {community.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
              
              <p style={styles.description}>{community.description || 'No description'}</p>
              
              <div style={styles.stats}>
                <div style={styles.stat}>
                  <span style={styles.statValue}>{community.members?.length ?? 0}</span>
                  <span style={styles.statLabel}>Members</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statValue}>
                    {community.members?.filter((m: any) => m.role === 'admin').length ?? 0}
                  </span>
                  <span style={styles.statLabel}>Admins</span>
                </div>
              </div>

              <div style={styles.membersList}>
                <strong style={{ fontSize: 13 }}>Members:</strong>
                <div style={styles.members}>
                  {community.members?.slice(0, 5).map((member: any) => (
                    <span key={member.id} style={styles.memberChip}>
                      {member.user?.name ?? 'Unknown'} {member.role === 'admin' && '(Admin)'}
                    </span>
                  ))}
                  {community.members?.length > 5 && (
                    <span style={styles.memberChip}>+{community.members.length - 5} more</span>
                  )}
                </div>
              </div>

              <div style={styles.cardFooter}>
                <span style={{ fontSize: 12, color: '#666' }}>
                  Created {format(new Date(community.createdAt), 'MMM d, yyyy')}
                </span>
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
  refreshButton: { backgroundColor: '#FED100', border: 'none', padding: '10px 20px', borderRadius: 6, fontWeight: 600, cursor: 'pointer' },
  empty: { textAlign: 'center', padding: 48, backgroundColor: '#fff', borderRadius: 8, color: '#666' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 },
  card: { backgroundColor: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  cardTitle: { fontSize: 18, fontWeight: 600, margin: 0, color: '#1a1a1a' },
  badge: { padding: '4px 10px', borderRadius: 4, color: '#fff', fontSize: 11, fontWeight: 600 },
  description: { color: '#666', fontSize: 14, marginBottom: 16 },
  stats: { display: 'flex', gap: 24, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #eee' },
  stat: { display: 'flex', flexDirection: 'column' },
  statValue: { fontSize: 22, fontWeight: 700, color: '#1a1a1a' },
  statLabel: { fontSize: 12, color: '#666' },
  membersList: { marginBottom: 16 },
  members: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  memberChip: { backgroundColor: '#f5f5f5', padding: '4px 10px', borderRadius: 4, fontSize: 12 },
  cardFooter: { paddingTop: 12, borderTop: '1px solid #eee' },
}