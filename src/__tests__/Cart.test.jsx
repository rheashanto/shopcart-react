import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider, useCart } from '../context/CartContext'
import Cart from '../pages/Cart'

const ITEM = { id: 1, title: 'Cart Test Item', price: 25, image: 'x.jpg', category: 'a', quantity: 1 }

const CartSeeder = ({ children }) => {
  const { addItem } = useCart()
  return (
    <>
      <button onClick={() => addItem(ITEM)}>Seed</button>
      {children}
    </>
  )
}

const renderCart = () =>
  render(
    <MemoryRouter>
      <CartProvider>
        <CartSeeder>
          <Cart />
        </CartSeeder>
      </CartProvider>
    </MemoryRouter>
  )

describe('Cart page', () => {
  it('shows empty state when cart is empty', () => {
    render(
      <MemoryRouter>
        <CartProvider>
          <Cart />
        </CartProvider>
      </MemoryRouter>
    )
    expect(screen.getByText(/your cart is empty/i)).toBeTruthy()
  })

  it('displays items when cart has products', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.click(screen.getByText('Seed'))
    expect(screen.getByText('Cart Test Item')).toBeTruthy()
  })

  it('calculates total price correctly', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.click(screen.getByText('Seed'))
    const priceElements = screen.getAllByText('$25.00')
    expect(priceElements.length).toBeGreaterThan(0)
  })

  it('clears cart when "Clear Cart" is clicked', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.click(screen.getByText('Seed'))
    await user.click(screen.getByTestId('clear-cart'))
    expect(screen.getByText(/your cart is empty/i)).toBeTruthy()
  })
})
