import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

const mockProduct = {
  id: 42,
  title: 'Test Product',
  price: 29.99,
  image: 'https://via.placeholder.com/150',
  category: 'test',
  rating: { rate: 4.2, count: 88 },
}

const renderCard = (product = mockProduct) =>
  render(
    <CartProvider>
      <ProductCard product={product} />
    </CartProvider>
  )

describe('ProductCard', () => {
  it('displays product title', () => {
    renderCard()
    expect(screen.getByText(mockProduct.title)).toBeTruthy()
  })

  it('displays the formatted price', () => {
    renderCard()
    expect(screen.getByText('$29.99')).toBeTruthy()
  })

  it('displays the category', () => {
    renderCard()
    expect(screen.getByText('test')).toBeTruthy()
  })

  it('renders the product image with alt text', () => {
    renderCard()
    const img = screen.getByAltText(mockProduct.title)
    expect(img).toBeTruthy()
    expect(img.getAttribute('src')).toBe(mockProduct.image)
  })

  it('starts with quantity 1', () => {
    renderCard()
    expect(screen.getByTestId('qty-input').value).toBe('1')
  })

  it('increments quantity', async () => {
    const user = userEvent.setup()
    renderCard()
    await user.click(screen.getByTestId('increment-btn'))
    expect(screen.getByTestId('qty-input').value).toBe('2')
  })

  it('decrements quantity but not below 1', async () => {
    const user = userEvent.setup()
    renderCard()
    await user.click(screen.getByTestId('decrement-btn'))
    expect(screen.getByTestId('qty-input').value).toBe('1')
  })

  it('allows typing a custom quantity', async () => {
    const user = userEvent.setup()
    renderCard()
    const input = screen.getByTestId('qty-input')
    await user.tripleClick(input)
    await user.keyboard('5')
    expect(input.value).toBe('5')
  })

  it('shows "Add to Cart" button', () => {
    renderCard()
    expect(screen.getByTestId('add-to-cart-btn')).toBeTruthy()
  })

  it('shows "✓ Added" feedback after clicking add to cart', async () => {
    const user = userEvent.setup()
    vi.useFakeTimers({ shouldAdvanceTime: true })
    renderCard()
    await user.click(screen.getByTestId('add-to-cart-btn'))
    expect(screen.getByTestId('add-to-cart-btn').textContent).toBe('✓ Added')
    vi.useRealTimers()
  })

  it('works without a rating field', () => {
    const noRating = { ...mockProduct, rating: undefined }
    renderCard(noRating)
    expect(screen.getByText(noRating.title)).toBeTruthy()
  })
})
