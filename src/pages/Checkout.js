import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const navigate = useNavigate();
  const { cart, getCartTotal } = useCart();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);

  useEffect(() => {
    if (sessionId) {
      // Returning from Stripe, check payment status
      pollPaymentStatus(sessionId);
    }
  }, [sessionId]);

  const pollPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 5;
    const pollInterval = 2000; // 2 seconds

    if (attempts >= maxAttempts) {
      setPaymentStatus('timeout');
      toast.error('Ödeme durumu kontrol edilemedi. Lütfen siparişlerinizi kontrol edin.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API}/checkout/status/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.payment_status === 'paid') {
        setPaymentStatus('success');
        toast.success('Ödeme başarılı! Siparişiniz oluşturuldu.');
        setLoading(false);
        return;
      } else if (response.data.payment_status === 'failed') {
        setPaymentStatus('failed');
        toast.error('Ödeme başarısız oldu.');
        setLoading(false);
        return;
      }

      // Continue polling
      setPollingAttempts(attempts + 1);
      setTimeout(() => pollPaymentStatus(sessionId, attempts + 1), pollInterval);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setPaymentStatus('error');
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      toast.error('Sepetiniz boş');
      return;
    }

    setLoading(true);
    try {
      const originUrl = window.location.origin;
      const response = await axios.post(
        `${API}/checkout/create`,
        { origin_url: originUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Ödeme oluşturulurken hata oluştu');
      setLoading(false);
    }
  };

  // If returning from Stripe with session_id
  if (sessionId) {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center" data-testid="payment-processing">
          <div className="text-center">
            <Loader className="animate-spin h-16 w-16 text-[#FF6B00] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#1A4D2E] mb-2" style={{fontFamily: 'Playfair Display'}}>
              Ödeme durumu kontrol ediliyor...
            </h2>
            <p className="text-[#4A6B5A]">Lütfen bekleyin ({pollingAttempts + 1}/5)</p>
          </div>
        </div>
      );
    }

    if (paymentStatus === 'success') {
      return (
        <div className="min-h-screen flex items-center justify-center" data-testid="payment-success">
          <div className="card p-12 text-center max-w-md">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#1A4D2E] mb-4" style={{fontFamily: 'Playfair Display'}}>
              Ödeme Başarılı!
            </h2>
            <p className="text-[#4A6B5A] mb-6">
              Siparişiniz başarıyla oluşturuldu. Teşekkür ederiz!
            </p>
            <button onClick={() => navigate('/orders')} className="btn-primary" data-testid="view-orders-button">
              Siparişlerime Git
            </button>
          </div>
        </div>
      );
    }

    if (paymentStatus === 'failed' || paymentStatus === 'error' || paymentStatus === 'timeout') {
      return (
        <div className="min-h-screen flex items-center justify-center" data-testid="payment-failed">
          <div className="card p-12 text-center max-w-md">
            <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#1A4D2E] mb-4" style={{fontFamily: 'Playfair Display'}}>
              Ödeme Başarısız
            </h2>
            <p className="text-[#4A6B5A] mb-6">
              Ödeme işlemi tamamlanamadı. Lütfen tekrar deneyin.
            </p>
            <button onClick={() => navigate('/cart')} className="btn-primary" data-testid="back-to-cart-button">
              Sepete Dön
            </button>
          </div>
        </div>
      );
    }
  }

  // Regular checkout page
  return (
    <div className="min-h-screen py-12" data-testid="checkout-page">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#1A4D2E] mb-8" style={{fontFamily: 'Playfair Display'}}>
          Ödeme
        </h1>

        <div className="card p-8">
          <h2 className="text-2xl font-bold text-[#1A4D2E] mb-6" style={{fontFamily: 'Playfair Display'}}>
            Sipariş Özeti
          </h2>

          <div className="space-y-4 mb-6">
            {cart.items.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center py-3 border-b">
                <div className="flex items-center space-x-4">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold text-[#1A4D2E]">{item.product.name}</p>
                    <p className="text-sm text-[#4A6B5A]">Miktar: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-[#FF6B00]">
                  {(item.product.price * item.quantity).toFixed(2)} ₺
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-[#4A6B5A]">Ara Toplam</span>
              <span className="font-semibold">{getCartTotal().toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4A6B5A]">Kargo</span>
              <span className="font-semibold text-green-600">Ücretsiz</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2">
              <span className="text-[#1A4D2E]">Toplam</span>
              <span className="text-[#FF6B00]" data-testid="checkout-total">{getCartTotal().toFixed(2)} ₺</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="proceed-to-payment-button"
          >
            {loading ? 'Ödeme oluşturuluyor...' : 'Stripe ile Öde'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
