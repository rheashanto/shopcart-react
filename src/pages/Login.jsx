import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/shop'

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      triggerShake()
      return
    }
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    const result = login({ email: form.email, password: form.password })
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      triggerShake()
    } else {
      navigate(from, { replace: true })
    }
  }

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  return (
    <div className="auth-page">
      {/* Left decorative panel */}
      <div className="auth-panel">
        <div className="auth-panel__noise" />
        <div className="auth-panel__content">
          <div className="auth-panel__logo">
            <span className="auth-panel__logo-mark">S</span>
          </div>
          <h2 className="auth-panel__headline">
            Good to<br />see you<br />again.
          </h2>
          <p className="auth-panel__sub">
            Your cart is waiting. Sign in to continue shopping.
          </p>
          <div className="auth-panel__dots" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="auth-panel__dot" />
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-side">
        <div className={`auth-card${shake ? ' auth-card--shake' : ''}`}>
          <div className="auth-card__header">
            <h1 className="auth-card__title">Sign in</h1>
            <p className="auth-card__subtitle">
              New here?{' '}
              <Link to="/signup" className="auth-link">Create an account</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="auth-field">
              <label className="auth-label" htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                className={`auth-input${error ? ' auth-input--error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                autoFocus
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="password"
                  name="password"
                  type={showPw ? 'text' : 'password'}
                  className={`auth-input${error ? ' auth-input--error' : ''}`}
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                <span className="auth-error__icon">!</span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                'Sign in →'
              )}
            </button>
          </form>

          <div className="auth-demo">
            <p className="auth-demo__label">Demo account</p>
            <button
              type="button"
              className="auth-demo__btn"
              onClick={() => {
                setForm({ email: 'demo@shopcart.com', password: 'demo1234' })
                setError('')
              }}
            >
              Use demo credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
