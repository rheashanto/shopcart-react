import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import ProductCard from '../components/ProductCard'

const CATEGORIES = [
  { label: "Men's Fashion", count: '124 products', img: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&q=80' },
  { label: "Women's Fashion", count: '156 products', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80' },
  { label: 'Accessories', count: '89 products', img: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&q=80' },
  { label: 'Shoes', count: '67 products', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80' },
]

const FILTER_TABS = ['All', "men's clothing", "women's clothing", 'electronics', 'jewelery']

const Home = () => {
  const { data: products } = useFetch('https://fakestoreapi.com/products')
  const [activeTab, setActiveTab] = useState('All')

  const featured = useMemo(() => {
    if (!products) return []
    const filtered = activeTab === 'All' ? products : products.filter(p => p.category === activeTab)
    return filtered.slice(0, 8)
  }, [products, activeTab])

  return (
    <main className="page">
      {/* Hero */}
      <div className="home__hero">
        <div className="home__hero-inner">
          <h1>Summer Collection 2026</h1>
          <p>Discover the latest trends in fashion. Shop our exclusive collection with up to 50% off on selected items.</p>
          <div className="home__ctas">
            <Link to="/shop" className="btn btn--outline">
              Shop Now →
            </Link>
            <Link to="/shop" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(4px)' }}>
              View Collections
            </Link>
          </div>
        </div>
      </div>

      {/* Shop by Category */}
      <div className="home__section">
        <div className="container">
          <div className="home__section-header">
            <h2>Shop by Category</h2>
            <p>Explore our curated collections designed for every style and occasion</p>
          </div>
          <div className="home__categories">
            {CATEGORIES.map(({ label, count, img }) => (
              <Link to="/shop" key={label} className="home__category-card">
                <img src={img} alt={label} loading="lazy" />
                <div className="home__category-overlay">
                  <h3>{label}</h3>
                  <p>{count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="home__featured">
        <div className="container">
          <div className="home__featured-header">
            <h2>Featured Products</h2>
            <p>Discover our handpicked selection of premium fashion items</p>
          </div>

          <div className="home__filter-tabs">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                className={`home__filter-tab${activeTab === tab ? ' active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "men's clothing" ? 'Men' : tab === "women's clothing" ? 'Women' : tab === 'jewelery' ? 'Accessories' : tab}
              </button>
            ))}
          </div>

          {products ? (
            <div className="home__products-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="loading-wrap">
              <div className="spinner" />
              <p>Loading products…</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer__inner">
          <div>
            <div className="footer__brand">WebYes Shop</div>
            <p className="footer__tagline">Your destination for premium fashion and accessories. Quality products, exceptional service.</p>
            <div className="footer__socials">
              {['f', 'in', '𝕏'].map((s) => (
                <button key={s} className="footer__social-btn" aria-label={s}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="footer__col-title">Quick Links</div>
            <ul className="footer__links">
              {['About Us', 'Contact', 'Store Locator', 'Careers'].map(l => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="footer__col-title">Customer Service</div>
            <ul className="footer__links">
              {['Shipping & Returns', 'Size Guide', 'FAQ', 'Track Order'].map(l => <li key={l}><a href="#">{l}</a></li>)}
            </ul>
          </div>
          <div>
            <div className="footer__col-title">Newsletter</div>
            <p className="footer__newsletter-text">Subscribe to get special offers and updates</p>
            <div className="footer__newsletter-form">
              <input type="email" className="footer__newsletter-input" placeholder="Your email" />
              <button className="footer__newsletter-btn">→</button>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <span className="footer__copy">© 2026 WebYes Shop. All rights reserved.</span>
          <div className="footer__legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default Home
