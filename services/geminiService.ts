
import Groq from "groq-sdk";
import { Review, AnalysisResult } from "../types.ts";

const getAI = () => {
  // Access Vite env variables
  const env = import.meta.env as Record<string, string>;
  const apiKey = env.VITE_GROQ_API_KEY || env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_GROQ_API_KEY is not configured. Please add it to your .env file.");
  }
  return new Groq({ apiKey, dangerouslyAllowBrowser: true });
};

const cleanJsonResponse = (text: string | undefined) => {
  if (!text) return "";
  // Strip markdown code blocks if they exist
  return text.replace(/```json\n?|```/g, '').trim();
};

/**
 * Analyzes a list of reviews for a specific product using Groq.
 */
export const analyzeProductReviews = async (reviews: Review[], productName: string): Promise<AnalysisResult> => {
  const groq = getAI();

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Latest available model
      messages: [
        {
          role: "user",
          content: `Analyze the following reviews for the product "${productName}" to detect bot activity, sentiment, and product quality.
    
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
    
    Return ONLY a JSON object with this structure:
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
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent JSON
      max_tokens: 1024
    });

    const text = response.choices[0]?.message?.content;
    if (!text) throw new Error("Empty AI response");
    return JSON.parse(cleanJsonResponse(text));
  } catch (e) {
    console.error("Parse Error:", e);
    throw new Error("Failed to parse product review analysis");
  }
};

/**
 * Analyzes Flipkart product URL using Groq.
 * Fetches product info and analyzes for counterfeit indicators.
 */

export const analyzeFlipkartUrl = async (url: string): Promise<any> => {
  const groq = getAI();

  if (!url || typeof url !== 'string') {
    throw new Error("Invalid URL provided");
  }

  // SCRAPING STEP
  let scrapedData: any = null;
  try {
    console.log(`Scraping URL via local server: ${url}`);
    // Use dynamic import or fetch if axios isn't available, but we added axios
    // Assuming this runs in browser, we use fetch to call local server
    const scrapeResponse = await fetch(`http://localhost:3001/scrape?url=${encodeURIComponent(url)}`);
    if (scrapeResponse.ok) {
      scrapedData = await scrapeResponse.json();
      console.log("Scraping successful:", scrapedData);
    } else {
      console.warn("Scraping server returned error:", await scrapeResponse.text());
    }
  } catch (err) {
    console.error("Failed to connect to local scraper:", err);
    console.warn("Proceeding with AI-only analysis (data may be hallucinated or generic).");
  }

  // AI ANALYSIS STEP
  try {
    const messages = [
      {
        role: "user",
        content: `You are a product integrity analyst. Analyze this Flipkart product.
${scrapedData ? `Here is the LIVE DATA extracted from the page:
Name: ${scrapedData.name}
Price: ${scrapedData.price}
Rating: ${scrapedData.rating}
Review Count: ${scrapedData.reviewCount}
Rating Breakdown: ${JSON.stringify(scrapedData.ratingBreakdown)}
Real User Reviews (use these for sentiment analysis): ${JSON.stringify(scrapedData.recentReviews)}
Description: ${scrapedData.description}` : ''}

URL: ${url}

Please provide detailed analysis in the following JSON format (ONLY JSON, no markdown):
{
  "productInfo": {
    "name": "${scrapedData ? scrapedData.name : 'Product name'}",
    "price": ${scrapedData ? scrapedData.price : 999},
    "image": "${scrapedData ? scrapedData.image : ''}",
    "description": "${scrapedData ? scrapedData.description : 'Product description'}"
  },
  "analysis": {
    "summary": "Overall analysis summary based on available data",
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
      }
    ];

    // Helper to try multiple models
    const tryModels = async (msgs: any[]) => {
      const models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "mixtral-8x7b-32768"];

      for (const model of models) {
        try {
          console.log(`Trying AI model: ${model}`);
          const response = await groq.chat.completions.create({
            model: model,
            messages: msgs,
            temperature: 0.3,
            max_tokens: 1536
          });
          return response.choices[0]?.message?.content;
        } catch (e: any) {
          console.warn(`Model ${model} failed:`, e.message);
          // Only continue if it's a rate limit or server error
          if (e.status === 429 || e.status >= 500) continue;
          throw e; // Throw other errors (auth, bad request)
        }
      }
      throw new Error("All AI models exhausted or rate limited.");
    };

    const responseText = await tryModels(messages);

    if (!responseText) {
      throw new Error("Empty response from API");
    }

    const cleanedJson = cleanJsonResponse(responseText);
    const rawJson = JSON.parse(cleanedJson);

    // Merge scraped data back in to be sure
    if (scrapedData) {
      rawJson.productInfo.price = scrapedData.price;
      rawJson.productInfo.name = scrapedData.name;
      // rawJson.productInfo.rating = scrapedData.rating; // If we add rating to types later

      // Strict Image Logic: Use scraped image, or a safe placeholder. Never trust the AI's URL blindly if scraped failed.
      if (scrapedData.image && scrapedData.image.startsWith('http')) {
        rawJson.productInfo.image = scrapedData.image;
      } else if (!rawJson.productInfo.image || rawJson.productInfo.image.includes('amazon')) {
        // If AI hallucinated an Amazon link or gave nothing, use a placeholder
        rawJson.productInfo.image = "https://placehold.co/400?text=No+Image+Available";
      }
    }

    return { ...rawJson, groundingSources: [] };

  } catch (e) {
    console.error("AI Analysis failed:", e);

    // FALLBACK: If AI fails but we have scraped data, return that!
    if (scrapedData) {
      console.log("Falling back to pure scraped data.");
      return {
        productInfo: {
          name: scrapedData.name,
          price: scrapedData.price,
          image: scrapedData.image,
          description: scrapedData.description
        },
        analysis: {
          summary: "AI Analysis unavailable due to high traffic. Displaying live scraped data only.",
          isCounterfeit: false,
          sentiment: { positive: 50, neutral: 50, negative: 0 },
          scores: { performance: 80, durability: 80, pricing: 80, sensitivity: 80 },
          keywords: ["Live Data", "Manual Review Required"],
          lda: [],
          seasonal: [],
          fakeReviews: [],
          authenticityOverview: { genuinePercentage: 100, fakePercentage: 0, suspiciousPercentage: 0 }
        },
        groundingSources: []
      };
    }
    throw e;
  }
};

export const chatWithAssistant = async (history: { role: 'user' | 'assistant', content: string }[], userMessage: string, context?: any) => {
  const groq = getAI();

  const systemMsg = "You are FlipIntegrity AI. You are helping Ananya detect fraudulent listings and fake reviews on Flipkart. Be professional, analytical, and alert her to specific counterfeit risks.";

  const contextMsg = context ? `
Current Product Context (LIVE DATA):
Name: ${context.name}
Price: ₹${context.price}
Rating: ${context.rating} stars
Reviews: ${context.reviewCount} total reviews
Rating Breakdown: ${JSON.stringify(context.ratingBreakdown || {})}
Feature Ratings: ${JSON.stringify(context.featureRatings || [])}
Recent User Reviews: ${JSON.stringify(context.recentReviews || [])}
` : "";

  const messages = [
    {
      role: 'user' as const,
      content: systemMsg + contextMsg
    },
    ...history.map((msg) => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    })),
    {
      role: 'user' as const,
      content: userMessage
    }
  ];

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: messages,
    temperature: 0.7,
    max_tokens: 1024
  });

  return response.choices[0]?.message?.content || "No response generated";
};

