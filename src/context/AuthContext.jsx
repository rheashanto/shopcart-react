import { createContext, useContext, useState, useCallback } from 'react'
import PropTypes from 'prop-types'

const AuthContext = createContext(null)

const USERS_KEY = 'shopcart_users'
const SESSION_KEY = 'shopcart_session'

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

const saveUsers = (users) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(users))

const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getSession())

  const signup = useCallback(({ name, email, password }) => {
    const users = getUsers()
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const newUser = { id: Date.now(), name, email: email.toLowerCase(), password }
    saveUsers([...users, newUser])
    const session = { id: newUser.id, name: newUser.name, email: newUser.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }, [])

  const login = useCallback(({ email, password }) => {
    const users = getUsers()
    const match = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!match) {
      return { ok: false, error: 'Incorrect email or password.' }
    }
    const session = { id: match.id, name: match.name, email: match.email }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired }

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
