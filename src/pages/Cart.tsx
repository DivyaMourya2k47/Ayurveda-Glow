import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [processingCheckout, setProcessingCheckout] = useState(false);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!profile?.address || !profile?.city || !profile?.state || !profile?.pincode) {
      alert('Please complete your profile with shipping address before checkout');
      navigate('/profile');
      return;
    }

    navigate('/checkout');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white pt-24">
        <div className="text-center max-w-md px-4">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Please login to view your cart and start shopping
          </p>
          <Link
            to="/login"
            className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
          >
            Login to Continue
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white pt-24">
        <div className="text-center max-w-md px-4">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything to your cart yet
          </p>
          <Link
            to="/products"
            className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            className="text-red-600 hover:text-red-700 font-medium text-sm"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="bg-white rounded-xl shadow-md p-6 flex items-center space-x-4">
                <img
                  src={item.product.image_url}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {item.product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {item.product.category}
                  </p>
                  <div className="flex items-center space-x-2">
                    {item.product.ingredients.slice(0, 3).map((ing, idx) => (
                      <span key={idx} className="bg-orange-50 text-yellow-700 px-2 py-1 rounded text-xs">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-3">
                  <p className="text-xl font-bold text-yellow-600">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-700" />
                    </button>
                    <span className="w-12 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">
                    {getCartTotal() > 50 ? 'FREE' : '$5.00'}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-yellow-600">
                      ${(getCartTotal() + (getCartTotal() > 50 ? 0 : 5)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {getCartTotal() < 50 && (
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Add ${(50 - getCartTotal()).toFixed(2)} more for free shipping!
                </p>
              )}

              <button
                onClick={handleCheckout}
                disabled={processingCheckout}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingCheckout ? 'Processing...' : 'Proceed to Checkout'}
              </button>

              <Link
                to="/products"
                className="block text-center text-gray-600 hover:text-yellow-600 font-medium mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
