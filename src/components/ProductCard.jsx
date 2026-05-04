import { useState } from 'react'
import PropTypes from 'prop-types'
import { useCart } from '../context/CartContext'

const StarRating = ({ rating }) => {
  const full = Math.round(rating)
  return (
    <span className="product-card__stars" aria-label={`${rating} out of 5`}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
    </span>
  )
}
StarRating.propTypes = { rating: PropTypes.number.isRequired }

const ProductCard = ({ product }) => {
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  const handleQtyChange = (e) => {
    const val = parseInt(e.target.value, 10)
    if (!isNaN(val) && val >= 1) setQty(val)
  }

  const handleAdd = () => {
    addItem({ id: product.id, title: product.title, price: product.price, image: product.image, category: product.category, quantity: qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  // fake discount for visual variety
  const hasDiscount = product.id % 3 === 0
  const discountPct = hasDiscount ? Math.floor(20 + (product.id % 3) * 5) : null
  const fakeOriginal = hasDiscount ? (product.price * (100 / (100 - discountPct))).toFixed(2) : null

  return (
    <article className="product-card" data-testid="product-card">
      <div className="product-card__img-wrap">
        {discountPct && <span className="product-card__discount-badge">-{discountPct}%</span>}
        <img src={product.image} alt={product.title} className="product-card__img" loading="lazy" />
        <button className="product-card__hover-btn" onClick={handleAdd} aria-label={`Add ${product.title} to cart`}>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Add to Cart
        </button>
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__title">{product.title}</h3>
        {product.rating && (
          <div className="product-card__rating">
            <StarRating rating={product.rating.rate} />
            <span>({product.rating.count})</span>
          </div>
        )}
        <div className="product-card__price-row">
          <span className="product-card__price">${product.price.toFixed(2)}</span>
          {fakeOriginal && <span className="product-card__old-price">${fakeOriginal}</span>}
        </div>
        <div className="product-card__controls">
          <div className="qty-group" role="group" aria-label="Quantity">
            <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))} aria-label="Decrease" data-testid="decrement-btn">−</button>
            <input type="number" className="qty-input" value={qty} onChange={handleQtyChange} min="1" aria-label="Quantity" data-testid="qty-input" />
            <button className="qty-btn" onClick={() => setQty(q => q + 1)} aria-label="Increase" data-testid="increment-btn">+</button>
          </div>
          <button className={`add-btn${added ? ' added' : ''}`} onClick={handleAdd} aria-label={`Add ${product.title} to cart`} data-testid="add-to-cart-btn">
            {added ? '✓ Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </article>
  )
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    rating: PropTypes.shape({ rate: PropTypes.number, count: PropTypes.number }),
  }).isRequired,
}

export default ProductCard
