
import React, { useState } from 'react';
import { AppView, Product, AnalysisResult } from './types.ts';
import { MOCK_PRODUCTS, MOCK_ANALYSIS } from './constants.ts';
import Navbar from './components/Navbar.tsx';
import ChatAssistant from './components/ChatAssistant.tsx';
import AnalysisDashboard from './components/AnalysisDashboard.tsx';
import { analyzeFlipkartUrl } from './services/geminiService.ts';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>('Home');
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [liveProduct, setLiveProduct] = useState<Product | null>(null);
  const [liveAnalysis, setLiveAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (url?: string) => {
    const targetUrl = url || urlInput;
    if (!targetUrl.trim()) return;
    setIsLoading(true);
    try {
      const result = await analyzeFlipkartUrl(targetUrl);
      const productData: Product = {
        id: 'live-' + Math.random(),
        name: result.productInfo.name || 'Flipkart Product',
        price: result.productInfo.price || 0,
        originalPrice: (result.productInfo.price || 0) * 1.3,
        rating: 4.5,
        reviewCount: 12000,
        image: result.productInfo.image || MOCK_PRODUCTS[0].image,
        category: 'Marketplace Scan',
        seller: 'Verified AI Seller',
        description: result.productInfo.description || '',
        reviews: []
      };
      setLiveProduct(productData);
      setLiveAnalysis({ ...result.analysis, groundingSources: result.groundingSources });
      setView('Analysis');
    } catch (error) {
      console.error(error);
      alert("Scan failed. Loading Demo Audit for Ananya.");
      setLiveProduct(MOCK_PRODUCTS[0]);
      setLiveAnalysis(MOCK_ANALYSIS);
      setView('Analysis');
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
             <p className="text-[#2874f0] font-black tracking-[0.3em] uppercase text-sm mb-4">Integrity Verification Engine</p>
             <h1 className="text-8xl font-black leading-[0.9] tracking-tighter">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Ananya</span><br />
              <span className="text-4xl font-bold opacity-70 mt-6 block leading-tight">Protect your brand with our all-in-one solution</span>
             </h1>
          </div>
          <div className="flex items-center space-x-8">
             <div className="p-5 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl">
                <svg className="w-14 h-14 text-[#2874f0]" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM16.243 16.243a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707z" /></svg>
             </div>
             <div>
                <h2 className="text-4xl font-black uppercase tracking-[0.2em] italic text-[#2874f0] leading-none mb-1">FlipIntegrity AI</h2>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">Proprietary DeBERTa v3 Analysis</p>
             </div>
          </div>
          <button onClick={() => setView('Dashboard')} className="px-16 py-6 bg-[#2874f0] rounded-full font-black text-xl shadow-[0_20px_60px_-15px_rgba(40,116,240,0.5)] hover:scale-105 transition-all active:scale-95 uppercase tracking-widest">
            Explore Dashboard
          </button>
        </div>
        <div className="md:w-1/2 flex justify-center perspective-2000">
          <div className="relative w-[320px] h-[640px] bg-white rounded-[4rem] border-[14px] border-gray-900 shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-all duration-1000 group">
             <div className="p-8 pt-16 h-full bg-gray-50 flex flex-col items-center">
                <div className="w-20 h-20 bg-[#2874f0] rounded-[2rem] flex items-center justify-center text-white font-black text-4xl mb-12 shadow-2xl">FI</div>
                <div className="w-full space-y-4 px-4 opacity-20">
                   <div className="h-2 w-full bg-gray-800 rounded"></div>
                   <div className="h-2 w-2/3 bg-gray-800 rounded"></div>
                </div>
                <div className="mt-20">
                   <svg className="w-40 h-40 text-gray-100" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168l4.74 2.615a.5.5 0 010 .864l-4.74 2.615a.5.5 0 01-.755-.432V7.6a.5.5 0 01.755-.432z"/></svg>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="flex-grow bg-[#f0f2f5] min-h-screen">
      <div className="bg-white p-10 border-b sticky top-[64px] z-30 shadow-md">
        <div className="max-w-5xl mx-auto flex gap-6">
          <input 
            type="text" 
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="Search or paste Flipkart URL..." 
            className="flex-grow bg-gray-50 border-2 border-gray-100 rounded-2xl px-10 py-6 text-xl outline-none focus:border-[#2874f0] shadow-inner font-bold"
          />
          <button onClick={() => handleAnalyze()} disabled={isLoading} className="bg-[#2874f0] text-white px-16 rounded-2xl font-black text-lg shadow-xl hover:bg-[#1e5ebc] transition-all">
            {isLoading ? 'Scanning...' : 'Analyze'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-12">
        <h2 className="text-3xl font-black text-gray-800 mb-10 tracking-tighter italic">Recent Listed Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {MOCK_PRODUCTS.map(p => (
            <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border hover:shadow-2xl transition-all group flex flex-col h-full">
              <div className="h-64 bg-gray-50 p-10 relative">
                 <img src={p.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition duration-700" alt={p.name} />
                 <div className="absolute top-6 right-6 bg-[#2874f0] text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">NEW_LISTING</div>
              </div>
              <div className="p-10 flex-grow flex flex-col justify-between">
                <div>
                   <h3 className="text-xl font-black text-gray-800 line-clamp-2 leading-tight mb-4">{p.name}</h3>
                   <p className="text-3xl font-black text-[#2874f0] mb-8">₹{p.price.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => handleAnalyze('https://www.flipkart.com/item/' + p.id)}
                  className="w-full bg-[#fb641b] text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#e65c19] transition-colors shadow-lg shadow-orange-500/20"
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
    <div className="min-h-screen flex flex-col font-inter selection:bg-[#2874f0] selection:text-white">
      <Navbar currentView={currentView} setView={setView} />
      <main className="flex-grow flex flex-col">
        {currentView === 'Home' && renderHome()}
        {currentView === 'Dashboard' && renderDashboard()}
        {currentView === 'Analysis' && liveProduct && liveAnalysis && (
          <AnalysisDashboard product={liveProduct} analysis={liveAnalysis} />
        )}
      </main>
      <ChatAssistant />
      
      {isLoading && (
        <div className="fixed inset-0 bg-[#f0f2f5]/90 backdrop-blur-sm z-[200] flex flex-col items-center justify-center">
          <div className="w-24 h-24 border-[8px] border-gray-200 border-t-[#2874f0] rounded-full animate-spin mb-10"></div>
          <p className="text-4xl font-black text-gray-800 tracking-tighter animate-pulse italic">SCRUTINIZING FLIPKART DATA...</p>
          <p className="text-gray-400 font-black text-sm uppercase tracking-[0.5em] mt-2">Simulating DeBERTa v3 & YOLO Inspection</p>
        </div>
      )}
    </div>
  );
};

export default App;
