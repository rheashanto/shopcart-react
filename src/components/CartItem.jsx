import PropTypes from 'prop-types'
import { useCart } from '../context/CartContext'

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart()

  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val >= 1) updateQuantity(item.id, val)
  }

  return (
    <div className="cart-item" data-testid="cart-item">
      <div className="cart-item__img-wrap">
        <img src={item.image} alt={item.title} className="cart-item__img" loading="lazy" />
      </div>
      <div>
        <p className="cart-item__category">{item.category}</p>
        <h4 className="cart-item__title">{item.title}</h4>
        <p className="cart-item__unit">${item.price.toFixed(2)} each</p>
      </div>
      <div className="cart-item__right">
        <p className="cart-item__total">${(item.price * item.quantity).toFixed(2)}</p>
        <div className="qty-group" role="group" aria-label="Item quantity">
          {/* Fix 7: disabled when quantity is 1 */}
          <button
            className="qty-btn"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity === 1}
            aria-label="Decrease"
            data-testid="cart-dec"
            style={item.quantity === 1 ? { opacity: 0.35, cursor: 'not-allowed' } : {}}
          >−</button>
          {/* Fix 7: min=1 */}
          <input
            type="number" className="qty-input"
            value={item.quantity} onChange={handleChange}
            min="1" aria-label="Quantity" data-testid="cart-qty"
          />
          <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase" data-testid="cart-inc">+</button>
        </div>
        <button className="btn btn--danger" onClick={() => removeItem(item.id)} aria-label={`Remove ${item.title}`} data-testid="remove-btn">Remove</button>
      </div>
    </div>
  )
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
}

export default CartItem
