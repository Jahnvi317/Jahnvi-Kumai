
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-6 px-4 mb-8 border-b border-white/10 flex items-center justify-between sticky top-0 z-50 glass">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <i className="fas fa-microchip text-xl"></i>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          VisionaryAI
        </h1>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <span className="hover:text-white transition-colors cursor-pointer">Explore</span>
        <span className="hover:text-white transition-colors cursor-pointer">Docs</span>
        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-indigo-400">
          v3.0 Preview
        </div>
      </div>
    </header>
  );
};

export default Header;
