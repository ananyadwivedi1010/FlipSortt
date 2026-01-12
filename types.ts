
export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  isFake?: boolean;
  reason?: string;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface AnalysisResult {
  summary: string;
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
  scores: {
    performance: number;
    durability: number;
    pricing: number;
    sensitivity: number;
  };
  keywords: string[];
  lda: { topic: string; count: number }[];
  seasonal: { date: string; score: number }[];
  authenticityOverview: {
    genuinePercentage: number;
    fakePercentage: number;
    suspiciousPercentage: number;
  };
  isCounterfeit: boolean;
  groundingSources?: { title: string; uri: string }[];
  fakeReviews: { user: string; comment: string; reason: string }[];
}

export interface CounterfeitReport {
  isAuthentic: boolean;
  confidence: number;
  reasons: string[];
  visualObservations: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  seller: string;
  description: string;
  reviews: Review[];
}

export type AppView = 'Home' | 'Dashboard' | 'Analysis';
