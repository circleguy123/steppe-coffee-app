import { useEffect, useState } from 'react'
import { graphqlQuery } from '../graphql/client'

interface ItemSize {
  sizeId: string
  sizeName: string
  prices: { price: number }[]
}

interface MenuItem {
  itemId: string
  name: string
  description: string
  sku: string
  itemSizes: ItemSize[]
  orderItemType: string
}

interface Category {
  id: string
  name: string
  description: string
  items: MenuItem[]
  buttonImageUrl: string
}

interface StopListItem {
  productId: string
  balance: number
}

export default function Menu() {
  const [categories, setCategories] = useState<Category[]>([])
  const [stopList, setStopList] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [search, setSearch] = useState('')

  async function fetchMenu() {
    setLoading(true)
    try {
      const [menuRes, stopRes] = await Promise.all([
        graphqlQuery(`
          query {
            steppeMenu {
              id
              name
              itemCategories {
                id
                name
                description
                buttonImageUrl
                items {
                  itemId
                  name
                  description
                  sku
                  orderItemType
                  itemSizes {
                    sizeId
                    sizeName
                    prices { price }
                  }
                }
              }
            }
          }
        `),
        graphqlQuery(`
          query {
            stopList {
              terminalGroupStopLists {
                items {
                  items {
                    productId
                    balance
                  }
                }
              }
            }
          }
        `)
      ])

      if (menuRes.data?.steppeMenu?.itemCategories) {
        setCategories(menuRes.data.steppeMenu.itemCategories)
        if (menuRes.data.steppeMenu.itemCategories.length > 0) {
          setSelectedCategory(menuRes.data.steppeMenu.itemCategories[0].id)
        }
      }

      // Extract stopped product IDs
      if (stopRes.data?.stopList?.terminalGroupStopLists) {
        const stoppedIds: string[] = []
        stopRes.data.stopList.terminalGroupStopLists.forEach((group: any) => {
          group.items?.forEach((stopGroup: any) => {
            stopGroup.items?.forEach((item: StopListItem) => {
              if (item.balance === 0) {
                stoppedIds.push(item.productId)
              }
            })
          })
        })
        setStopList(stoppedIds)
      }
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }

  useEffect(() => { fetchMenu() }, [])

  const currentCategory = categories.find(c => c.id === selectedCategory)
  
  const filteredItems = currentCategory?.items.filter(item => 
    !search || item.name?.toLowerCase().includes(search.toLowerCase())
  ) || []

  const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0)

  const getPrice = (item: MenuItem) => {
    if (item.itemSizes?.[0]?.prices?.[0]?.price) {
      return item.itemSizes[0].prices[0].price
    }
    return 0
  }

  const isOnStopList = (itemId: string) => stopList.includes(itemId)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Menu Management</h1>
        <button onClick={fetchMenu} style={styles.refreshButton}>↻ Refresh from iiko</button>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #4CAF50' }}>
          <div style={styles.statValue}>{categories.length}</div>
          <div style={styles.statLabel}>Categories</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #2196F3' }}>
          <div style={styles.statValue}>{totalItems}</div>
          <div style={styles.statLabel}>Total Items</div>
        </div>
        <div style={{ ...styles.statCard, borderLeft: '4px solid #f44336' }}>
          <div style={styles.statValue}>{stopList.length}</div>
          <div style={styles.statLabel}>On Stop List</div>
        </div>
      </div>

      {/* Stop List Alert */}
      {stopList.length > 0 && (
        <div style={styles.stopAlert}>
          <span style={{ fontWeight: 600 }}>⚠️ {stopList.length} items currently unavailable</span>
          <span style={{ color: '#666', marginLeft: 8 }}>Items with STOP badge are out of stock in iiko</span>
        </div>
      )}

      {loading ? (
        <p>Loading menu from iiko...</p>
      ) : (
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Categories Sidebar */}
          <div style={styles.categorySidebar}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: '#666', fontSize: 12, textTransform: 'uppercase' }}>
              Categories
            </div>
            {categories.map(cat => {
              const stoppedInCategory = cat.items.filter(item => isOnStopList(item.itemId)).length
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    ...styles.categoryButton,
                    backgroundColor: selectedCategory === cat.id ? '#FED100' : 'transparent',
                    fontWeight: selectedCategory === cat.id ? 600 : 400,
                  }}
                >
                  <span>{cat.name}</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {stoppedInCategory > 0 && (
                      <span style={styles.stoppedCount}>{stoppedInCategory}</span>
                    )}
                    <span style={styles.categoryCount}>{cat.items.length}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Items Grid */}
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
              <input
                type="text"
                placeholder="Search items..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.itemsGrid}>
              {filteredItems.map(item => (
                <div 
                  key={item.itemId} 
                  style={{
                    ...styles.itemCard,
                    opacity: isOnStopList(item.itemId) ? 0.6 : 1,
                    borderColor: isOnStopList(item.itemId) ? '#f44336' : '#eee',
                    borderWidth: isOnStopList(item.itemId) ? 2 : 1,
                  }}
                >
                  {isOnStopList(item.itemId) && (
                    <div style={styles.stopBadge}>STOP</div>
                  )}
                  <div style={styles.itemName}>{item.name || 'Unnamed'}</div>
                  <div style={styles.itemSku}>SKU: {item.sku || '-'}</div>
                  <div style={styles.itemPrice}>
                    ₸{getPrice(item).toLocaleString()}
                  </div>
                  {item.itemSizes?.length > 1 && (
                    <div style={styles.sizesInfo}>
                      {item.itemSizes.length} sizes
                    </div>
                  )}
                  <div style={styles.itemType}>
                    {item.orderItemType}
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <p style={{ textAlign: 'center', padding: 40, color: '#666' }}>
                {search ? 'No items match your search' : 'No items in this category'}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  refreshButton: { padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', fontSize: 14 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 },
  statCard: { backgroundColor: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  statValue: { fontSize: 28, fontWeight: 700, marginBottom: 4 },
  statLabel: { fontSize: 14, color: '#666' },
  stopAlert: { 
    backgroundColor: '#fff3e0', 
    padding: '12px 16px', 
    borderRadius: 8, 
    marginBottom: 24,
    border: '1px solid #ffcc02',
  },
  categorySidebar: { width: 240, backgroundColor: '#fff', borderRadius: 8, padding: 16, alignSelf: 'flex-start' },
  categoryButton: { 
    width: '100%', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    padding: '12px 16px', 
    border: 'none', 
    borderRadius: 6, 
    cursor: 'pointer', 
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 4,
  },
  categoryCount: { 
    backgroundColor: '#f0f0f0', 
    padding: '2px 8px', 
    borderRadius: 10, 
    fontSize: 12,
    fontWeight: 600,
  },
  stoppedCount: {
    backgroundColor: '#ffebee',
    color: '#f44336',
    padding: '2px 8px',
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 600,
  },
  searchInput: { 
    flex: 1,
    padding: 12, 
    borderRadius: 6, 
    border: '1px solid #ddd', 
    fontSize: 14,
    boxSizing: 'border-box',
  },
  itemsGrid: { 
    display: 'grid', 
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
    gap: 16,
  },
  itemCard: { 
    backgroundColor: '#fff', 
    borderRadius: 8, 
    padding: 16, 
    borderStyle: 'solid',
    position: 'relative',
  },
  stopBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 700,
  },
  itemName: { fontSize: 14, fontWeight: 600, marginBottom: 4 },
  itemSku: { fontSize: 12, color: '#999', marginBottom: 8 },
  itemPrice: { fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 },
  sizesInfo: { fontSize: 12, color: '#666', marginBottom: 4 },
  itemType: { 
    fontSize: 11, 
    color: '#666', 
    backgroundColor: '#f5f5f5', 
    padding: '2px 8px', 
    borderRadius: 4,
    display: 'inline-block',
  },
}
