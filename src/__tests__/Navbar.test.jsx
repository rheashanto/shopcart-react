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
    expect(screen.getByText('WebYes Shop')).toBeTruthy()
  })

  it('renders Home and Shop navigation links', () => {
    renderNavbar()
    expect(screen.getByText('Home')).toBeTruthy()
    expect(screen.getByText('Shop')).toBeTruthy()
  })

  it('does not show cart badge when cart is empty', () => {
    renderNavbar()
    expect(screen.queryByTestId('cart-count')).toBeNull()
  })

  it('renders the search input', () => {
    renderNavbar()
    expect(screen.getByPlaceholderText('Search products...')).toBeTruthy()
  })
})
