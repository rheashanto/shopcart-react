import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const Field = ({ label, id, placeholder, value, onChange, half }) => (
  <div className={`chk-field${half ? ' chk-field--half' : ''}`}>
    <label className="chk-label" htmlFor={id}>{label}</label>
    <input
      id={id} className="chk-input" placeholder={placeholder || ''}
      value={value} onChange={onChange} autoComplete="off"
    />
  </div>
)

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  const tax = parseFloat((totalPrice * 0.08).toFixed(2))
  const shipping = totalPrice > 50 ? 0 : 5.99
  const total = (totalPrice + tax + shipping).toFixed(2)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', zip: '',
    card: '', expiry: '', cvv: '', cardName: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handlePlace = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
    }, 1500)
  }

  const handleSuccessClose = () => {
    setSuccess(false)
    clearCart()
    navigate('/')
  }

  return (
    <main className="page chk-page">
      <div className="container">
        {/* Back */}
        <Link to="/cart" className="chk-back">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back
        </Link>

        <h1 className="chk-title">Checkout</h1>

        <div className="chk-layout">
          {/* Left: forms */}
          <div className="chk-forms">
            {/* Shipping */}
            <div className="chk-section">
              <h2 className="chk-section-title">Shipping Information</h2>
              <div className="chk-grid">
                <Field label="First Name" id="firstName" value={form.firstName} onChange={set('firstName')} half />
                <Field label="Last Name"  id="lastName"  value={form.lastName}  onChange={set('lastName')}  half />
                <Field label="Email"       id="email"    value={form.email}    onChange={set('email')} />
                <Field label="Phone Number" id="phone"  value={form.phone}    onChange={set('phone')} />
                <Field label="Street Address" id="address" value={form.address} onChange={set('address')} />
                <Field label="City"  id="city"  value={form.city}  onChange={set('city')}  half />
                <Field label="State" id="state" value={form.state} onChange={set('state')} half />
                <Field label="ZIP Code" id="zip" value={form.zip} onChange={set('zip')} half />
              </div>
            </div>

            {/* Payment */}
            <div className="chk-section">
              <h2 className="chk-section-title">Payment Information</h2>
              <div className="chk-grid">
                <div className="chk-field">
                  <label className="chk-label" htmlFor="card">Card Number</label>
                  <input id="card" className="chk-input" placeholder="1234 5678 9012 3456"
                    value={form.card} onChange={set('card')} maxLength={19} />
                </div>
                <Field label="Expiry Date" id="expiry" placeholder="MM/YY" value={form.expiry} onChange={set('expiry')} half />
                <Field label="CVV"         id="cvv"    placeholder="123"   value={form.cvv}    onChange={set('cvv')}    half />
                <Field label="Cardholder Name" id="cardName" value={form.cardName} onChange={set('cardName')} />
              </div>
            </div>

            {/* Trust badges */}
            <div className="chk-badges">
              {[
                { icon: <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>, label: 'Secure Payment' },
                { icon: <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="1.75" viewBox="0 0 24 24"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>, label: 'Fast Delivery' },
                { icon: <svg width="28" height="28" fill="none" stroke="#2563eb" strokeWidth="1.75" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, label: 'Money Back' },
              ].map(({ icon, label }) => (
                <div key={label} className="chk-badge">
                  {icon}
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Order summary */}
          <aside className="chk-summary">
            <h2 className="chk-summary-title">Order Summary</h2>

            <ul className="chk-summary-items">
              {cart.map((item) => (
                <li key={item.id} className="chk-summary-item">
                  <img src={item.image} alt={item.title} className="chk-summary-img" />
                  <div className="chk-summary-item-info">
                    <p className="chk-summary-item-name">{item.title}</p>
                    <p className="chk-summary-item-price">${item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="chk-summary-rows">
              <div className="chk-summary-row">
                <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="chk-summary-row">
                <span>Shipping</span><span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="chk-summary-row">
                <span>Tax</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="chk-summary-row chk-summary-total">
                <span>Total</span><span>${total}</span>
              </div>
            </div>

            <button
              className="chk-place-btn"
              onClick={handlePlace}
              disabled={loading || cart.length === 0}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
            <p className="chk-terms">By placing your order, you agree to our Terms &amp; Conditions</p>
          </aside>
        </div>
      </div>

      {/* Success Modal */}
      {success && (
        <div className="chk-modal-backdrop" role="dialog" aria-modal="true">
          <div className="chk-modal">
            <p className="chk-modal-msg">Order placed successfully! Thank you for your purchase.</p>
            <hr className="chk-modal-divider" />
            <button className="chk-modal-close" onClick={handleSuccessClose}>Close</button>
          </div>
        </div>
      )}
    </main>
  )
}
