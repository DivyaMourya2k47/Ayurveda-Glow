import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number;
  image_url: string;
  category: string;
  ingredients: string[];
  benefits: string[];
  badge: string | null;
  stock_quantity: number;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    await addToCart(product.id);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
      {product.badge && (
        <span className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
          {product.badge}
        </span>
      )}

      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {product.ingredients.slice(0, 3).map((ingredient, index) => (
            <span
              key={index}
              className="bg-orange-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-medium"
            >
              {ingredient}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-yellow-600">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-gray-400 line-through">
              ${product.original_price.toFixed(2)}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {product.stock_quantity} in stock
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
