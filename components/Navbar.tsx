
import React from 'react';
import { AppView } from '../types.ts';
import { COLORS } from '../constants.ts';

interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  return (
    <nav className="bg-[#2874f0] text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex flex-col cursor-pointer" onClick={() => setView('Consumer')}>
            <h1 className="text-xl font-bold italic">FlipIntegrity <span className="text-[#fb641b]">AI</span></h1>
            <span className="text-[10px] text-gray-200 uppercase tracking-widest -mt-1">TrustGuard for Flipkart</span>
          </div>
          
          <div className="hidden md:flex bg-white rounded-sm w-[400px] items-center px-4 py-1.5 shadow-sm">
            <input 
              type="text" 
              placeholder="Search for products, brands and more" 
              className="bg-transparent text-gray-800 outline-none flex-grow text-sm"
            />
            <svg className="w-4 h-4 text-[#2874f0]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setView('Consumer')}
            className={`px-3 py-1 text-sm font-medium rounded transition ${currentView === 'Consumer' ? 'bg-white/20' : ''}`}
          >
            Shopping
          </button>
          <button 
            onClick={() => setView('Seller')}
            className={`px-3 py-1 text-sm font-medium rounded transition ${currentView === 'Seller' ? 'bg-white/20' : ''}`}
          >
            Seller Portal
          </button>
          <button 
            onClick={() => setView('Admin')}
            className={`px-3 py-1 text-sm font-medium rounded transition ${currentView === 'Admin' ? 'bg-white/20' : ''}`}
          >
            Enforcement
          </button>
          <div className="bg-[#fb641b] px-4 py-1 text-sm font-bold rounded-sm cursor-pointer shadow-md hover:bg-[#e65a18] transition">
            Login
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
