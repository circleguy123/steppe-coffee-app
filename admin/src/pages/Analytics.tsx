import { useEffect, useState } from 'react'
import { graphqlQuery } from '../graphql/client'
import { format, subDays } from 'date-fns'

interface DailyStat {
  date: string
  orders: number
  revenue: number
}

export default function Analytics() {
  const [stats, setStats] = useState({ events: 0, communities: 0, bookings: 0, users: 0 })
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    setLoading(true)
    try {
      const [statsRes, ordersRes] = await Promise.all([
        graphqlQuery(`query { adminStats { events communities bookings users } }`),
        graphqlQuery(`query { adminOrders { id total paymentStatus createdAt items { productName amount } } }`),
      ])
      
      if (statsRes.data?.adminStats) setStats(statsRes.data.adminStats)
      if (ordersRes.data?.adminOrders) setOrders(ordersRes.data.adminOrders)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  // Calculate analytics
  const paidOrders = orders.filter(o => o.paymentStatus === 'paid')
  const todayRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue = paidOrders.length > 0 ? Math.round(todayRevenue / paidOrders.length) : 0

  // Popular items
  const itemCounts: Record<string, number> = {}
  orders.forEach(order => {
    order.items?.forEach((item: any) => {
      const name = item.productName || 'Unknown'
      itemCounts[name] = (itemCounts[name] || 0) + item.amount
    })
  })
  const popularItems = Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  // Order status breakdown
  const statusCounts = {
    paid: orders.filter(o => o.paymentStatus === 'paid').length,
    pending: orders.filter(o => o.paymentStatus === 'pending').length,
    failed: orders.filter(o => o.paymentStatus === 'failed').length,
    new: orders.filter(o => o.paymentStatus === 'new').length,
  }

  const maxStatus = Math.max(...Object.values(statusCounts), 1)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Analytics</h1>
        <button onClick={fetchData} style={styles.refreshButton}>↻ Refresh</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Key Metrics */}
          <div style={styles.metricsGrid}>
            <div style={{ ...styles.metricCard, borderTop: '4px solid #4CAF50' }}>
              <div style={styles.metricValue}>₸{todayRevenue.toLocaleString()}</div>
              <div style={styles.metricLabel}>Today's Revenue</div>
            </div>
            <div style={{ ...styles.metricCard, borderTop: '4px solid #2196F3' }}>
              <div style={styles.metricValue}>{orders.length}</div>
              <div style={styles.metricLabel}>Orders Today</div>
            </div>
            <div style={{ ...styles.metricCard, borderTop: '4px solid #FF9800' }}>
              <div style={styles.metricValue}>₸{avgOrderValue.toLocaleString()}</div>
              <div style={styles.metricLabel}>Avg Order Value</div>
            </div>
            <div style={{ ...styles.metricCard, borderTop: '4px solid #9C27B0' }}>
              <div style={styles.metricValue}>{stats.users}</div>
              <div style={styles.metricLabel}>Total Users</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
            {/* Order Status Chart */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Order Status (Today)</h3>
              <div style={styles.barChart}>
                {Object.entries(statusCounts).map(([status, count]) => (
                  <div key={status} style={styles.barRow}>
                    <div style={styles.barLabel}>{status}</div>
                    <div style={styles.barContainer}>
                      <div 
                        style={{ 
                          ...styles.bar, 
                          width: `${(count / maxStatus) * 100}%`,
                          backgroundColor: status === 'paid' ? '#4CAF50' : 
                                          status === 'pending' ? '#FF9800' : 
                                          status === 'failed' ? '#f44336' : '#2196F3'
                        }} 
                      />
                    </div>
                    <div style={styles.barValue}>{count}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Stats */}
            <div style={styles.chartCard}>
              <h3 style={styles.chartTitle}>Platform Overview</h3>
              <div style={styles.statsList}>
                <div style={styles.statsRow}>
                  <span>Total Events</span>
                  <span style={styles.statsValue}>{stats.events}</span>
                </div>
                <div style={styles.statsRow}>
                  <span>Communities</span>
                  <span style={styles.statsValue}>{stats.communities}</span>
                </div>
                <div style={styles.statsRow}>
                  <span>Table Bookings</span>
                  <span style={styles.statsValue}>{stats.bookings}</span>
                </div>
                <div style={styles.statsRow}>
                  <span>Registered Users</span>
                  <span style={styles.statsValue}>{stats.users}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Items */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Popular Items (Today)</h3>
            {popularItems.length > 0 ? (
              <div style={styles.barChart}>
                {popularItems.map(([name, count], i) => (
                  <div key={name} style={styles.barRow}>
                    <div style={{ ...styles.barLabel, width: 200 }}>
                      <span style={styles.rank}>#{i + 1}</span> {name}
                    </div>
                    <div style={styles.barContainer}>
                      <div 
                        style={{ 
                          ...styles.bar, 
                          width: `${(count / popularItems[0][1]) * 100}%`,
                          backgroundColor: '#FED100'
                        }} 
                      />
                    </div>
                    <div style={styles.barValue}>{count} sold</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666', textAlign: 'center', padding: 40 }}>No orders yet today</p>
            )}
          </div>

          {/* Conversion Funnel */}
          <div style={{ ...styles.chartCard, marginTop: 24 }}>
            <h3 style={styles.chartTitle}>Today's Conversion</h3>
            <div style={styles.funnel}>
              <div style={styles.funnelStep}>
                <div style={{ ...styles.funnelBar, width: '100%', backgroundColor: '#e3f2fd' }}>
                  <span>Orders Created</span>
                  <strong>{orders.length}</strong>
                </div>
              </div>
              <div style={styles.funnelStep}>
                <div style={{ ...styles.funnelBar, width: `${orders.length > 0 ? (paidOrders.length / orders.length) * 100 : 0}%`, backgroundColor: '#c8e6c9' }}>
                  <span>Paid</span>
                  <strong>{paidOrders.length}</strong>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: 16, color: '#666' }}>
              Conversion Rate: <strong>{orders.length > 0 ? Math.round((paidOrders.length / orders.length) * 100) : 0}%</strong>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  refreshButton: { padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 },
  metricCard: { backgroundColor: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  metricValue: { fontSize: 32, fontWeight: 700, marginBottom: 4 },
  metricLabel: { fontSize: 14, color: '#666' },
  chartCard: { backgroundColor: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  chartTitle: { fontSize: 16, fontWeight: 600, marginBottom: 20, marginTop: 0 },
  barChart: { display: 'flex', flexDirection: 'column', gap: 12 },
  barRow: { display: 'flex', alignItems: 'center', gap: 12 },
  barLabel: { width: 80, fontSize: 13, textTransform: 'capitalize' },
  barContainer: { flex: 1, height: 24, backgroundColor: '#f5f5f5', borderRadius: 4, overflow: 'hidden' },
  bar: { height: '100%', borderRadius: 4, transition: 'width 0.3s ease' },
  barValue: { width: 60, fontSize: 13, fontWeight: 600, textAlign: 'right' },
  rank: { color: '#999', marginRight: 8 },
  statsList: { display: 'flex', flexDirection: 'column', gap: 16 },
  statsRow: { display: 'flex', justifyContent: 'space-between', fontSize: 14, paddingBottom: 12, borderBottom: '1px solid #eee' },
  statsValue: { fontWeight: 700, fontSize: 18 },
  funnel: { display: 'flex', flexDirection: 'column', gap: 8 },
  funnelStep: { width: '100%' },
  funnelBar: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '16px 20px', 
    borderRadius: 6,
    minWidth: 150,
    transition: 'width 0.3s ease',
  },
}
