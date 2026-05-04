import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const rules = {
  name: (v) => v.trim().length >= 2 || 'Name must be at least 2 characters.',
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
  password: (v) => v.length >= 6 || 'Password must be at least 6 characters.',
  confirm: (v, form) => v === form.password || 'Passwords do not match.',
}

const Signup = () => {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [touched, setTouched] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const getError = (field) => {
    if (!touched[field]) return ''
    const result = rules[field](form[field], form)
    return result === true ? '' : result
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
    if (serverError) setServerError('')
  }

  const handleBlur = (e) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }))
  }

  const isFormValid = () =>
    Object.keys(rules).every((k) => rules[k](form[k], form) === true)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ name: true, email: true, password: true, confirm: true })

    if (!isFormValid()) {
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    const result = signup({ name: form.name.trim(), email: form.email, password: form.password })
    setLoading(false)

    if (!result.ok) {
      setServerError(result.error)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    } else {
      navigate('/shop')
    }
  }

  const strength = (() => {
    const p = form.password
    if (!p) return 0
    let s = 0
    if (p.length >= 6) s++
    if (p.length >= 10) s++
    if (/[A-Z]/.test(p)) s++
    if (/[0-9]/.test(p)) s++
    if (/[^A-Za-z0-9]/.test(p)) s++
    return Math.min(s, 4)
  })()

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', '#e74c3c', '#f39c12', '#3498db', '#27ae60'][strength]

  return (
    <div className="auth-page">
      {/* Left panel */}
      <div className="auth-panel auth-panel--signup">
        <div className="auth-panel__noise" />
        <div className="auth-panel__content">
          <div className="auth-panel__logo">
            <span className="auth-panel__logo-mark">S</span>
          </div>
          <h2 className="auth-panel__headline">
            Start<br />your<br />journey.
          </h2>
          <p className="auth-panel__sub">
            Join thousands of shoppers. It takes less than a minute.
          </p>
          <ul className="auth-panel__perks">
            {['Save your cart across devices', 'Track orders in real time', 'Exclusive member discounts'].map((p) => (
              <li key={p} className="auth-panel__perk">
                <span className="auth-panel__perk-check">✓</span> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right form */}
      <div className="auth-form-side">
        <div className={`auth-card${shake ? ' auth-card--shake' : ''}`}>
          <div className="auth-card__header">
            <h1 className="auth-card__title">Create account</h1>
            <p className="auth-card__subtitle">
              Already have one?{' '}
              <Link to="/login" className="auth-link">Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            {/* Name */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="name">Full name</label>
              <input
                id="name" name="name" type="text"
                className={`auth-input${getError('name') ? ' auth-input--error' : touched.name && !getError('name') ? ' auth-input--ok' : ''}`}
                placeholder="Jane Smith"
                value={form.name}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="name"
                autoFocus
              />
              {getError('name') && <p className="auth-field-error">{getError('name')}</p>}
            </div>

            {/* Email */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="su-email">Email address</label>
              <input
                id="su-email" name="email" type="email"
                className={`auth-input${getError('email') ? ' auth-input--error' : touched.email && !getError('email') ? ' auth-input--ok' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="email"
              />
              {getError('email') && <p className="auth-field-error">{getError('email')}</p>}
            </div>

            {/* Password */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="su-password">Password</label>
              <div className="auth-input-wrap">
                <input
                  id="su-password" name="password" type={showPw ? 'text' : 'password'}
                  className={`auth-input${getError('password') ? ' auth-input--error' : touched.password && !getError('password') ? ' auth-input--ok' : ''}`}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="new-password"
                />
                <button
                  type="button" className="auth-eye"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
              {form.password && (
                <div className="auth-strength">
                  <div className="auth-strength__bars">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="auth-strength__bar"
                        style={{ background: n <= strength ? strengthColor : '#e5e5e5' }}
                      />
                    ))}
                  </div>
                  <span className="auth-strength__label" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </span>
                </div>
              )}
              {getError('password') && <p className="auth-field-error">{getError('password')}</p>}
            </div>

            {/* Confirm */}
            <div className="auth-field">
              <label className="auth-label" htmlFor="confirm">Confirm password</label>
              <input
                id="confirm" name="confirm" type={showPw ? 'text' : 'password'}
                className={`auth-input${getError('confirm') ? ' auth-input--error' : touched.confirm && !getError('confirm') ? ' auth-input--ok' : ''}`}
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={handleChange}
                onBlur={handleBlur}
                autoComplete="new-password"
              />
              {getError('confirm') && <p className="auth-field-error">{getError('confirm')}</p>}
            </div>

            {serverError && (
              <div className="auth-error" role="alert">
                <span className="auth-error__icon">!</span>
                {serverError}
              </div>
            )}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Create account →'}
            </button>
          </form>

          <p className="auth-terms">
            By signing up you agree to our{' '}
            <span className="auth-link">Terms of Service</span> and{' '}
            <span className="auth-link">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
