import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['All', "men's clothing", "women's clothing", 'electronics', 'jewelery']
const LABELS = { "men's clothing": 'Men', "women's clothing": 'Women', 'electronics': 'Electronics', 'jewelery': 'Accessories' }

// Map URL param values to API category strings
const PARAM_MAP = { men: "men's clothing", women: "women's clothing", accessories: 'jewelery', electronics: 'electronics' }

const Shop = () => {
  const { data: products, loading, error } = useFetch('https://fakestoreapi.com/products')
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')

  // Also sync search from URL q param (from navbar search)
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setSearch(q)
  }, [searchParams])

  // Fix 4: read category from URL param on mount/change
  const paramCat = searchParams.get('category')
  const initialCat = paramCat ? (PARAM_MAP[paramCat.toLowerCase()] || 'All') : 'All'
  const [active, setActive] = useState(initialCat)

  useEffect(() => {
    const mapped = paramCat ? (PARAM_MAP[paramCat.toLowerCase()] || 'All') : 'All'
    setActive(mapped)
  }, [paramCat])

  const handleFilter = (cat) => {
    setActive(cat)
    if (cat === 'All') {
      setSearchParams({})
    } else {
      const key = Object.entries(PARAM_MAP).find(([, v]) => v === cat)?.[0] || cat
      setSearchParams({ category: key })
    }
  }

  const filtered = useMemo(() => {
    if (!products) return []
    let result = active === 'All' ? products : products.filter((p) => p.category === active)
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    }
    return result
  }, [products, active, search])

  return (
    <main className="page" data-testid="shop-page">
      <div className="container">
        <div className="shop__header">
          <div>
            <h1>Products</h1>
            <p>{loading ? 'Loading…' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
            {/* Search input — Fix 4: wired up */}
            <div className="shop__search-wrap">
              <span className="navbar__search-icon">🔍</span>
              <input
                type="search"
                className="navbar__search-input shop__search-input"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search products"
              />
            </div>
            <div className="shop__filter" role="group" aria-label="Filter by category">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn${active === cat ? ' active' : ''}`}
                  onClick={() => handleFilter(cat)}
                  aria-pressed={active === cat}
                >
                  {cat === 'All' ? 'All' : (LABELS[cat] || cat)}
                </button>
              ))}
            </div>
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
            {filtered.length === 0 ? (
              <p style={{ color: '#9ca3af', padding: '2rem 0' }}>No products match your search.</p>
            ) : (
              filtered.map((product) => <ProductCard key={product.id} product={product} />)
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default Shop
