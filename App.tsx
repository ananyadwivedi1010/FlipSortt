
import React, { useState } from 'react';
import { AppView, Product } from './types.ts';
import { MOCK_PRODUCTS, COLORS } from './constants.ts';
import Navbar from './components/Navbar.tsx';
import ReviewAnalysis from './components/ReviewAnalysis.tsx';
import CounterfeitDetection from './components/CounterfeitDetection.tsx';
import ChatAssistant from './components/ChatAssistant.tsx';

const App: React.FC = () => {
  const [currentView, setView] = useState<AppView>('Consumer');
  const [selectedProduct, setSelectedProduct] = useState<Product>(MOCK_PRODUCTS[0]);

  const renderConsumerView = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden border">
            <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-contain mix-blend-multiply" />
          </div>
        </div>
        
        <div className="w-full md:w-1/2">
          <div className="flex items-center text-xs text-gray-500 uppercase tracking-wide font-bold mb-2">
            Flipkart <span className="mx-1 text-gray-300">/</span> {selectedProduct.category}
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">{selectedProduct.name}</h1>
          
          <div className="flex items-center mb-4">
            <span className="bg-green-700 text-white text-xs font-bold px-2 py-0.5 rounded-sm flex items-center">
              {selectedProduct.rating} ★
            </span>
            <span className="text-gray-400 text-sm ml-2 font-medium">{selectedProduct.reviewCount.toLocaleString()} Ratings & {selectedProduct.reviews.length} Reviews</span>
          </div>

          <div className="flex items-baseline mb-6 space-x-2">
            <span className="text-3xl font-bold">₹{selectedProduct.price.toLocaleString()}</span>
            <span className="text-gray-400 line-through text-sm">₹{selectedProduct.originalPrice.toLocaleString()}</span>
            <span className="text-green-600 text-sm font-bold">
              {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% off
            </span>
          </div>

          <div className="flex gap-4 mb-8">
            <button className="flex-grow bg-[#ff9f00] text-white py-4 rounded-sm font-bold shadow-md uppercase hover:shadow-lg transition">
              Add to Cart
            </button>
            <button className="flex-grow bg-[#fb641b] text-white py-4 rounded-sm font-bold shadow-md uppercase hover:shadow-lg transition">
              Buy Now
            </button>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-gray-800 mb-2">Available Offers</h3>
            <div className="space-y-2">
              <div className="flex items-start text-sm">
                <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7a1 1 0 011.414-1.414L10 15.586l6.293-6.293a1 1 0 011.414 0z" /></svg>
                <p><span className="font-bold">Bank Offer</span> 10% instant discount on Flipkart Axis Bank Credit Card</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewAnalysis reviews={selectedProduct.reviews} productName={selectedProduct.name} />
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Product Returns</h2>
          <CounterfeitDetection context="Return" productName={selectedProduct.name} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
           <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
           <div className="space-y-4">
              {selectedProduct.reviews.length > 0 ? selectedProduct.reviews.map(r => (
                <div key={r.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-center mb-1">
                    <span className="bg-green-700 text-white text-[10px] font-bold px-1 rounded-sm mr-2">{r.rating} ★</span>
                    <span className="text-sm font-bold">{r.user}</span>
                    {r.isVerified && (
                      <span className="ml-2 text-[10px] text-gray-400 font-bold uppercase flex items-center">
                        <svg className="w-3 h-3 text-gray-400 mr-0.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Certified Buyer
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{r.comment}</p>
                </div>
              )) : <p className="text-sm text-gray-400 italic">No reviews yet for this product.</p>}
           </div>
        </div>
      </div>
    </div>
  );

  const renderSellerView = () => (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="bg-gradient-to-r from-[#2874f0] to-blue-400 p-8 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
        <p className="opacity-90">Manage your listings and ensure product integrity with AI verification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">Listing Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded border border-blue-100">
                <p className="text-2xl font-bold text-[#2874f0]">42</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Active Listings</p>
              </div>
              <div className="bg-red-50 p-4 rounded border border-red-100">
                <p className="text-2xl font-bold text-red-600">3</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Rejected</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">Quality Score</h3>
            <div className="flex items-center justify-center py-4">
              <div className="relative w-32 h-32 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                    <circle cx="64" cy="64" r="58" stroke="#388e3c" strokeWidth="8" strokeDasharray="364.4" strokeDashoffset="36.44" fill="transparent" strokeLinecap="round" />
                 </svg>
                 <span className="absolute text-2xl font-bold text-gray-800">92%</span>
              </div>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2 font-medium">Your account health is excellent!</p>
          </div>
        </div>

        <div className="lg:col-span-2">
          <CounterfeitDetection context="Listing" productName={selectedProduct.name} />
        </div>
      </div>
    </div>
  );

  const renderAdminView = () => (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="bg-[#fb641b] p-8 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-2">FlipIntegrity Enforcement</h1>
        <p className="opacity-90">Centralized monitoring of suspicious activities and counterfeit trends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-red-200 border-l-4 border-l-red-500">
           <h3 className="text-xs font-bold text-gray-400 uppercase">Suspicious Reviews</h3>
           <p className="text-3xl font-bold text-gray-800 mt-2">1,248</p>
           <p className="text-[10px] text-red-500 font-bold mt-1">↑ 12% from last week</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-200 border-l-4 border-l-orange-500">
           <h3 className="text-xs font-bold text-gray-400 uppercase">Counterfeit Flags</h3>
           <p className="text-3xl font-bold text-gray-800 mt-2">312</p>
           <p className="text-[10px] text-orange-500 font-bold mt-1">↓ 4% from last week</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-blue-200 border-l-4 border-l-blue-500">
           <h3 className="text-xs font-bold text-gray-400 uppercase">Verified Sellers</h3>
           <p className="text-3xl font-bold text-gray-800 mt-2">8,401</p>
           <p className="text-[10px] text-blue-500 font-bold mt-1">New Milestone</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-green-200 border-l-4 border-l-green-500">
           <h3 className="text-xs font-bold text-gray-400 uppercase">Market Integrity</h3>
           <p className="text-3xl font-bold text-gray-800 mt-2">98.4%</p>
           <p className="text-[10px] text-green-500 font-bold mt-1">Stable</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="font-bold text-gray-800 uppercase tracking-wide">Live Fraud Detection Log</h2>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded text-xs font-bold cursor-pointer hover:bg-gray-200 transition">Filter: Reviews</span>
            <span className="px-3 py-1 bg-gray-100 rounded text-xs font-bold cursor-pointer hover:bg-gray-200 transition">Filter: Listings</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Anomaly Type</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {[
                { time: '14:23:01', type: 'Review Cluster Botting', severity: 'High', entity: 'Apple iPhone 15', conf: '99.2%' },
                { time: '14:21:55', type: 'Counterfeit Match', severity: 'Medium', entity: 'Gucci Belt (M-Seller)', conf: '87.5%' },
                { time: '14:18:30', type: 'Return Fraud Attempt', severity: 'High', entity: 'Sony WH-1000XM5', conf: '94.1%' },
                { time: '14:15:12', type: 'Keyword Pattern Spam', severity: 'Low', entity: 'Casio Enticer', conf: '72.0%' }
              ].map((log, i) => (
                <tr key={i} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">{log.time}</td>
                  <td className="px-6 py-4 font-bold text-gray-700">{log.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                      log.severity === 'High' ? 'bg-red-100 text-red-700' : 
                      log.severity === 'Medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-blue-600 font-medium cursor-pointer hover:underline">{log.entity}</td>
                  <td className="px-6 py-4 font-semibold">{log.conf}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#2874f0] font-bold text-xs hover:text-blue-800 transition">Investigate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentView={currentView} setView={setView} />
      
      <main className="flex-grow bg-gray-50">
        {currentView === 'Consumer' && renderConsumerView()}
        {currentView === 'Seller' && renderSellerView()}
        {currentView === 'Admin' && renderAdminView()}
      </main>

      <footer className="bg-[#172337] text-gray-400 py-12">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">About</h4>
            <ul className="space-y-2 text-xs">
              <li>Contact Us</li>
              <li>About FlipIntegrity</li>
              <li>Flipkart Stories</li>
              <li>Corporate Information</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Help</h4>
            <ul className="space-y-2 text-xs">
              <li>Payments</li>
              <li>Shipping</li>
              <li>Cancellation & Returns</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Policy</h4>
            <ul className="space-y-2 text-xs">
              <li>Return Policy</li>
              <li>Terms Of Use</li>
              <li>Security</li>
              <li>Privacy</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Social</h4>
            <ul className="space-y-2 text-xs">
              <li>Facebook</li>
              <li>Twitter</li>
              <li>YouTube</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>© 2024 FlipIntegrity AI - Powered by Gemini. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
             <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.536 14.95a1 1 0 011.414 0l.707.707a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 010-1.414zM16.243 16.243a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414l.707.707z" /></svg> Become a Seller</span>
             <span>Gift Cards</span>
             <span>Help Center</span>
          </div>
        </div>
      </footer>

      <ChatAssistant />
    </div>
  );
};

export default App;
