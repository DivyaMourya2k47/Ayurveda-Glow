import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const shippingCost = getCartTotal() > 50 ? 0 : 5;
  const total = getCartTotal() + shippingCost;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      if (!user || !profile) {
        throw new Error('User not authenticated');
      }

      const shippingAddress = {
        name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
      };

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          shipping_address: shippingAddress,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      await clearCart();

      navigate('/orders', { state: { orderSuccess: true } });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (!user || cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="space-y-2 text-gray-600">
                <p className="font-medium text-gray-900">{profile?.full_name}</p>
                <p>{profile?.email}</p>
                <p>{profile?.phone}</p>
                <p>{profile?.address}</p>
                <p>{profile?.city}, {profile?.state} {profile?.pincode}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
              <form onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-yellow-600"
                    />
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-yellow-600"
                    />
                    <span className="text-2xl">💵</span>
                    <span className="font-medium">Cash on Delivery</span>
                  </label>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-2">
                  <Lock className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">
                    Your payment information is secure and encrypted. This is a demo store - no real charges will be made.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-lg font-bold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                    {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-yellow-600">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
