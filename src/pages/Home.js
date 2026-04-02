import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Heart, Apple, Carrot } from 'lucide-react';
import GitHubAd from '../components/GitHubAd';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const { addToCart } = useCart();
  const { token } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
      // Get 6 random featured products
      const shuffled = [...response.data].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 6));
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error('Lütfen önce giriş yapın');
      return;
    }
    await addToCart(productId, 1);
  };

  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="hero-gradient py-24" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1A4D2E] mb-6" style={{fontFamily: 'Playfair Display'}}>
              En Taze Meyve ve Sebzeler
            </h1>
            <p className="text-lg sm:text-xl text-[#4A6B5A] mb-8 max-w-2xl mx-auto">
              Doğrudan çiftçiden sofraya! Organik ve taze ürünlerle sağlıklı yaşamın tadını çıkarın.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/products?category=fruit" className="btn-primary" data-testid="shop-fruits-button">
                Meyveleri Keşfet
              </Link>
              <Link to="/products?category=vegetable" className="btn-secondary" data-testid="shop-vegetables-button">
                Sebzeleri Keşfet
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Bento Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="categories-section">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1A4D2E] mb-12 text-center" style={{fontFamily: 'Playfair Display'}}>
          Kategoriler
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fruits Card */}
          <Link 
            to="/products?category=fruit" 
            className="category-card relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
            data-testid="fruits-category-card"
          >
            <img 
              src="https://images.unsplash.com/photo-1624866087023-199bd9c1cae7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybWVycyUyMG1hcmtldCUyMHN0YWxsfGVufDB8fHx8MTc3MjI4MzA5Nnww&ixlib=rb-4.1.0&q=85"
              alt="Meyveler"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="bg-[#FF6B00] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Apple size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2" style={{fontFamily: 'Playfair Display'}}>
                Taze Meyveler
              </h3>
              <p className="text-white/90">Vitamin deposu, doğal tatlar</p>
            </div>
          </Link>

          {/* Vegetables Card */}
          <Link 
            to="/products?category=vegetable" 
            className="category-card relative h-80 rounded-2xl overflow-hidden group cursor-pointer"
            data-testid="vegetables-category-card"
          >
            <img 
              src="https://images.unsplash.com/photo-1760368104757-37a1fa5ca605?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTJ8MHwxfHNlYXJjaHwyfHxvcmdhbmljJTIwZmFybWVycyUyMG1hcmtldCUyMHN0YWxsfGVufDB8fHx8MTc3MjI4MzA5Nnww&ixlib=rb-4.1.0&q=85"
              alt="Sebzeler"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="bg-[#1A4D2E] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Carrot size={32} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2" style={{fontFamily: 'Playfair Display'}}>
                Taze Sebzeler
              </h3>
              <p className="text-white/90">Organik, lezzetli ve sağlıklı</p>
            </div>
          </Link>
        </div>
      </section>

      {/* GitHub Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GitHubAd />
      </div>

      {/* Featured Products */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-testid="featured-products-section">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#1A4D2E] mb-12 text-center" style={{fontFamily: 'Playfair Display'}}>
          Öne Çıkan Ürünler
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="card product-card group" data-testid={`product-card-${product.id}`}>
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-[#1A4D2E] mb-2" style={{fontFamily: 'Playfair Display'}}>
                  {product.name}
                </h3>
                <p className="text-[#4A6B5A] mb-4 text-sm">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#FF6B00]">
                    {product.price.toFixed(2)} ₺
                    <span className="text-sm text-[#4A6B5A] ml-1">/ {product.unit}</span>
                  </span>
                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="bg-[#FF6B00] hover:bg-[#E65100] text-white p-3 rounded-full transition-all hover:scale-110 shadow-md"
                    data-testid={`add-to-cart-${product.id}`}
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link to="/products" className="btn-primary" data-testid="view-all-products">
            Tüm Ürünleri Gör
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
