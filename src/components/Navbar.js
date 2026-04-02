import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, Heart, User, LogOut, Menu, X, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const cartCount = getCartCount();

  return (
    <nav className="glass-nav sticky top-0 z-50" data-testid="main-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center" data-testid="logo-link">
            <h1 className="text-2xl font-bold text-[#1A4D2E]" style={{fontFamily: 'Playfair Display'}}>Taze Market</h1>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] bg-white"
                data-testid="search-input"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products?category=fruit" className="text-[#1A4D2E] hover:text-[#FF6B00] font-medium transition" data-testid="fruits-link">
              Meyveler
            </Link>
            <Link to="/products?category=vegetable" className="text-[#1A4D2E] hover:text-[#FF6B00] font-medium transition" data-testid="vegetables-link">
              Sebzeler
            </Link>
            
            {user ? (
              <>
                <Link to="/favorites" className="text-[#1A4D2E] hover:text-[#FF6B00] transition" data-testid="favorites-link">
                  <Heart size={24} />
                </Link>
                <Link to="/cart" className="relative text-[#1A4D2E] hover:text-[#FF6B00] transition" data-testid="cart-link">
                  <ShoppingCart size={24} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FF6B00] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center cart-badge" data-testid="cart-count">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-[#1A4D2E] hover:text-[#FF6B00] transition" data-testid="user-menu-button">
                    <User size={24} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 text-[#1A4D2E] hover:bg-[#E9F5E9]" data-testid="profile-link">
                      Profilim
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 text-[#1A4D2E] hover:bg-[#E9F5E9]" data-testid="orders-link">
                      Siparişlerim
                    </Link>
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center space-x-2" data-testid="logout-button">
                      <LogOut size={18} />
                      <span>Çıkış Yap</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/auth" className="btn-primary" data-testid="login-button">
                Giriş Yap
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#1A4D2E]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-button"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4" data-testid="mobile-menu">
            <form onSubmit={handleSearch} className="mb-4">
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]"
              />
            </form>
            <Link to="/products?category=fruit" className="block text-[#1A4D2E] hover:text-[#FF6B00] font-medium">
              Meyveler
            </Link>
            <Link to="/products?category=vegetable" className="block text-[#1A4D2E] hover:text-[#FF6B00] font-medium">
              Sebzeler
            </Link>
            {user ? (
              <>
                <Link to="/favorites" className="block text-[#1A4D2E] hover:text-[#FF6B00]">
                  Favorilerim
                </Link>
                <Link to="/cart" className="block text-[#1A4D2E] hover:text-[#FF6B00]">
                  Sepetim ({cartCount})
                </Link>
                <Link to="/profile" className="block text-[#1A4D2E] hover:text-[#FF6B00]">
                  Profilim
                </Link>
                <Link to="/orders" className="block text-[#1A4D2E] hover:text-[#FF6B00]">
                  Siparişlerim
                </Link>
                <button onClick={handleLogout} className="text-red-600 hover:text-red-700">
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn-primary inline-block">
                Giriş Yap
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
