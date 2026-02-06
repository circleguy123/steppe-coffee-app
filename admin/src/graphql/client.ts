const API_URL = 'https://api.steppecoffee.kz/graphql'

export async function graphqlQuery(query: string, variables = {}) {
  const token = localStorage.getItem('admin_token')
  
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  })
  const data = await response.json()
  return data
}
