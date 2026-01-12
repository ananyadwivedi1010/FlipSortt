
import { Product, AnalysisResult } from './types';

export const COLORS = {
  primary: '#3b0764', // Deep Purple
  accent: '#7e22ce',  // Vibrant Purple
  secondary: '#fb641b', // Flipkart Orange
  bg: '#1a0b2e',      // Nav Background
  positive: '#388e3c',
  neutral: '#fbc02d',
  negative: '#d32f2f',
  // Added flipkartBlue to fix error in ReviewAnalysis.tsx
  flipkartBlue: '#2874f0'
};

// Fix: Added missing properties 'isCounterfeit' and 'fakeReviews' to satisfy AnalysisResult interface
export const MOCK_ANALYSIS: AnalysisResult = {
  summary: "DABUR RED PASTE is a clinically proven formula that fights 7 dental problems. Reviews are generally positive but show some bot activity in the 'very fast delivery' clusters.",
  sentiment: { positive: 88, neutral: 9, negative: 3 },
  scores: { performance: 85, durability: 92, pricing: 75, sensitivity: 80 },
  keywords: ["toothpaste", "fresh", "teeth", "delivery", "quality", "natural", "value"],
  lda: [
    { topic: 'feel', count: 2 },
    { topic: 'fresh', count: 4 },
    { topic: 'good', count: 4 },
    { topic: 'teeth', count: 4 }
  ],
  seasonal: [
    { date: '2024-06-15', score: 85 },
    { date: '2024-06-16', score: 89 },
    { date: '2024-06-17', score: 70 },
    { date: '2024-06-18', score: 92 },
    { date: '2024-06-19', score: 88 }
  ],
  authenticityOverview: {
    genuinePercentage: 82,
    fakePercentage: 12,
    suspiciousPercentage: 6
  },
  isCounterfeit: false,
  fakeReviews: []
};

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Dabur Red Toothpaste - 800g (200gx4) | Fights 7 Dental Problems',
    price: 306,
    originalPrice: 420,
    rating: 4.4,
    reviewCount: 15420,
    image: 'https://m.media-amazon.com/images/I/71R3yX9K7pL._SL1500_.jpg', // Using a placeholder that looks like the demo
    category: 'Personal Care',
    seller: 'SuperComNet',
    description: 'Dabur Red Paste is a unique blend of traditional Indian medicine and modern pharmaceutical technology...',
    reviews: [
      { id: 'r1', user: 'Sid', rating: 5, comment: 'Great Work Going. Subscribe to our channel for more.', date: '2024-06-20', isVerified: true, isFake: true, reason: 'Promotional bot pattern' },
      { id: 'r2', user: 'Rahul', rating: 4, comment: 'Very fast delivery and lower price segment.', date: '2024-06-19', isVerified: true },
      { id: 'r3', user: 'Ankit', rating: 5, comment: 'Quality awesome much effective and purely natural.', date: '2024-06-18', isVerified: true }
    ]
  }
];
