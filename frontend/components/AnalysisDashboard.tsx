
import React from 'react';
import { Product, AnalysisResult } from '../types.ts';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie
} from 'recharts';

interface Props {
  product: Product;
  analysis: AnalysisResult;
}

const AnalysisDashboard: React.FC<Props> = ({ product, analysis }) => {
  const sentimentData = [
    { name: 'Negative', value: analysis.sentiment.negative, color: '#ff4d4d' },
    { name: 'Neutral', value: analysis.sentiment.neutral, color: '#ffc107' },
    { name: 'Positive', value: analysis.sentiment.positive, color: '#00c853' }
  ];

  const aspectData = [
    { name: 'Performance', score: analysis.scores.performance },
    { name: 'Durability', score: analysis.scores.durability },
    { name: 'Pricing', score: analysis.scores.pricing },
    { name: 'Sensitivity', score: analysis.scores.sensitivity }
  ];

  return (
    <div className="bg-[#f8faff] min-h-screen p-6 animate-fadeIn pb-32 font-inter">
      {/* Product Information Header */}
      <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col md:flex-row gap-10 mb-8">
        <div className="w-full md:w-1/4">
          <div className="aspect-square bg-gray-50 rounded-[1.5rem] p-6 border border-gray-100 flex items-center justify-center relative overflow-hidden group">
             <img src={product.image} alt={product.name} className="max-h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" />
             <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
        <div className="w-full md:w-3/4 flex flex-col justify-center space-y-4">
          <div className="flex justify-between items-start">
             <h2 className="text-3xl font-black text-gray-900 leading-tight tracking-tight">{product.name}</h2>
             <span className="text-[10px] font-black bg-[#2874f0] text-white px-3 py-1.5 rounded-lg shadow-lg uppercase tracking-widest">LIVE_DATA</span>
          </div>
          <div className="flex items-center space-x-6">
             <span className="text-5xl font-black text-[#2874f0]">₹{product.price.toLocaleString()}</span>
             <div className="flex gap-2">
                <span className="bg-blue-50 text-[#2874f0] text-[9px] font-black px-3 py-1.5 rounded-lg border border-blue-100 uppercase">Audit Verified</span>
                <span className="bg-gray-100 text-gray-500 text-[9px] font-black px-3 py-1.5 rounded-lg border border-gray-200 uppercase">Gemini 3.0 Pro</span>
             </div>
          </div>
          <div className="bg-[#f8faff] p-6 rounded-[1.5rem] border-l-[6px] border-[#2874f0]">
             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">AI Audit Summary</p>
             <p className="text-gray-700 font-medium italic">"{analysis.summary}"</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Sentiment Analysis Card */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
          <h3 className="text-xs font-black text-gray-400 uppercase mb-8 tracking-[0.2em]">Customer Sentiment</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sentimentData} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                  {sentimentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <p className="text-[10px] font-black text-gray-400 uppercase">Trust Score</p>
               <p className="text-3xl font-black text-gray-800">{analysis.sentiment.positive}%</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6">
             {sentimentData.map(s => (
               <div key={s.name} className="text-center p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">{s.name}</p>
                  <p className="text-xs font-black" style={{ color: s.color }}>{s.value}%</p>
               </div>
             ))}
          </div>
        </div>

        {/* COUNTERFEIT DETECTION BLOCK - EXACT DEMO STYLE */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden relative">
           <div className="flex justify-between items-center mb-10">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Counterfeit Scrutiny Engine</h3>
              {analysis.isCounterfeit ? (
                <div className="bg-red-500 text-white text-[9px] font-black px-4 py-2 rounded-full shadow-lg animate-pulse uppercase tracking-widest">Action Required</div>
              ) : (
                <div className="bg-green-500 text-white text-[9px] font-black px-4 py-2 rounded-full shadow-lg uppercase tracking-widest">Safe Listing</div>
              )}
           </div>
           
           <div className={`p-10 rounded-[1.5rem] border-2 mb-10 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-700 ${analysis.isCounterfeit ? 'bg-red-50 border-red-100 shadow-[0_15px_40px_rgba(239,68,68,0.1)]' : 'bg-green-50 border-green-100 shadow-[0_15px_40px_rgba(34,197,94,0.1)]'}`}>
              <div className="flex items-center gap-8">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transform transition hover:scale-110 ${analysis.isCounterfeit ? 'bg-red-500 shadow-red-500/30' : 'bg-green-500 shadow-green-500/30'}`}>
                   {analysis.isCounterfeit ? (
                     <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                   ) : (
                     <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                   )}
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Authenticity Verdict</p>
                   <p className={`text-4xl font-black tracking-tighter ${analysis.isCounterfeit ? 'text-red-700' : 'text-green-700'}`}>
                      {analysis.isCounterfeit ? 'COUNTERFEIT ALERT' : 'CERTIFIED ORIGINAL'}
                   </p>
                </div>
              </div>
              
              {analysis.isCounterfeit && (
                <div className="bg-white border border-red-200 p-6 rounded-[1.5rem] text-right shadow-sm border-l-[8px] border-l-red-500">
                   <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Return Process Policy</p>
                   <p className="text-lg font-black text-gray-800 italic leading-tight">"No rider would be assigned."</p>
                   <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase">Audit ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
              )}
           </div>

           <div className="grid grid-cols-2 gap-6 opacity-60">
              <div className="bg-gray-50 rounded-[1.5rem] p-6 border border-dashed flex flex-col items-center justify-center aspect-video relative group overflow-hidden">
                 <img src={product.image} className="max-h-full grayscale group-hover:grayscale-0 transition-all duration-700" alt="Audit" />
                 <div className="absolute top-4 left-4 bg-black text-[8px] font-black text-white px-2 py-1 rounded-md uppercase tracking-widest">Ground_Truth</div>
              </div>
              <div className="bg-black rounded-[1.5rem] p-8 flex flex-col items-center justify-center aspect-video text-center relative">
                 <div className="w-full h-1 bg-red-500/20 mb-4 overflow-hidden rounded-full">
                    <div className="h-full bg-red-500 w-full animate-progress origin-left"></div>
                 </div>
                 <p className="text-[9px] font-black text-white uppercase tracking-[0.4em] mb-1">Media Frame Analysis</p>
                 <p className="text-[8px] font-mono text-white/30 uppercase">Scanning for structural inconsistencies...</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DeBERTa v3 Metrics - EXACT DEMO STYLE */}
        <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-12">
            <div>
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Genuine Review Analysis</h3>
               <p className="text-[10px] font-black text-[#2874f0] uppercase tracking-widest italic underline decoration-2 decoration-blue-100">Proprietary DeBERTa v3 Large</p>
            </div>
            <div className="flex gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse self-center"></div>
               <span className="text-[9px] font-black text-blue-600 tracking-widest">ACTIVE SCAN</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aspectData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} width={120} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="score" radius={[0, 12, 12, 0]} barSize={40}>
                  {aspectData.map((entry, index) => <Cell key={`cell-${index}`} fill="#2874f0" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[10px] font-bold text-gray-400 mt-6 text-center uppercase tracking-[0.2em]">Note: AI has filtered anomalous bot ratings to calculate true scores.</p>
        </div>

        {/* Fraudulent Logs Sidebar */}
        <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Integrity Detection Logs</h3>
             <span className="text-[8px] font-black bg-red-100 text-red-600 px-3 py-1.5 rounded-full uppercase">Suspicious Patterns</span>
          </div>
          <div className="flex-grow space-y-5 overflow-y-auto max-h-[380px] pr-4 custom-scrollbar">
             {analysis.fakeReviews.map((r, i) => (
               <div key={i} className="p-6 bg-red-50/40 border border-red-100 rounded-[1.5rem] relative overflow-hidden group hover:bg-red-50 transition-colors">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500"></div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-black text-red-800 uppercase tracking-widest">{r.user}</span>
                    <span className="text-[8px] font-black bg-red-600 text-white px-2 py-1 rounded-md shadow-sm">BOT_PATTERN</span>
                  </div>
                  <p className="text-sm text-gray-600 italic leading-relaxed font-medium">"{r.comment}"</p>
                  <div className="mt-4 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                     <p className="text-[10px] font-black text-red-500 uppercase italic tracking-tight">Detection Reason: {r.reason}</p>
                  </div>
               </div>
             ))}
             {analysis.fakeReviews.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full py-20 opacity-20 grayscale">
                  <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-xl font-black uppercase tracking-[0.4em]">Audit Clean</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
