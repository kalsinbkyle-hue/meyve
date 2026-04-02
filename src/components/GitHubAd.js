import React from 'react';
import { Github } from 'lucide-react';

const GitHubAd = () => {
  return (
    <div className="github-ad my-12" data-testid="github-ad">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <Github size={48} className="text-white" />
          <div>
            <h3 className="text-xl font-bold text-white mb-1" style={{fontFamily: 'Playfair Display'}}>
              Açık Kaynak Topluluğu
            </h3>
            <p className="text-white/90">
              GitHub'da bizi takip edin ve projelerimize katkıda bulunun!
            </p>
          </div>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-[#1A4D2E] px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105"
          data-testid="github-link"
        >
          GitHub'da İncele
        </a>
      </div>
    </div>
  );
};

export default GitHubAd;
