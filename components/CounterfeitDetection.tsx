
import React, { useState, useRef } from 'react';
import { detectCounterfeit } from '../services/geminiService.ts';
import { CounterfeitReport } from '../types.ts';
import { COLORS } from '../constants.ts';

interface CounterfeitDetectionProps {
  context: 'Listing' | 'Return';
  productName?: string;
}

const CounterfeitDetection: React.FC<CounterfeitDetectionProps> = ({ context, productName = "Selected Product" }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<CounterfeitReport | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setReport(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const base64 = image.split(',')[1];
      const result = await detectCounterfeit(base64, productName);
      setReport(result);
    } catch (error) {
      console.error("Counterfeit detection failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-[#fb641b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        AI {context} Guard
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        {context === 'Listing' 
          ? 'Upload product images to verify authenticity before listing on Flipkart.'
          : 'Upload images of the returned item to verify it matches original state.'}
      </p>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition relative overflow-hidden"
          >
            {image ? (
              <img src={image} alt="Upload" className="w-full h-full object-contain" />
            ) : (
              <>
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-500 font-medium text-center px-4">Click or drag to upload media</span>
              </>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
          </div>

          <button 
            disabled={!image || loading}
            onClick={handleAnalyze}
            className={`w-full mt-4 py-3 rounded font-bold text-white transition flex items-center justify-center shadow-md ${!image || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#fb641b] hover:bg-[#e65a18]'}`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing Visual Integrity...
              </>
            ) : (
              'Run Authenticity Check'
            )}
          </button>
        </div>

        <div className="w-full md:w-1/2 bg-gray-50 rounded-lg p-4 border border-gray-200">
          {!report && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
              <p className="text-sm font-medium">Detailed visual analysis results will appear here after scanning</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-full space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          )}

          {report && (
            <div className="animate-fadeIn">
              <div className={`flex items-center p-3 rounded-md mb-4 ${report.isAuthentic ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {report.isAuthentic ? (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                )}
                <span className="font-bold">{report.isAuthentic ? 'Likely Authentic' : 'Counterfeit Risk Detected'}</span>
                <span className="ml-auto font-mono text-sm">{Math.round(report.confidence * 100)}% Match</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Observations</h4>
                  <ul className="space-y-1">
                    {report.visualObservations.map((obs, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="text-[#2874f0] mr-2">•</span> {obs}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {!report.isAuthentic && (
                  <div className="pt-2 border-t">
                    <h4 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2">Refusal Reasons</h4>
                    <ul className="space-y-1">
                      {report.reasons.map((reason, i) => (
                        <li key={i} className="text-sm text-red-700 flex items-start">
                          <span className="mr-2">⚠</span> {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounterfeitDetection;
