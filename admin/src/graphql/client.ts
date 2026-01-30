const API_URL = 'https://api.steppecoffee.kz/graphql'

export async function graphqlQuery(query: string, variables = {}) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  })
  const data = await response.json()
  return data
}