import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useCart } from '../context/CartContext'

const CartDrawer = ({ open, onClose }) => {
  const { cart, totalItems, totalPrice, updateQuantity, removeItem } = useCart()

  // lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        className={`drawer-backdrop${open ? ' visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside className={`cart-drawer${open ? ' open' : ''}`} role="dialog" aria-modal="true" aria-label="Shopping cart">
        {/* Header */}
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Shopping Cart {totalItems > 0 && <span className="cart-drawer__count">({totalItems})</span>}
          </h2>
          <button className="cart-drawer__close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        {/* Items */}
        <div className="cart-drawer__body">
          {cart.length === 0 ? (
            <div className="cart-drawer__empty">
              <svg width="48" height="48" fill="none" stroke="#d1d5db" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p>Your cart is empty</p>
              <button className="cart-drawer__shop-btn" onClick={onClose}>Start Shopping</button>
            </div>
          ) : (
            <ul className="cart-drawer__items">
              {cart.map((item) => (
                <li key={item.id} className="cart-drawer__item">
                  <img src={item.image} alt={item.title} className="cart-drawer__item-img" />
                  <div className="cart-drawer__item-info">
                    <p className="cart-drawer__item-title">{item.title}</p>
                    <p className="cart-drawer__item-price">${item.price.toFixed(2)}</p>
                    <div className="cart-drawer__item-controls">
                      <div className="qty-group">
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                        <span className="qty-input" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 36 }}>{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                  </div>
                  <button className="cart-drawer__item-remove" onClick={() => removeItem(item.id)} aria-label="Remove item">✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__summary">
              <div className="cart-drawer__summary-row">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="cart-drawer__summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="cart-drawer__summary-row cart-drawer__total">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="cart-drawer__checkout-btn" onClick={onClose}>
              Proceed to Checkout
            </Link>
            <button className="cart-drawer__continue-btn" onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  )
}

CartDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default CartDrawer
