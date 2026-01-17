
import React, { useState } from 'react';
import { Review, AnalysisResult } from '../types.ts';
import { analyzeProductReviews } from '../services/geminiService.ts';
import { COLORS } from '../constants.ts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ReviewAnalysisProps {
  reviews: Review[];
  productName: string;
}

const ReviewAnalysis: React.FC<ReviewAnalysisProps> = ({ reviews, productName }) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeProductReviews(reviews, productName);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const scoreData = analysis ? [
    { name: 'Performance', score: analysis.scores.performance },
    { name: 'Durability', score: analysis.scores.durability },
    { name: 'Pricing', score: analysis.scores.pricing },
    { name: 'Sensitivity', score: analysis.scores.sensitivity },
  ] : [];

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      {!analysis && !loading && (
        <div className="text-center py-8">
          <button 
            onClick={handleAnalyze}
            className="bg-[#2874f0] text-white px-8 py-3 rounded font-bold shadow-lg hover:bg-[#1e5ebc] transition flex items-center justify-center mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Verify Authenticity & Get Insights
          </button>
          <p className="mt-3 text-sm text-gray-500 italic">Powered by Gemini Pro Vision & LLMs</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2874f0]"></div>
          <p className="mt-4 text-gray-600 font-medium">Scrutinizing patterns across reviews...</p>
        </div>
      )}

      {analysis && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Integrity Health</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-green-600">Genuine</span>
                <span className="text-xs font-bold">{analysis.authenticityOverview.genuinePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-green-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${analysis.authenticityOverview.genuinePercentage}%` }}></div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-orange-500">Suspicious</span>
                <span className="text-xs font-bold">{analysis.authenticityOverview.suspiciousPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-orange-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${analysis.authenticityOverview.suspiciousPercentage}%` }}></div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-red-600">Bot/Fake</span>
                <span className="text-xs font-bold">{analysis.authenticityOverview.fakePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${analysis.authenticityOverview.fakePercentage}%` }}></div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                Verified Summary
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed bg-gray-50 p-4 rounded-lg italic">
                "{analysis.summary}"
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Product Metrics</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scoreData} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12, fontWeight: 500 }} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                      {scoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.flipkartBlue} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wider">Semantic Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded-full border border-yellow-200 shadow-sm">
                    #{kw.toLowerCase().replace(/\s+/g, '')}
                  </span>
                ))}
              </div>
              <div className="mt-8 border-t pt-4">
                <p className="text-xs text-gray-400">
                  Note: AI has identified and filtered anomalous patterns to ensure score accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewAnalysis;
