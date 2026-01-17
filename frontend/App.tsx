
import React, { useState } from 'react';
import { AppView, Product, AnalysisResult } from './types.ts';
import { MOCK_PRODUCTS, MOCK_ANALYSIS } from './constants.ts';
import Navbar from './components/Navbar.tsx';
import ChatAssistant from './components/ChatAssistant.tsx';
import AnalysisDashboard from './components/AnalysisDashboard.tsx';
import { analyzeFlipkartUrl } from './services/geminiService.ts';


import Login from './components/Login.tsx';
import Signup from './components/Signup.tsx';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>('Login');
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [liveProduct, setLiveProduct] = useState<Product | null>(null);
  const [liveAnalysis, setLiveAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAnalyze = async (url?: string) => {
    const targetUrl = url || urlInput;
    if (!targetUrl.trim()) return;
    setIsLoading(true);
    try {
      const result = await analyzeFlipkartUrl(targetUrl);

      // Validate image URL - only accept Flipkart images or empty
      let validImage = result.productInfo.image;
      if (validImage && !validImage.includes('flipkart') && !validImage.includes('cdn')) {
        validImage = MOCK_PRODUCTS[0].image;
      }

      const productData: Product = {
        id: 'live-' + Math.random(),
        name: result.productInfo.name || 'Flipkart Product',
        price: result.productInfo.price || 0,
        originalPrice: (result.productInfo.price || 0) * 1.2,
        rating: result.productInfo.rating || 4.5, // Use scraped rating if available
        reviewCount: result.productInfo.reviewCount || 0,
        image: validImage || MOCK_PRODUCTS[0].image, // Fallback image
        category: 'Marketplace Scan',
        seller: 'Verified AI Seller',
        description: result.productInfo.description || '',
        reviews: []
      };
      setLiveProduct(productData);
      setLiveAnalysis({ ...result.analysis, groundingSources: result.groundingSources });
      setView('Analysis');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Analysis Error:", errorMessage);

      let userMessage = "Analysis failed. Loading demo data.";
      if (errorMessage.includes("quota")) {
        userMessage = "API quota exceeded. Loading demo data.";
      } else if (errorMessage.includes("API")) {
        userMessage = "API service error. Loading demo data.";
      }

      alert(userMessage);
      // Stay on dashboard to let user retry with a different URL or fix connection
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHome = () => (
    <div className="flex-grow flex flex-col items-center bg-[#1a0b2e] text-white overflow-hidden relative selection:bg-[#2874f0]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full -mr-48 -mt-48"></div>
      <div className="container mx-auto px-6 pt-32 pb-20 flex flex-col md:flex-row items-center justify-between z-10">
        <div className="md:w-1/2 space-y-12 animate-fadeIn">
          <div className="space-y-4">
            <p className="text-[#2874f0] font-black tracking-[0.4em] uppercase text-sm mb-4">FlipSort Engine</p>
            <h1 className="text-8xl font-black leading-[0.9] tracking-tighter">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Ananya</span><br />
              <span className="text-3xl font-bold opacity-60 mt-8 block leading-tight">Scale your brand protection with FlipSort</span>
            </h1>
          </div>
          <div className="flex items-center space-x-10">
            <div className="p-6 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl">
              <svg className="w-16 h-16 text-[#2874f0]" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM16.243 16.243a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707z" /></svg>
            </div>
            <div>
              <h2 className="text-4xl font-black uppercase tracking-[0.2em] italic text-[#2874f0] leading-none mb-1">FlipSort</h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em]">DeBERTa v3 Large + YOLO Active</p>
            </div>
          </div>
          <button onClick={() => setView('Dashboard')} className="px-20 py-7 bg-[#2874f0] rounded-full font-black text-xl shadow-[0_20px_60px_-15px_rgba(40,116,240,0.6)] hover:scale-105 transition-all active:scale-95 uppercase tracking-[0.2em]">
            Enter Audit Suite
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center perspective-2000">
          <div className="w-[360px] h-[680px] bg-white rounded-[5rem] border-[18px] border-gray-900 shadow-2xl relative overflow-hidden transform rotate-2 hover:rotate-0 transition-all duration-1000 group">
            <div className="p-10 pt-20 h-full bg-gray-50 flex flex-col items-center">
              <div className="w-24 h-24 bg-[#2874f0] rounded-[2.5rem] flex items-center justify-center text-white font-black text-5xl mb-16 shadow-2xl">FS</div>
              <div className="w-full space-y-6 px-6 opacity-30">
                <div className="h-2.5 w-full bg-gray-800 rounded-full"></div>
                <div className="h-2.5 w-3/4 bg-gray-800 rounded-full"></div>
                <div className="h-2.5 w-full bg-gray-800 rounded-full"></div>
              </div>
              <div className="mt-32">
                <svg className="w-48 h-48 text-gray-200" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168l4.74 2.615a.5.5 0 010 .864l-4.74 2.615a.5.5 0 01-.755-.432V7.6a.5.5 0 01.755-.432z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="flex-grow bg-[#f0f2f5] min-h-screen">
      <div className="bg-white p-12 border-b sticky top-[64px] z-30 shadow-xl">
        <div className="max-w-6xl mx-auto flex gap-8">
          <div className="relative flex-grow">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Paste Flipkart Product URL for AI Audit..."
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-12 py-7 text-2xl outline-none focus:border-[#2874f0] shadow-inner font-bold placeholder:text-gray-300"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          <button onClick={() => handleAnalyze()} disabled={isLoading} className="bg-[#2874f0] text-white px-20 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-[#1e5ebc] transition-all hover:-translate-y-1 active:translate-y-0 uppercase tracking-tighter">
            {isLoading ? 'Scanning...' : 'Analyze'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">Live Marketplace Feed</h2>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Real-time listing audits active</p>
          </div>
          <div className="flex gap-4">
            <span className="bg-white px-5 py-2 rounded-full text-[10px] font-black shadow-sm border border-gray-100 uppercase text-gray-400 tracking-widest">Global Scan: Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {MOCK_PRODUCTS.map(p => (
            <div key={p.id} className="bg-white rounded-[3rem] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-gray-100 hover:shadow-[0_30px_70px_rgba(40,116,240,0.15)] transition-all group flex flex-col h-full hover:-translate-y-3 duration-500">
              <div className="h-72 bg-[#f8faff] p-12 relative flex items-center justify-center overflow-hidden">
                <img src={p.image} className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-1000" alt={p.name} />
                <div className="absolute top-8 right-8 bg-[#2874f0] text-white text-[9px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest">New Feed</div>
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-12 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 line-clamp-2 leading-tight mb-4 tracking-tight">{p.name}</h3>
                  <p className="text-4xl font-black text-[#2874f0] mb-10 tracking-tighter">₹{p.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleAnalyze('https://www.flipkart.com/item/' + p.id)}
                  className="w-full bg-[#fb641b] text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-[#e65c19] transition-all shadow-[0_15px_40px_-10px_rgba(251,100,27,0.4)] active:scale-95"
                >
                  Fake or Genuine?
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col font-inter selection:bg-[#2874f0] selection:text-white bg-[#f8faff]">
      <Navbar
        currentView={currentView}
        setView={setView}
        isLoggedIn={isLoggedIn}
        onLogout={() => { setIsLoggedIn(false); setView('Home'); }}
      />
      <main className="flex-grow flex flex-col">
        {currentView === 'Home' && renderHome()}
        {currentView === 'Dashboard' && renderDashboard()}
        {currentView === 'Analysis' && liveProduct && liveAnalysis && (
          <AnalysisDashboard product={liveProduct} analysis={liveAnalysis} />
        )}
        {currentView === 'Login' && <Login setView={setView} setIsLoggedIn={setIsLoggedIn} />}
        {currentView === 'Signup' && <Signup setView={setView} setIsLoggedIn={setIsLoggedIn} />}
      </main>
      <ChatAssistant product={liveProduct ?? undefined} />

      {isLoading && (
        <div className="fixed inset-0 bg-[#1a0b2e]/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center text-white">
          <div className="relative">
            <div className="w-32 h-32 border-[10px] border-white/5 border-t-[#2874f0] rounded-full animate-spin mb-16 shadow-[0_0_60px_rgba(40,116,240,0.4)]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-[#2874f0] rounded-full animate-ping"></div>
            </div>
          </div>
          <p className="text-5xl font-black tracking-tighter animate-pulse italic">SCRUTINIZING FLIPKART DATA</p>
          <div className="mt-6 flex gap-4">
            <p className="text-gray-500 font-black text-xs uppercase tracking-[0.6em]">DeBERTa v3</p>
            <p className="text-gray-500 font-black text-xs uppercase tracking-[0.6em] border-l border-white/10 pl-4">YOLO Analysis</p>
            <p className="text-gray-500 font-black text-xs uppercase tracking-[0.6em] border-l border-white/10 pl-4">Audit Active</p>
          </div>
        </div>
      )}
    </div>
  );
};


export default App;
