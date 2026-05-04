import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'

const ITEM = {
  id: 7,
  title: 'Sample Item',
  price: 15.0,
  image: 'https://via.placeholder.com/80',
  category: 'sample',
  quantity: 3,
}

// Wrapper that seeds the cart then renders CartItem
const Wrapper = () => {
  const { cart, addItem } = useCart()
  if (cart.length === 0) {
    return <button onClick={() => addItem(ITEM)}>Seed</button>
  }
  return <CartItem item={cart[0]} />
}

const renderItem = async () => {
  const user = userEvent.setup()
  render(
    <CartProvider>
      <Wrapper />
    </CartProvider>
  )
  await user.click(screen.getByText('Seed'))
  return user
}

describe('CartItem', () => {
  it('renders item title', async () => {
    await renderItem()
    expect(screen.getByText('Sample Item')).toBeTruthy()
  })

  it('renders unit price', async () => {
    await renderItem()
    expect(screen.getByText('$15.00 each')).toBeTruthy()
  })

  it('renders line total', async () => {
    await renderItem()
    expect(screen.getByText('$45.00')).toBeTruthy()
  })

  it('increments quantity', async () => {
    const user = await renderItem()
    await user.click(screen.getByTestId('cart-inc'))
    expect(screen.getByTestId('cart-qty').value).toBe('4')
  })

  it('decrements quantity', async () => {
    const user = await renderItem()
    await user.click(screen.getByTestId('cart-dec'))
    expect(screen.getByTestId('cart-qty').value).toBe('2')
  })

  it('removes item when remove button is clicked', async () => {
    const user = await renderItem()
    await user.click(screen.getByTestId('remove-btn'))
    expect(screen.queryByText('Sample Item')).toBeNull()
  })
})
