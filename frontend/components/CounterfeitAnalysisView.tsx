
import React, { useState } from 'react';
import { Product, AnalysisResult } from '../types.ts';
import CounterfeitDetection from './CounterfeitDetection.tsx';

interface Props {
  product: Product | null;
  analysis: AnalysisResult | null;
}

const CounterfeitAnalysisView: React.FC<Props> = ({ product, analysis }) => {
  if (!product || !analysis) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#f0f2f5] min-h-screen">
        <div className="text-center p-12 bg-white rounded-2xl shadow-sm border">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-xl font-bold text-gray-800">No Data to Analyze</h3>
          <p className="text-gray-500 mt-2">Please search for a Flipkart product in the Dashboard first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#f0f2f5] min-h-screen pb-20">
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-[64px] z-40">
        <h2 className="text-2xl font-bold text-gray-800">Detailed Integrity Report</h2>
        <div className="flex gap-4">
          <button className="bg-[#7e22ce] text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-[#6b1cb8] transition">
            EXPORT REPORT
          </button>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Verification Status Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
           <div>
              <h3 className="text-2xl font-bold text-gray-800">Product Integrity Check</h3>
              <p className="text-gray-500 mt-1">AI Scan completed via Google Search Grounding</p>
           </div>
           <div className={`px-8 py-4 rounded-xl flex items-center gap-4 ${analysis.isCounterfeit ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
              <div className={`w-3 h-3 rounded-full animate-pulse ${analysis.isCounterfeit ? 'bg-red-500' : 'bg-green-500'}`}></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verdict</p>
                <p className={`text-xl font-black uppercase ${analysis.isCounterfeit ? 'text-red-600' : 'text-green-600'}`}>
                   {analysis.isCounterfeit ? 'Counterfeit Detected' : 'Likely Authentic'}
                </p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Visual Evidence */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                 <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" /></svg>
                 Visual Verification
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                   <p className="text-xs font-bold text-gray-400 uppercase">Ground Truth Image</p>
                   <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border flex items-center justify-center p-4">
                      <img src={product.image} className="max-h-full object-contain" alt="Product" />
                   </div>
                </div>
                <div className="space-y-3">
                   <p className="text-xs font-bold text-gray-400 uppercase">Live Marketplace Video</p>
                   <div className="aspect-square bg-black rounded-xl overflow-hidden border relative flex items-center justify-center group cursor-pointer">
                      <svg className="w-16 h-16 text-white/30 group-hover:text-white/60 transition" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168l4.74 2.615a.5.5 0 010 .864l-4.74 2.615a.5.5 0 01-.755-.432V7.6a.5.5 0 01.755-.432z"/></svg>
                      <div className="absolute bottom-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                         <p className="text-[10px] text-white/70 font-mono">FRAME_ANALYSIS_ENABLED</p>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            {/* Custom Multi-modal Tool */}
            <CounterfeitDetection context="Listing" productName={product.name} />
          </div>

          {/* Review Integrity Sidebar */}
          <div className="space-y-8">
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                   <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                   Flagged Reviews
                </h3>
                <div className="space-y-4">
                   {analysis.fakeReviews.map((r, i) => (
                      <div key={i} className="p-4 bg-red-50/50 rounded-xl border border-red-100">
                         <p className="text-xs font-bold text-red-800">{r.user}</p>
                         <p className="text-sm text-gray-700 mt-1 italic">"{r.comment}"</p>
                         <div className="mt-3 text-[10px] font-black text-red-600 uppercase tracking-tighter bg-white px-2 py-1 rounded-md border border-red-100 inline-block">
                            Pattern: {r.reason}
                         </div>
                      </div>
                   ))}
                   {analysis.fakeReviews.length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-10">No suspicious review clusters detected.</p>
                   )}
                </div>
             </div>

             <div className="bg-[#1a0b2e] rounded-2xl p-6 shadow-xl text-white">
                <h3 className="text-lg font-bold mb-4">AI Observations</h3>
                <div className="space-y-4 text-sm text-gray-300">
                   <p className="leading-relaxed">
                      Grounding scan across Flipkart search results indicates a {analysis.authenticityOverview.genuinePercentage}% match with manufacturer specifications.
                   </p>
                   <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs font-bold text-[#7e22ce] uppercase mb-1">Risk Factor</p>
                      <p className="text-lg font-bold">{analysis.isCounterfeit ? 'CRITICAL' : 'LOW'}</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterfeitAnalysisView;
