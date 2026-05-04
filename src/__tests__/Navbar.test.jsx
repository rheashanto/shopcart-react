import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import { AuthProvider } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
        </CartProvider>
      </AuthProvider>
    </MemoryRouter>
  )

describe('Navbar', () => {
  it('renders the brand name', () => {
    renderNavbar()
    expect(screen.getByText('ShopCart')).toBeTruthy()
  })

  it('renders all navigation links', () => {
    renderNavbar()
    expect(screen.getByText('Home')).toBeTruthy()
    expect(screen.getByText('Shop')).toBeTruthy()
    expect(screen.getByText('Cart')).toBeTruthy()
  })

  it('does not show cart badge when cart is empty', () => {
    renderNavbar()
    expect(screen.queryByTestId('cart-count')).toBeNull()
  })

  it('shows sign in link when not logged in', () => {
    renderNavbar()
    expect(screen.getByText('Sign in')).toBeTruthy()
  })
})
