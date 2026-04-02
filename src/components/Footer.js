import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1A4D2E] text-white py-12 mt-24" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4" style={{fontFamily: 'Playfair Display'}}>Taze Market</h3>
            <p className="text-white/80">
              En taze meyve ve sebzeler kapınızda!
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Kategoriler</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link to="/products?category=fruit" className="hover:text-[#FF6B00] transition">Meyveler</Link></li>
              <li><Link to="/products?category=vegetable" className="hover:text-[#FF6B00] transition">Sebzeler</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Hakkımızda</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-[#FF6B00] transition">Bizim Hikayemiz</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition">İletişim</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Destek</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-[#FF6B00] transition">SSS</a></li>
              <li><a href="#" className="hover:text-[#FF6B00] transition">Gönderim Bilgisi</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; 2024 Taze Market. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
