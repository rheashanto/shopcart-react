import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'

const Cart = () => {
  const { cart, totalItems, totalPrice, clearCart } = useCart()
  const shipping = totalPrice > 50 ? 0 : 5.99
  const orderTotal = totalPrice + shipping

  return (
    <main className="page" data-testid="cart-page">
      <div className="container">
        <div className="cart__header">
          <h1>Your Cart</h1>
          <p>{totalItems === 0 ? 'No items' : `${totalItems} item${totalItems !== 1 ? 's' : ''}`}</p>
        </div>

        <div className="cart__layout">
          {cart.length === 0 ? (
            <div className="cart__empty">
              <h2>Your cart is empty</h2>
              <p>Add some products to get started.</p>
              <Link to="/shop" className="btn btn--dark">Browse Products</Link>
            </div>
          ) : (
            <>
              <div>
                <div className="cart-items">
                  {cart.map((item) => <CartItem key={item.id} item={item} />)}
                  <div className="cart-actions">
                    <button className="btn btn--danger" onClick={clearCart} data-testid="clear-cart">
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>

              <aside className="cart__summary" aria-label="Order summary">
                <h2>Order Summary</h2>
                <div className="summary-row">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && <p className="summary-note">✓ Free shipping applied</p>}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
                <div className="summary-btns">
                  <button className="btn btn--checkout" disabled>Checkout</button>
                  <Link to="/shop" className="btn btn--outline-dark">Continue Shopping</Link>
                </div>
                <p className="summary-footer">Free shipping on orders over $50</p>
              </aside>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default Cart
