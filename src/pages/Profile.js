import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-[#1A4D2E]">Yüklenïyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="profile-page">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#1A4D2E] mb-8" style={{fontFamily: 'Playfair Display'}}>
          Profilim
        </h1>

        <div className="card p-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="bg-[#FF6B00] text-white w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#1A4D2E]" style={{fontFamily: 'Playfair Display'}}>
                {user.name}
              </h2>
              <p className="text-[#4A6B5A]">Üye</p>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3 py-3 border-b" data-testid="profile-name">
              <User className="text-[#FF6B00]" size={24} />
              <div>
                <p className="text-sm text-[#4A6B5A]">Ad Soyad</p>
                <p className="font-semibold text-[#1A4D2E]">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 py-3 border-b" data-testid="profile-email">
              <Mail className="text-[#FF6B00]" size={24} />
              <div>
                <p className="text-sm text-[#4A6B5A]">E-posta</p>
                <p className="font-semibold text-[#1A4D2E]">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 py-3" data-testid="profile-joined">
              <Calendar className="text-[#FF6B00]" size={24} />
              <div>
                <p className="text-sm text-[#4A6B5A]">Katılım Tarihi</p>
                <p className="font-semibold text-[#1A4D2E]">
                  {new Date(user.timestamp).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button onClick={() => navigate('/orders')} className="btn-secondary flex-1" data-testid="view-orders-button">
              Siparişlerim
            </button>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-full transition-all flex-1" data-testid="logout-button">
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
