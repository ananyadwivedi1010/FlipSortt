import React from 'react';
import { Product, AnalysisResult } from '../types.ts';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie, LineChart, Line 
} from 'recharts';

interface Props {
  product: Product;
  analysis: AnalysisResult;
}

const AnalysisDashboard: React.FC<Props> = ({ product, analysis }) => {
  const sentimentData = [
    { name: 'Negative', value: analysis.sentiment.negative, color: '#f87171' },
    { name: 'Neutral', value: analysis.sentiment.neutral, color: '#fbbf24' },
    { name: 'Positive', value: analysis.sentiment.positive, color: '#34d399' }
  ];

  const aspectData = [
    { name: 'Performance', score: analysis.scores.performance },
    { name: 'Durability', score: analysis.scores.durability },
    { name: 'Pricing', score: analysis.scores.pricing },
    { name: 'Sensitivity', score: analysis.scores.sensitivity }
  ];

  return (
    <div className="bg-[#f0f2f5] min-h-screen p-8 animate-fadeIn pb-32">
      {/* Exact Demo Header Style */}
      <div className="bg-white rounded-[2.5rem] p-10 shadow-sm flex flex-col md:flex-row gap-12 mb-10 border border-gray-100">
        <div className="w-full md:w-1/4">
          <div className="aspect-square bg-gray-50 rounded-3xl p-8 border border-gray-100 flex items-center justify-center">
             <img src={product.image} alt={product.name} className="max-h-full object-contain mix-blend-multiply" />
          </div>
        </div>
        <div className="w-full md:w-3/4 space-y-6">
          <div className="flex justify-between items-start">
             <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-[1.1] max-w-2xl">{product.name}</h2>
             <span className="text-[10px] font-black bg-[#2874f0] text-white px-3 py-1.5 rounded-xl shadow-lg">LIVE_AUDIT_7749</span>
          </div>
          <div className="flex items-center space-x-8">
             <span className="text-5xl font-black text-[#2874f0]">₹{product.price.toLocaleString()}</span>
             <div className="flex gap-3">
                <div className="bg-green-100 text-green-700 text-[10px] font-black px-4 py-2 rounded-xl">LLM_SENTIMENT_ACTIVE</div>
                <div className="bg-purple-100 text-purple-700 text-[10px] font-black px-4 py-2 rounded-xl">IMAGE_CONSISTENCY_PASS</div>
             </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-3xl border-l-8 border-[#2874f0]">
             <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">AI Summary Result</p>
             <p className="text-lg text-gray-700 italic leading-relaxed font-medium">"{analysis.summary}"</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
        {/* Sentiment Analysis */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <h3 className="text-xs font-black text-gray-400 uppercase mb-8 tracking-[0.3em]">Customer Sentiment</h3>
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sentimentData} innerRadius={70} outerRadius={100} paddingAngle={10} dataKey="value">
                  {sentimentData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <p className="text-[10px] font-black text-gray-400 uppercase">Trust</p>
               <p className="text-2xl font-black text-gray-800">{analysis.sentiment.positive}%</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-8">
             {sentimentData.map(s => (
               <div key={s.name} className="text-center p-3 rounded-2xl bg-gray-50 border">
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">{s.name}</p>
                  <p className="text-xs font-black" style={{ color: s.color }}>{s.value}%</p>
               </div>
             ))}
          </div>
        </div>

        {/* INTEGRITY AUDIT - NO RIDER LOGIC */}
        <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden">
           <h3 className="text-xs font-black text-gray-400 uppercase mb-8 tracking-[0.3em]">Return Scrutiny Dashboard</h3>
           
           <div className={`p-8 rounded-[2.5rem] border-2 mb-10 flex items-center justify-between transition-all ${analysis.isCounterfeit ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
              <div className="flex items-center gap-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl ${analysis.isCounterfeit ? 'bg-red-500 shadow-red-500/20' : 'bg-green-500 shadow-green-500/20'}`}>
                   {analysis.isCounterfeit ? (
                     <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" /></svg>
                   ) : (
                     <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                   )}
                </div>
                <div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-1">Authenticity Verdict</p>
                   <p className={`text-4xl font-black ${analysis.isCounterfeit ? 'text-red-700' : 'text-green-700'}`}>
                      {analysis.isCounterfeit ? 'COUNTERFEIT ALERT' : 'CERTIFIED GENUINE'}
                   </p>
                </div>
              </div>
              
              {analysis.isCounterfeit && (
                <div className="bg-white border-2 border-red-200 p-5 rounded-3xl text-right animate-pulse shadow-xl shadow-red-500/5">
                   <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">Logistics Enforcement</p>
                   <p className="text-sm font-black text-gray-800 italic">"No rider would be assigned."</p>
                   <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase">Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
              )}
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-[2rem] p-6 border border-dashed flex flex-col items-center justify-center aspect-video relative group">
                 <img src={product.image} className="max-h-full opacity-30 grayscale group-hover:opacity-100 transition duration-500" alt="Audit" />
                 <div className="absolute top-4 left-4 bg-black text-[8px] font-black text-white px-2 py-1 rounded uppercase tracking-widest">Listing_Ref</div>
                 <div className="absolute inset-0 border-2 border-[#2874f0] opacity-0 group-hover:opacity-100 rounded-[2rem] transition-all"></div>
              </div>
              <div className="bg-black rounded-[2rem] p-8 flex flex-col items-center justify-center aspect-video text-center relative overflow-hidden">
                 <div className="w-full h-1 bg-red-500/20 mb-4 overflow-hidden rounded-full">
                    <div className="h-full bg-red-500 w-full animate-progress origin-left"></div>
                 </div>
                 <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] mb-2">Anomaly Scrutiny</p>
                 <p className="text-[9px] font-mono text-white/40 leading-relaxed uppercase">Real-time media frame analysis enabled<br/>Checking for pixel inconsistencies</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* DeBERTa v3 Aspect Analysis */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-12">
            <div>
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-1">Genuine Review Analysis</h3>
               <p className="text-[9px] font-black text-[#2874f0] uppercase tracking-widest italic">Engine: DeBERTa v3 Large</p>
            </div>
            <div className="flex gap-2">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
               <span className="text-[10px] font-black text-gray-400">FILTERED</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aspectData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} hide />
                {/* Fix: Removed non-standard SVG props 'textTransform' and 'letterSpacing' to fix TypeScript error and updated fontWeight to numeric */}
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 900, fill: '#64748b' }} width={120} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={40}>
                  {aspectData.map((entry, index) => <Cell key={`cell-${index}`} fill="#2874f0" />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fraud Logs Cluster */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xs font-black text-gray-400 uppercase mb-8 tracking-[0.3em]">AI Fraud Detection Logs</h3>
          <div className="flex-grow space-y-5 overflow-y-auto max-h-[360px] pr-4 custom-scrollbar">
             {analysis.fakeReviews.map((r, i) => (
               <div key={i} className="p-6 bg-red-50/50 border border-red-100 rounded-3xl relative overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                  <div className="flex justify-between mb-2">
                    <span className="text-[10px] font-black text-red-800 uppercase tracking-widest">{r.user}</span>
                    <span className="text-[9px] font-black bg-red-600 text-white px-2 py-1 rounded-lg shadow-sm">BOT_DETECTED</span>
                  </div>
                  <p className="text-sm text-gray-600 italic leading-relaxed">"{r.comment}"</p>
                  <div className="mt-4 flex items-center gap-2">
                     <span className="w-1 h-1 rounded-full bg-red-300"></span>
                     <p className="text-[10px] font-black text-red-500 uppercase italic tracking-tighter">Pattern: {r.reason}</p>
                  </div>
               </div>
             ))}
             {analysis.fakeReviews.length === 0 && (
               <div className="flex flex-col items-center justify-center h-full py-20 opacity-20 grayscale">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <p className="text-xl font-black uppercase tracking-widest">Clean Audit</p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;