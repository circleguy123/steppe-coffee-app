import { useEffect, useState } from 'react'
import { graphqlQuery } from '../graphql/client'
import { format } from 'date-fns'

interface OrderItem {
  id: string
  productName: string
  amount: number
  price: number
}

interface Order {
  id: string
  orderNumber: number
  total: number
  iikoStatus: string
  paymentStatus: string
  type: string
  createdAt: string
  user: {
    id: string
    name: string
    phone: string
  } | null
  items: OrderItem[]
}

const statusColors: Record<string, string> = {
  paid: '#4CAF50',
  pending: '#FF9800',
  failed: '#f44336',
  new: '#2196F3',
  canceled: '#9E9E9E',
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filter, setFilter] = useState<string>('all')

  async function fetchOrders() {
    setLoading(true)
    const res = await graphqlQuery(`
      query {
        adminOrders {
          id
          orderNumber
          total
          iikoStatus
          paymentStatus
          type
          createdAt
          user { id name phone }
          items { id productName amount price }
        }
      }
    `)
    if (res.data?.adminOrders) {
      setOrders(res.data.adminOrders)
    }
    setLoading(false)
  }

  useEffect(() => { fetchOrders() }, [])

  const filteredOrders = orders.filter(o => {
    if (filter === 'all') return true
    return o.paymentStatus === filter
  })

  const stats = {
    total: orders.length,
    paid: orders.filter(o => o.paymentStatus === 'paid').length,
    pending: orders.filter(o => o.paymentStatus === 'pending').length,
    revenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Today's Orders</h1>
        <button onClick={fetchOrders} style={styles.refreshButton}>↻ Refresh</button>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #2196F3' }}>
          <div style={styles.statValue}>{stats.total}</div>
          <div style={styles.statLabel}>Total Orders</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #4CAF50' }}>
          <div style={styles.statValue}>{stats.paid}</div>
          <div style={styles.statLabel}>Paid</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #FF9800' }}>
          <div style={styles.statValue}>{stats.pending}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #FED100' }}>
          <div style={styles.statValue}>₸{stats.revenue.toLocaleString()}</div>
          <div style={styles.statLabel}>Revenue</div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        {['all', 'paid', 'pending', 'failed', 'new'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterButton,
              backgroundColor: filter === f ? '#FED100' : '#fff',
              fontWeight: filter === f ? 600 : 400,
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Orders List */}
          <div style={{ flex: 1 }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Items</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>iiko</th>
                  <th style={styles.th}>Time</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map(order => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: selectedOrder?.id === order.id ? '#FFF8E1' : 'transparent',
                    }}
                  >
                    <td style={styles.td}>
                      <strong>#{order.orderNumber}</strong>
                    </td>
                    <td style={styles.td}>
                      <div>{order.user?.name || 'Guest'}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>{order.user?.phone}</div>
                    </td>
                    <td style={styles.td}>{order.items.length} items</td>
                    <td style={styles.td}>
                      <strong>₸{order.total.toLocaleString()}</strong>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: statusColors[order.paymentStatus] || '#999', color: '#fff' }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, backgroundColor: '#e0e0e0' }}>
                        {order.iikoStatus}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {format(new Date(order.createdAt), 'HH:mm')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <p style={{ textAlign: 'center', padding: 40, color: '#666' }}>No orders found</p>
            )}
          </div>

          {/* Order Detail Panel */}
          {selectedOrder && (
            <div style={styles.detailPanel}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0 }}>Order #{selectedOrder.orderNumber}</h3>
                <button onClick={() => setSelectedOrder(null)} style={styles.closeButton}>✕</button>
              </div>

              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Customer</div>
                <div>{selectedOrder.user?.name || 'Guest'}</div>
                <div style={{ fontSize: 14, color: '#666' }}>{selectedOrder.user?.phone}</div>
              </div>

              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Type</div>
                <div>{selectedOrder.type}</div>
              </div>

              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Time</div>
                <div>{format(new Date(selectedOrder.createdAt), 'dd MMM yyyy, HH:mm')}</div>
              </div>

              <div style={styles.detailSection}>
                <div style={styles.detailLabel}>Items</div>
                {selectedOrder.items.map(item => (
                  <div key={item.id} style={styles.itemRow}>
                    <span>{item.amount}x {item.productName}</span>
                    <span>₸{item.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div style={{ ...styles.detailSection, borderTop: '2px solid #1a1a1a', paddingTop: 16, marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 }}>
                  <span>Total</span>
                  <span>₸{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>

              <div style={styles.statusRow}>
                <div>
                  <div style={styles.detailLabel}>Payment</div>
                  <span style={{ ...styles.badge, backgroundColor: statusColors[selectedOrder.paymentStatus] || '#999', color: '#fff' }}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                <div>
                  <div style={styles.detailLabel}>iiko Status</div>
                  <span style={{ ...styles.badge, backgroundColor: '#e0e0e0' }}>
                    {selectedOrder.iikoStatus}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  refreshButton: { padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { backgroundColor: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  statValue: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
  statLabel: { fontSize: 14, color: '#666' },
  filters: { display: 'flex', gap: 8, marginBottom: 24 },
  filterButton: { padding: '8px 16px', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  table: { width: '100%', backgroundColor: '#fff', borderRadius: 8, borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: 12, backgroundColor: '#f5f5f5', fontWeight: 600, fontSize: 13, borderBottom: '1px solid #eee' },
  td: { padding: 12, borderBottom: '1px solid #eee', fontSize: 14 },
  badge: { padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600, textTransform: 'uppercase' },
  detailPanel: { width: 320, backgroundColor: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', alignSelf: 'flex-start' },
  closeButton: { background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#666' },
  detailSection: { marginBottom: 16 },
  detailLabel: { fontSize: 12, color: '#666', marginBottom: 4, textTransform: 'uppercase' },
  itemRow: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #eee', fontSize: 14 },
  statusRow: { display: 'flex', gap: 24, marginTop: 20 },
}
