import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CartProvider, useCart } from '../context/CartContext'

const ITEM_A = { id: 1, title: 'Widget A', price: 10, image: 'a.jpg', category: 'test', quantity: 1 }
const ITEM_B = { id: 2, title: 'Widget B', price: 20, image: 'b.jpg', category: 'test', quantity: 2 }

const CartConsumer = () => {
  const { cart, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart()
  return (
    <div>
      <p data-testid="total-items">{totalItems}</p>
      <p data-testid="total-price">{totalPrice.toFixed(2)}</p>
      <ul>
        {cart.map((i) => (
          <li key={i.id} data-testid={`item-${i.id}`}>
            {i.title} x{i.quantity}
          </li>
        ))}
      </ul>
      <button onClick={() => addItem(ITEM_A)}>Add A</button>
      <button onClick={() => addItem(ITEM_B)}>Add B</button>
      <button onClick={() => updateQuantity(1, 5)}>Set A to 5</button>
      <button onClick={() => updateQuantity(1, 0)}>Remove A via qty 0</button>
      <button onClick={() => removeItem(2)}>Remove B</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  )
}

const renderConsumer = () =>
  render(
    <CartProvider>
      <CartConsumer />
    </CartProvider>
  )

describe('CartContext', () => {
  it('starts with an empty cart', () => {
    renderConsumer()
    expect(screen.getByTestId('total-items').textContent).toBe('0')
    expect(screen.getByTestId('total-price').textContent).toBe('0.00')
  })

  it('adds an item and updates totals', async () => {
    const user = userEvent.setup()
    renderConsumer()
    await user.click(screen.getByText('Add A'))
    expect(screen.getByTestId('total-items').textContent).toBe('1')
    expect(screen.getByTestId('total-price').textContent).toBe('10.00')
    expect(screen.getByTestId('item-1').textContent).toBe('Widget A x1')
  })

  it('stacks quantity when adding the same item twice', async () => {
    const user = userEvent.setup()
    renderConsumer()
    await user.click(screen.getByText('Add A'))
    await user.click(screen.getByText('Add A'))
    expect(screen.getByTestId('total-items').textContent).toBe('2')
    expect(screen.getByTestId('item-1').textContent).toBe('Widget A x2')
  })

  it('adds multiple distinct items', async () => {
    const user = userEvent.setup()
    renderConsumer()
    await user.click(screen.getByText('Add A'))
    await user.click(screen.getByText('Add B'))
    expect(screen.getByTestId('total-items').textContent).toBe('3')
    expect(screen.getByTestId('total-price').textContent).toBe('50.00')
  })

  it('updates quantity of an existing item', async () => {
    const user = userEvent.setup()
    renderConsumer()
    await user.click(screen.getByText('Add A'))
    await user.click(screen.getByText('Set A to 5'))
    expect(screen.getByTestId('item-1').textContent).toBe('Widget A x5')
    expect(screen.getByTestId('total-items').textContent).toBe('5')
  })

  it('removes item when quantity set to 0', async () => {
    const user = userEvent.setup()
    renderConsumer()
    await user.click(screen.getByText('Add A'))
    await user.click(screen.getByText('Remove A via qty 0'))
    expect(screen.queryByTestId('item-1')).toBeNull()
    expect(screen.getByTestId('total-items').textContent).toBe('0')
  })

  it('removes a specific item', async () => {
    const user = userEvent.setup()
    renderConsumer()
    await user.click(screen.getByText('Add A'))
    await user.click(screen.getByText('Add B'))
    await user.click(screen.getByText('Remove B'))
    expect(screen.queryByTestId('item-2')).toBeNull()
    expect(screen.getByTestId('item-1')).toBeTruthy()
  })

  it('clears the entire cart', async () => {
    const user = userEvent.setup()
    renderConsumer()
    await user.click(screen.getByText('Add A'))
    await user.click(screen.getByText('Add B'))
    await user.click(screen.getByText('Clear'))
    expect(screen.getByTestId('total-items').textContent).toBe('0')
    expect(screen.queryByTestId('item-1')).toBeNull()
    expect(screen.queryByTestId('item-2')).toBeNull()
  })
})
