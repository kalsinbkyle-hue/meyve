import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      toast.error('Siparişler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={24} />;
      default:
        return <Clock className="text-yellow-500" size={24} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
        return 'Tamamlandı';
      case 'cancelled':
        return 'İptal Edildi';
      default:
        return 'Beklemede';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-[#1A4D2E]">Yüklenïyor...</div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="empty-orders">
        <div className="text-center">
          <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#1A4D2E] mb-4" style={{fontFamily: 'Playfair Display'}}>
            Henüz Siparişiniz Yok
          </h2>
          <p className="text-[#4A6B5A] mb-6">Alışverişe başlayın!</p>
          <button onClick={() => navigate('/products')} className="btn-primary" data-testid="start-shopping-button">
            Alışverişe Başla
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="orders-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#1A4D2E] mb-8" style={{fontFamily: 'Playfair Display'}}>
          Siparişlerim
        </h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="card p-6" data-testid={`order-card-${order.id}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-[#1A4D2E] mb-1" style={{fontFamily: 'Playfair Display'}}>
                    Sipariş #{order.id.substring(0, 8)}
                  </h3>
                  <p className="text-sm text-[#4A6B5A]">
                    {new Date(order.timestamp).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex items-center space-x-2" data-testid={`order-status-${order.id}`}>
                  {getStatusIcon(order.status)}
                  <span className="font-semibold">{getStatusText(order.status)}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-[#1A4D2E]">{item.name}</p>
                      <p className="text-sm text-[#4A6B5A]">Miktar: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-[#FF6B00]">
                      {item.subtotal.toFixed(2)} ₺
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-semibold text-[#1A4D2E]">Toplam</span>
                <span className="text-2xl font-bold text-[#FF6B00]" data-testid={`order-total-${order.id}`}>
                  {order.total.toFixed(2)} ₺
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
