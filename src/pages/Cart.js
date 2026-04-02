import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateCartItem(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) {
      toast.error('Sepetiniz boş');
      return;
    }
    navigate('/checkout');
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="empty-cart">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#1A4D2E] mb-4" style={{fontFamily: 'Playfair Display'}}>
            Sepetiniz Boş
          </h2>
          <p className="text-[#4A6B5A] mb-6">Henüz sepetinize ürün eklemediniz.</p>
          <button onClick={() => navigate('/products')} className="btn-primary" data-testid="shop-now-button">
            Alışverişe Başla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="cart-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#1A4D2E] mb-8" style={{fontFamily: 'Playfair Display'}} data-testid="cart-title">
          Sepetim
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.product.id} className="card p-6" data-testid={`cart-item-${item.product.id}`}>
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1A4D2E]" style={{fontFamily: 'Playfair Display'}}>
                      {item.product.name}
                    </h3>
                    <p className="text-[#4A6B5A]">{item.product.price.toFixed(2)} ₺ / {item.product.unit}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity, -1)}
                      className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition"
                      data-testid={`decrease-quantity-${item.product.id}`}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="text-lg font-semibold w-8 text-center" data-testid={`quantity-${item.product.id}`}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.product.id, item.quantity, 1)}
                      className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full transition"
                      data-testid={`increase-quantity-${item.product.id}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-[#FF6B00]" data-testid={`subtotal-${item.product.id}`}>
                      {(item.product.price * item.quantity).toFixed(2)} ₺
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-600 hover:text-red-700 mt-2"
                      data-testid={`remove-item-${item.product.id}`}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24" data-testid="order-summary">
              <h2 className="text-2xl font-bold text-[#1A4D2E] mb-6" style={{fontFamily: 'Playfair Display'}}>
                Sipariş Özeti
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-[#4A6B5A]">Ara Toplam</span>
                  <span className="font-semibold" data-testid="subtotal-amount">{getCartTotal().toFixed(2)} ₺</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4A6B5A]">Kargo</span>
                  <span className="font-semibold text-green-600">Ücretsiz</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-[#1A4D2E]">Toplam</span>
                    <span className="text-2xl font-bold text-[#FF6B00]" data-testid="total-amount">
                      {getCartTotal().toFixed(2)} ₺
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full btn-primary"
                data-testid="checkout-button"
              >
                Ödemeye Geç
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
