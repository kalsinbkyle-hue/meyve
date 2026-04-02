import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import GitHubAd from '../components/GitHubAd';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { token } = useAuth();
  
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  useEffect(() => {
    fetchProducts();
    if (token) {
      fetchFavorites();
    }
  }, [category, search, token]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = `${API}/products`;
      const params = [];
      if (category) params.push(`category=${category}`);
      if (search) params.push(`search=${encodeURIComponent(search)}`);
      if (params.length > 0) url += `?${params.join('&')}`;
      
      const response = await axios.get(url);
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Ürünler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get(`${API}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data.map(p => p.id));
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error('Lütfen önce giriş yapın');
      return;
    }
    await addToCart(productId, 1);
  };

  const toggleFavorite = async (productId) => {
    if (!token) {
      toast.error('Lütfen önce giriş yapın');
      return;
    }

    try {
      if (favorites.includes(productId)) {
        await axios.delete(`${API}/favorites/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(favorites.filter(id => id !== productId));
        toast.success('Favorilerden çıkarıldı');
      } else {
        await axios.post(`${API}/favorites/${productId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites([...favorites, productId]);
        toast.success('Favorilere eklendi');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const getTitle = () => {
    if (search) return `"${search}" için sonuçlar`;
    if (category === 'fruit') return 'Taze Meyveler';
    if (category === 'vegetable') return 'Taze Sebzeler';
    return 'Tüm Ürünler';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-[#1A4D2E]">Yüklenïyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="products-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#1A4D2E] mb-8" style={{fontFamily: 'Playfair Display'}} data-testid="products-title">
          {getTitle()}
        </h1>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-[#4A6B5A] mb-4">Ürün bulunamadı</p>
            <Link to="/" className="btn-primary">
              Ana Sayfaya Dön
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="card product-card group" data-testid={`product-card-${product.id}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggleFavorite(product.id)}
                      className={`favorite-btn absolute top-3 right-3 bg-white p-2 rounded-full shadow-md ${favorites.includes(product.id) ? 'active' : ''}`}
                      data-testid={`favorite-button-${product.id}`}
                    >
                      <Heart 
                        size={20} 
                        className={favorites.includes(product.id) ? 'fill-current text-[#FF6B00]' : 'text-gray-600'}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-[#1A4D2E] mb-1" style={{fontFamily: 'Playfair Display'}}>
                      {product.name}
                    </h3>
                    <p className="text-[#4A6B5A] mb-3 text-sm line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-[#FF6B00]">
                        {product.price.toFixed(2)} ₺
                        <span className="text-xs text-[#4A6B5A] ml-1">/ {product.unit}</span>
                      </span>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="bg-[#FF6B00] hover:bg-[#E65100] text-white p-2 rounded-full transition-all hover:scale-110 shadow-md"
                        data-testid={`add-to-cart-${product.id}`}
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* GitHub Ad after products */}
            <GitHubAd />
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
