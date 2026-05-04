import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import { useCart } from '../context/CartContext'

const StarRating = ({ rating }) => {
  const full = Math.round(rating)
  return (
    <span className="pd__stars" aria-label={`${rating} out of 5`}>
      {'★'.repeat(full)}{'☆'.repeat(5 - full)}
    </span>
  )
}

const FEATURES_MAP = {
  "men's clothing": [
    'Premium fabric blend',
    'Machine washable',
    'Slim fit design',
    'Reinforced stitching',
    'Available in multiple sizes',
  ],
  "women's clothing": [
    'Premium fabric blend',
    'Water-resistant coating',
    'Adjustable fit',
    'Wrinkle-resistant material',
    'Eco-friendly production',
  ],
  'electronics': [
    'High performance chipset',
    '1-year manufacturer warranty',
    'Energy efficient design',
    'Compatible with major platforms',
    'Compact and lightweight',
  ],
  'jewelery': [
    '925 sterling silver / gold plated',
    'Hypoallergenic materials',
    'Tarnish-resistant finish',
    'Gift box included',
    'Certified authentic',
  ],
}

const COLORS_MAP = {
  "men's clothing": ['Black', 'Navy', 'Grey'],
  "women's clothing": ['Black', 'Beige', 'Burgundy'],
  'electronics': ['Black', 'Silver', 'White'],
  'jewelery': ['Gold', 'Silver', 'Rose Gold'],
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, loading, error } = useFetch(`https://fakestoreapi.com/products/${id}`)
  const { addItem } = useCart()

  const [selectedColor, setSelectedColor] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)
  const [added, setAdded] = useState(false)
  const [wishlist, setWishlist] = useState(false)

  const isClothing = product && (product.category === "men's clothing" || product.category === "women's clothing")

  const hasDiscount = product && product.id % 3 === 0
  const discountPct = hasDiscount ? Math.floor(20 + (product?.id % 3) * 5) : null
  const originalPrice = hasDiscount ? (product.price * (100 / (100 - discountPct))).toFixed(2) : null

  const handleAddToCart = () => {
    if (!product) return
    addItem({ id: product.id, title: product.title, price: product.price, image: product.image, category: product.category, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  if (loading) return (
    <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto 1rem' }} />
      <p style={{ color: '#9ca3af' }}>Loading product…</p>
    </div>
  )

  if (error || !product) return (
    <div style={{ padding: '6rem 2rem', textAlign: 'center' }}>
      <p style={{ color: '#dc2626', marginBottom: '1rem' }}>Failed to load product.</p>
      <button className="btn btn--dark" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  )

  const features = FEATURES_MAP[product.category] || FEATURES_MAP["men's clothing"]
  const colors = COLORS_MAP[product.category] || COLORS_MAP["men's clothing"]

  return (
    <main className="page pd-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="pd__breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <span>{product.title.length > 30 ? product.title.slice(0, 30) + '…' : product.title}</span>
        </nav>

        <div className="pd__layout">
          {/* Left: Image */}
          <div className="pd__img-col">
            <div className="pd__img-wrap">
              {discountPct && <span className="product-card__discount-badge">-{discountPct}%</span>}
              <img src={product.image} alt={product.title} className="pd__img" />
            </div>
          </div>

          {/* Right: Details */}
          <div className="pd__info-col">
            <p className="pd__category">{product.category.toUpperCase()}</p>
            <h1 className="pd__title">{product.title}</h1>

            {/* Price */}
            <div className="pd__price-row">
              <span className="pd__price">${product.price.toFixed(2)}</span>
              {originalPrice && <span className="pd__old-price">${originalPrice}</span>}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="pd__rating">
                <StarRating rating={product.rating.rate} />
                <span className="pd__rating-count">({product.rating.count} reviews)</span>
              </div>
            )}

            <hr className="pd__divider" />

            {/* Description */}
            <p className="pd__description">{product.description}</p>

            <hr className="pd__divider" />

            {/* Color selector */}
            <div className="pd__option-group">
              <p className="pd__option-label">Color: {selectedColor && <span className="pd__option-selected">{selectedColor}</span>}</p>
              <div className="pd__option-btns">
                {colors.map(c => (
                  <button
                    key={c}
                    className={`pd__option-btn${selectedColor === c ? ' active' : ''}`}
                    onClick={() => setSelectedColor(c)}
                  >{c}</button>
                ))}
              </div>
            </div>

            {/* Size selector — only for clothing */}
            {isClothing && (
              <div className="pd__option-group">
                <p className="pd__option-label">Size: {selectedSize && <span className="pd__option-selected">{selectedSize}</span>}</p>
                <div className="pd__option-btns">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      className={`pd__option-btn pd__size-btn${selectedSize === s ? ' active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}

            <hr className="pd__divider" />

            {/* Action buttons */}
            <div className="pd__actions">
              <button
                className={`pd__add-btn${added ? ' added' : ''}`}
                onClick={handleAddToCart}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {added ? '✓ Added to Cart!' : 'Add to Cart'}
              </button>
              <button
                className={`pd__wishlist-btn${wishlist ? ' active' : ''}`}
                onClick={() => setWishlist(v => !v)}
                aria-label="Add to wishlist"
              >
                <svg width="18" height="18" fill={wishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
                Add to Wishlist
              </button>
            </div>

            {/* Product features */}
            <div className="pd__features">
              <h3 className="pd__features-title">Product Features</h3>
              <ul className="pd__features-list">
                {features.map(f => (
                  <li key={f} className="pd__feature-item">
                    <span className="pd__feature-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
