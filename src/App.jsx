import { Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProductDetail from './pages/ProductDetail'

const App = () => (
  <AuthProvider>
    <CartProvider>
      <Routes>
        {/* Auth pages — no navbar */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* App pages — with navbar */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
                <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </CartProvider>
  </AuthProvider>
)

export default App
