
import React from 'react';
import { AppView } from '../types.ts';


interface NavbarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, isLoggedIn, onLogout }) => {
  return (
    <nav className="bg-[#1a0b2e] text-white shadow-xl sticky top-0 z-50 py-4 border-b border-white/5">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center space-x-12">
          <div className="flex items-center cursor-pointer group" onClick={() => setView('Home')}>
            <h1 className="text-2xl font-black tracking-tighter italic group-hover:scale-105 transition duration-300">
              <span className="text-[#2874f0]">Flip</span>Integrity
            </h1>
          </div>

          <div className="flex space-x-10">
            {['Home', 'Dashboard'].map((view) => (
              <button
                key={view}
                onClick={() => setView(view as AppView)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-b-2 py-1 ${currentView === view ? 'border-[#2874f0] text-white' : 'border-transparent text-gray-500 hover:text-white hover:border-white/20'
                  }`}
              >
                {view}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {isLoggedIn ? (
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3 text-sm font-medium cursor-pointer hover:opacity-80 transition group p-1 pr-4 bg-white/5 rounded-full border border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2874f0] to-purple-600 flex items-center justify-center text-[11px] font-black shadow-lg group-hover:scale-110 transition duration-300">A</div>
                <span className="font-black text-xs uppercase tracking-widest text-gray-300">Ananya</span>
              </div>
              <button
                onClick={onLogout}
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setView('Login')}
                className="text-[10px] font-black uppercase tracking-widest text-gray-300 hover:text-white transition"
              >
                Login
              </button>
              <button
                onClick={() => setView('Signup')}
                className="bg-[#2874f0] text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-blue-600 transition"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
