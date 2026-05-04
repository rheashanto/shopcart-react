import { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((i) => i.id === action.item.id)
      if (existing) {
        return state.map((i) =>
          i.id === action.item.id
            ? { ...i, quantity: i.quantity + action.item.quantity }
            : i
        )
      }
      return [...state, action.item]
    }
    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return state.filter((i) => i.id !== action.id)
      }
      return state.map((i) =>
        i.id === action.id ? { ...i, quantity: action.quantity } : i
      )
    }
    case 'REMOVE_ITEM':
      return state.filter((i) => i.id !== action.id)
    case 'CLEAR_CART':
      return []
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [])

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', item })
  const updateQuantity = (id, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', id, quantity })
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', id })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ cart, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  )
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
