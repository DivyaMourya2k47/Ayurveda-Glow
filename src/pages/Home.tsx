import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Leaf, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <span className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                100% Natural & Organic
              </span>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                आयुर्वेदा ग्लो
                <span className="block text-3xl md:text-4xl text-yellow-600 mt-2">
                  Ayurveda Glow
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Discover the ancient secrets of Ayurveda for radiant skin, healthy hair, and holistic wellness. Our products are crafted with pure, natural ingredients for your beauty and wellbeing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center space-x-2 bg-white text-yellow-600 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-yellow-600 hover:bg-yellow-50 transition-all"
                >
                  <span>Learn More</span>
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600" style={{ fontFamily: "'Playfair Display', serif" }}>
                    5000+
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600" style={{ fontFamily: "'Playfair Display', serif" }}>
                    100+
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Natural Products</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600" style={{ fontFamily: "'Playfair Display', serif" }}>
                    15+
                  </p>
                  <p className="text-sm text-gray-600 mt-1">Years Experience</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/4202924/pexels-photo-4202924.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Ayurvedic Products"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 max-w-xs">
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">🌿</div>
                  <div>
                    <p className="font-bold text-gray-900">100% Natural</p>
                    <p className="text-sm text-gray-600">Ayurvedic Ingredients</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Our Philosophy
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Ayurvedic Way of Life
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ayurveda is more than just a medical system—it's a way of life that promotes balance, health, and longevity through natural methods.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
              <Leaf className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">100% Natural Ingredients</h3>
              <p className="text-gray-600">
                We use only the finest organic herbs, roots, and flowers in our formulations.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-2xl p-8 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
              <Heart className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Holistic Wellness</h3>
              <p className="text-gray-600">
                Our approach addresses not just symptoms but the root cause of imbalance.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
              <Sparkles className="w-12 h-12 text-orange-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sustainable & Ethical</h3>
              <p className="text-gray-600">
                We source ingredients responsibly and use eco-friendly packaging.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Start Your Ayurvedic Journey?
          </h2>
          <p className="text-xl mb-8 text-yellow-50">
            Join thousands of satisfied customers who have discovered the power of natural Ayurvedic products.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center space-x-2 bg-white text-yellow-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-50 transition-all shadow-lg hover:shadow-xl"
          >
            <span>Shop Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
