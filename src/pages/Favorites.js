import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      toast.error('Favoriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (productId) => {
    try {
      await axios.delete(`${API}/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(favorites.filter(p => p.id !== productId));
      toast.success('Favorilerden çıkarıldı');
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleAddToCart = async (productId) => {
    await addToCart(productId, 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-[#1A4D2E]">Yüklenïyor...</div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="empty-favorites">
        <div className="text-center">
          <Heart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#1A4D2E] mb-4" style={{fontFamily: 'Playfair Display'}}>
            Henüz Favori Ürününüz Yok
          </h2>
          <p className="text-[#4A6B5A] mb-6">Beğendiğiniz ürünleri favorilere ekleyin!</p>
          <button onClick={() => navigate('/products')} className="btn-primary" data-testid="browse-products-button">
            Ürünlere Göz At
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="favorites-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#1A4D2E] mb-8" style={{fontFamily: 'Playfair Display'}}>
          Favorilerim
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((product) => (
            <div key={product.id} className="card product-card group" data-testid={`favorite-card-${product.id}`}>
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeFavorite(product.id)}
                  className="favorite-btn active absolute top-3 right-3 bg-white p-2 rounded-full shadow-md"
                  data-testid={`remove-favorite-${product.id}`}
                >
                  <Heart size={20} className="fill-current text-[#FF6B00]" />
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
      </div>
    </div>
  );
};

export default Favorites;
