import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const CartContext = createContext(null);
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const fetchCart = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(response.data);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      toast.error('Lütfen önce giriş yapın');
      return;
    }
    try {
      await axios.post(`${API}/cart/add`, 
        { product_id: productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      toast.success('Ürün sepete eklendi!');
    } catch (error) {
      toast.error('Ürün eklenirken hata oluştu');
    }
  };

  const updateCartItem = async (productId, quantity) => {
    if (!token) return;
    try {
      await axios.post(`${API}/cart/update`,
        { product_id: productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      toast.success('Sepet güncellendi');
    } catch (error) {
      toast.error('Güncelleme başarısız');
    }
  };

  const removeFromCart = async (productId) => {
    await updateCartItem(productId, 0);
  };

  const clearCart = async () => {
    if (!token) return;
    try {
      await axios.delete(`${API}/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart({ items: [] });
      toast.success('Sepet temizlendi');
    } catch (error) {
      toast.error('Temizleme başarısız');
    }
  };

  const getCartTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      fetchCart,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
