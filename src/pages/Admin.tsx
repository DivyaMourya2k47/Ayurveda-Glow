import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Product {
  id?: string;
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
  is_active: boolean;
}

const emptyProduct: Product = {
  name: '',
  description: '',
  price: 0,
  original_price: 0,
  image_url: '',
  category: 'Face Care',
  ingredients: [],
  benefits: [],
  badge: null,
  stock_quantity: 100,
  is_active: true,
};

export default function Admin() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    if (!profile?.is_admin) {
      navigate('/');
      return;
    }
    fetchAllProducts();
  }, [profile]);

  const fetchAllProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (product: Product) => {
    try {
      if (product.id) {
        const { error } = await supabase
          .from('products')
          .update({
            ...product,
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('products')
          .insert(product);

        if (error) throw error;
      }

      await fetchAllProducts();
      setEditingProduct(null);
      setIsAddingNew(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAllProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  if (!profile?.is_admin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Product Management
          </h1>
          <button
            onClick={() => {
              setEditingProduct(emptyProduct);
              setIsAddingNew(true);
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Product</span>
          </button>
        </div>

        {(editingProduct || isAddingNew) && (
          <ProductForm
            product={editingProduct || emptyProduct}
            onSave={handleSave}
            onCancel={() => {
              setEditingProduct(null);
              setIsAddingNew(false);
            }}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                  {!product.is_active && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Inactive</span>
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <p className="text-sm text-gray-600 mb-2">Category: {product.category}</p>
                <p className="text-xl font-bold text-yellow-600 mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(product.id!)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onCancel,
}: {
  product: Product;
  onSave: (product: Product) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState(product);
  const [ingredientsText, setIngredientsText] = useState(product.ingredients.join(', '));
  const [benefitsText, setBenefitsText] = useState(product.benefits.join(', '));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      ingredients: ingredientsText.split(',').map(s => s.trim()).filter(Boolean),
      benefits: benefitsText.split(',').map(s => s.trim()).filter(Boolean),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {product.id ? 'Edit Product' : 'Add New Product'}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option>Face Care</option>
            <option>Hair Care</option>
            <option>Body Care</option>
            <option>Wellness</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            required
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Original Price ($)</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.original_price}
            onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
          <input
            type="number"
            required
            value={formData.stock_quantity}
            onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Badge (optional)</label>
          <select
            value={formData.badge || ''}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value || null })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          >
            <option value="">None</option>
            <option value="Bestseller">Bestseller</option>
            <option value="New">New</option>
            <option value="Popular">Popular</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            type="url"
            required
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ingredients (comma-separated)
          </label>
          <input
            type="text"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            placeholder="e.g., Turmeric, Saffron, Aloe Vera"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Benefits (comma-separated)
          </label>
          <input
            type="text"
            value={benefitsText}
            onChange={(e) => setBenefitsText(e.target.value)}
            placeholder="e.g., Brightens skin, Reduces dark spots"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-yellow-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Product is active</span>
          </label>
        </div>

        <div className="md:col-span-2 flex space-x-4">
          <button
            type="submit"
            className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all"
          >
            <Save className="w-5 h-5" />
            <span>Save Product</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
