// Seeds a demo account into localStorage if it doesn't exist yet.
// This runs once when the app first loads.
const USERS_KEY = 'shopcart_users'

const seedDemo = () => {
  try {
    const existing = JSON.parse(localStorage.getItem(USERS_KEY)) || []
    const hasDemo = existing.some((u) => u.email === 'demo@shopcart.com')
    if (!hasDemo) {
      const demo = {
        id: 1,
        name: 'Demo User',
        email: 'demo@shopcart.com',
        password: 'demo1234',
      }
      localStorage.setItem(USERS_KEY, JSON.stringify([demo]))
    }
  } catch {
    // silently ignore if localStorage is unavailable
  }
}

export default seedDemo
