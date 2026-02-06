import { useState } from 'react'
import { graphqlQuery } from '../graphql/client'

interface LoginProps {
  onLogin: (role: string) => void
}

export default function Login({ onLogin }: LoginProps) {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await graphqlQuery(`
        mutation AdminLogin($phone: String!, $password: String!) {
          adminLogin(phone: $phone, password: $password) {
            success
            token
            message
            adminRole
            user { id name phone }
          }
        }
      `, { phone, password })

      if (res.data?.adminLogin?.success) {
        localStorage.setItem('admin_token', res.data.adminLogin.token)
        localStorage.setItem('admin_role', res.data.adminLogin.adminRole)
        localStorage.setItem('admin_user', JSON.stringify(res.data.adminLogin.user))
        onLogin(res.data.adminLogin.adminRole)
      } else {
        setError(res.data?.adminLogin?.message || 'Login failed')
      }
    } catch (err) {
      setError('Connection error')
    }
    setLoading(false)
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>S</div>
          <h1 style={styles.title}>Steppe Admin</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
          {error && <p style={styles.error}>{error}</p>}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  card: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    width: 360,
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
    justifyContent: 'center',
  },
  logoIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#FED100',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
    color: '#1a1a1a',
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 6,
    border: '1px solid #ddd',
    fontSize: 16,
    marginBottom: 16,
    boxSizing: 'border-box',
  },
  error: {
    color: '#f44336',
    fontSize: 14,
    marginBottom: 16,
    marginTop: -8,
  },
  button: {
    width: '100%',
    padding: 14,
    backgroundColor: '#FED100',
    border: 'none',
    borderRadius: 6,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
  },
}
