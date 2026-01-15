
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Review, AnalysisResult } from "../types.ts";

const getAI = () => {
  const apiKey = (process.env.VITE_GEMINI_API_KEY || process.env.API_KEY) as string;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not configured. Please add it to your .env file.");
  }
  return new GoogleGenerativeAI(apiKey);
};

const cleanJsonResponse = (text: string | undefined) => {
  if (!text) return "";
  // Strip markdown code blocks if they exist
  return text.replace(/```json\n?|```/g, '').trim();
};

// Fix: Added analyzeProductReviews function which was missing but imported in ReviewAnalysis.tsx
/**
 * Analyzes a list of reviews for a specific product using Gemini.
 */
export const analyzeProductReviews = async (reviews: Review[], productName: string): Promise<AnalysisResult> => {
  const ai = getAI();
  
  const response = await ai.getGenerativeModel({ model: 'gemini-pro' }).generateContent(
    `Analyze the following reviews for the product "${productName}" to detect bot activity, sentiment, and product quality.
    
    Reviews:
    ${JSON.stringify(reviews.map(r => ({ user: r.user, comment: r.comment, rating: r.rating })))}
    
    Instructions:
    1. Identify sentiment distribution (positive, neutral, negative).
    2. Score Performance, Durability, Pricing, and Sensitivity (0-100).
    3. Extract 5-7 key semantic keywords.
    4. Detect fake/bot reviews based on repetitive phrasing or promotional patterns.
    5. Generate a concise summary.
    6. Estimate authenticity percentages.
    7. Provide 3-4 LDA topics and a 5-day seasonal score trend.
    
    Return a JSON object with this structure:
    {
      "summary": "...",
      "sentiment": {"positive": 0, "neutral": 0, "negative": 0},
      "scores": {"performance": 0, "durability": 0, "pricing": 0, "sensitivity": 0},
      "keywords": [],
      "lda": [],
      "seasonal": [],
      "authenticityOverview": {"genuinePercentage": 0, "fakePercentage": 0, "suspiciousPercentage": 0},
      "isCounterfeit": false,
      "fakeReviews": []
    }`
  );

  try {
    const text = response.response.text();
    if (!text) throw new Error("Empty AI response");
    return JSON.parse(cleanJsonResponse(text));
  } catch (e) {
    console.error("Parse Error:", e);
    throw new Error("Failed to parse product review analysis");
  }
};

/**
 * Analyzes Flipkart product URL using Gemini with search grounding.
 * Fetches product info and analyzes for counterfeit indicators.
 */
export const analyzeFlipkartUrl = async (url: string): Promise<any> => {
  const ai = getAI();
  
  if (!url || typeof url !== 'string') {
    throw new Error("Invalid URL provided");
  }
  
  const maxRetries = 3;
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Analyzing Flipkart URL (Attempt ${attempt}/${maxRetries}): ${url}`);
      
      // Use gemini-pro which is stable and available in v1beta API
      const response = await ai.getGenerativeModel({ model: 'gemini-pro' }).generateContent(
        `You are a product integrity analyst. Analyze this Flipkart product URL and provide detailed analysis:

${url}

Please provide analysis in the following JSON format:
{
  "productInfo": {
    "name": "Product name",
    "price": 999,
    "image": "image url or empty string",
    "description": "Product description"
  },
  "analysis": {
    "summary": "Overall analysis summary",
    "isCounterfeit": false,
    "sentiment": {
      "positive": 80,
      "neutral": 15,
      "negative": 5
    },
    "scores": {
      "performance": 85,
      "durability": 88,
      "pricing": 75,
      "sensitivity": 80
    },
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "lda": [
      {"topic": "quality", "count": 5},
      {"topic": "delivery", "count": 3}
    ],
    "seasonal": [
      {"date": "2024-01-01", "score": 85}
    ],
    "fakeReviews": [],
    "authenticityOverview": {
      "genuinePercentage": 85,
      "fakePercentage": 10,
      "suspiciousPercentage": 5
    }
  }
}`
      );

      const responseText = response.response.text();
      if (!responseText) {
        throw new Error("Empty response from API");
      }
      
      const cleanedJson = cleanJsonResponse(responseText);
      const rawJson = JSON.parse(cleanedJson);
      
      // Extract grounding sources if available (simplified for new API)
      const sources: any[] = [];

      console.log(`✓ Successfully analyzed URL on attempt ${attempt}`);
      return { ...rawJson, groundingSources: sources };
      
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      const errorStr = JSON.stringify(e);
      lastError = e instanceof Error ? e : new Error(errorMsg);
      
      console.error(`Attempt ${attempt}/${maxRetries} failed:`, errorMsg);
      
      // Check if error is retryable
      const isQuotaError = errorStr.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("quota");
      const isNetworkError = errorMsg.includes("Network") || errorMsg.includes("404") || errorMsg.includes("503") || errorMsg.includes("timeout");
      const isAuthError = errorMsg.includes("API key") || errorMsg.includes("authentication") || errorMsg.includes("401");
      
      // Don't retry auth errors
      if (isAuthError) {
        throw new Error(`API Key Error: Please verify your API key in .env file. Error: ${errorMsg}`);
      }
      
      // Don't retry quota errors
      if (isQuotaError) {
        throw new Error("API quota exceeded. Please upgrade your Gemini API plan at https://ai.google.dev/pricing or wait for quota reset (usually daily).");
      }
      
      // Retry network and transient errors with exponential backoff
      if (isNetworkError && attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Retrying in ${delayMs}ms...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        continue;
      }
      
      // If last attempt or non-retryable error, throw
      if (attempt === maxRetries || !isNetworkError) {
        if (errorMsg.includes("parse")) {
          throw new Error("Response parsing error: Invalid JSON from API");
        } else if (errorMsg.includes("Empty")) {
          throw new Error("No response from API: Please try again");
        }
        throw lastError;
      }
    }
  }
  
  // This should never be reached, but just in case
  throw lastError || new Error("Failed to analyze Flipkart URL after multiple attempts");
};

export const chatWithAssistant = async (history: { role: 'user' | 'assistant', content: string }[], userMessage: string) => {
  const ai = getAI();
  const model = ai.getGenerativeModel({
    model: 'gemini-pro',
    systemInstruction: 'You are FlipIntegrity AI. You are helping Ananya detect fraudulent listings and fake reviews on Flipkart. Be professional, analytical, and alert her to specific counterfeit risks.'
  });
  
  const chat = model.startChat({
    history: history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))
  });
  
  const response = await chat.sendMessage(userMessage);
  return response.response.text();
};
