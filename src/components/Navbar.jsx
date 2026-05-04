import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__inner">
        <NavLink to="/" className="navbar__brand">WebYes Shop</NavLink>

        <ul className="navbar__links">
          {['/', '/shop'].map((path, i) => {
            const label = ['Home', 'Shop'][i]
            return (
              <li key={path}>
                <NavLink
                  to={path}
                  end={path === '/'}
                  className={({ isActive }) => 'navbar__link' + (isActive ? ' active' : '')}
                >
                  {label}
                </NavLink>
              </li>
            )
          })}
          {['Men', 'Women', 'Accessories', 'Shoes'].map((cat) => (
            <li key={cat}>
              <NavLink
                to={`/shop?category=${cat.toLowerCase()}`}
                className="navbar__link"
              >
                {cat}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar__search">
          <span className="navbar__search-icon">🔍</span>
          <input
            type="search"
            className="navbar__search-input"
            placeholder="Search products..."
            aria-label="Search products"
          />
        </div>

        <div className="navbar__actions">
          {user ? (
            <div className="navbar__user">
              <span className="navbar__icon-btn" aria-label="Account">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                  <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
              </span>
              <span className="navbar__user-name">Hi, {user.name.split(' ')[0]}</span>
              <button className="navbar__logout" onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <NavLink to="/login" className="navbar__icon-btn" aria-label="Sign in">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
            </NavLink>
          )}

          <NavLink
            to="/cart"
            className="navbar__icon-btn"
            aria-label={`Cart, ${totalItems} items`}
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && (
              <span className="cart-badge__count" data-testid="cart-count">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
