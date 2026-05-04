import { useState, useMemo } from 'react'
import useFetch from '../hooks/useFetch'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['All', "men's clothing", "women's clothing", 'electronics', 'jewelery']
const LABELS = { "men's clothing": 'Men', "women's clothing": 'Women', 'electronics': 'Electronics', 'jewelery': 'Accessories' }

const Shop = () => {
  const { data: products, loading, error } = useFetch('https://fakestoreapi.com/products')
  const [active, setActive] = useState('All')

  const filtered = useMemo(() => {
    if (!products) return []
    return active === 'All' ? products : products.filter((p) => p.category === active)
  }, [products, active])

  return (
    <main className="page" data-testid="shop-page">
      <div className="container">
        <div className="shop__header">
          <div>
            <h1>Products</h1>
            <p>{loading ? 'Loading…' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}</p>
          </div>
          <div className="shop__filter" role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn${active === cat ? ' active' : ''}`}
                onClick={() => setActive(cat)}
                aria-pressed={active === cat}
              >
                {cat === 'All' ? 'All' : (LABELS[cat] || cat)}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="loading-wrap" data-testid="loading">
            <div className="spinner" />
            <p>Loading products…</p>
          </div>
        )}

        {error && (
          <div className="error-wrap" role="alert">
            <p>Failed to load products: {error}</p>
            <button className="btn btn--outline-dark" onClick={() => window.location.reload()}>Retry</button>
          </div>
        )}

        {!loading && !error && (
          <div className="shop__grid" data-testid="products-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Shop
