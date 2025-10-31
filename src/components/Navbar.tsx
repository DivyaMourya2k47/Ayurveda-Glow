import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl">🌿</div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>
              Ayurveda Glow
            </h2>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-yellow-600 transition-colors">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-yellow-600 transition-colors">Products</Link>
            {user && <Link to="/orders" className="text-gray-700 hover:text-yellow-600 transition-colors">Orders</Link>}
            {profile?.is_admin && <Link to="/admin" className="text-gray-700 hover:text-yellow-600 transition-colors">Admin</Link>}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-yellow-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/profile" className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-yellow-50 transition-colors">
                  <User className="w-5 h-5 text-gray-700" />
                  <span className="text-gray-700">{profile?.full_name || 'Profile'}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-700 hover:text-red-600 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-yellow-600 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-yellow-600" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-yellow-600" onClick={() => setIsMenuOpen(false)}>Products</Link>
              {user && <Link to="/orders" className="text-gray-700 hover:text-yellow-600" onClick={() => setIsMenuOpen(false)}>Orders</Link>}
              {profile?.is_admin && <Link to="/admin" className="text-gray-700 hover:text-yellow-600" onClick={() => setIsMenuOpen(false)}>Admin</Link>}
              <Link to="/cart" className="text-gray-700 hover:text-yellow-600 flex items-center" onClick={() => setIsMenuOpen(false)}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Cart ({getCartCount()})
              </Link>
              {user ? (
                <>
                  <Link to="/profile" className="text-gray-700 hover:text-yellow-600" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                  <button
                    onClick={() => { handleSignOut(); setIsMenuOpen(false); }}
                    className="text-left text-red-600 hover:text-red-700"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-yellow-600" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="text-gray-700 hover:text-yellow-600" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
