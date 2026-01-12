
export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  images?: string[];
  authenticityScore?: number;
  authenticityStatus?: 'Genuine' | 'Suspicious' | 'Fake';
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

export interface AnalysisResult {
  summary: string;
  scores: {
    performance: number;
    durability: number;
    pricing: number;
    sensitivity: number;
  };
  keywords: string[];
  authenticityOverview: {
    genuinePercentage: number;
    fakePercentage: number;
    suspiciousPercentage: number;
  };
}

export interface CounterfeitReport {
  isAuthentic: boolean;
  confidence: number;
  reasons: string[];
  visualObservations: string[];
}

export type AppView = 'Consumer' | 'Seller' | 'Admin';
