
import { GoogleGenAI, Type } from "@google/genai";
import { Review, AnalysisResult } from "../types.ts";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

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
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the following reviews for the product "${productName}" to detect bot activity, sentiment, and product quality.
    
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
    
    Format the output as a strict JSON object matching the AnalysisResult interface.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          sentiment: {
            type: Type.OBJECT,
            properties: {
              positive: { type: Type.NUMBER },
              neutral: { type: Type.NUMBER },
              negative: { type: Type.NUMBER }
            }
          },
          scores: {
            type: Type.OBJECT,
            properties: {
              performance: { type: Type.NUMBER },
              durability: { type: Type.NUMBER },
              pricing: { type: Type.NUMBER },
              sensitivity: { type: Type.NUMBER }
            }
          },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          lda: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                topic: { type: Type.STRING },
                count: { type: Type.NUMBER }
              }
            }
          },
          seasonal: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                date: { type: Type.STRING },
                score: { type: Type.NUMBER }
              }
            }
          },
          authenticityOverview: {
            type: Type.OBJECT,
            properties: {
              genuinePercentage: { type: Type.NUMBER },
              fakePercentage: { type: Type.NUMBER },
              suspiciousPercentage: { type: Type.NUMBER }
            }
          },
          isCounterfeit: { type: Type.BOOLEAN },
          fakeReviews: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                user: { type: Type.STRING },
                comment: { type: Type.STRING },
                reason: { type: Type.STRING }
              }
            }
          }
        },
        required: ["summary", "sentiment", "scores", "keywords", "lda", "seasonal", "authenticityOverview", "isCounterfeit", "fakeReviews"]
      }
    }
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty AI response");
    return JSON.parse(cleanJsonResponse(text));
  } catch (e) {
    console.error("Parse Error:", e);
    throw new Error("Failed to parse product review analysis");
  }
};

/**
 * Optimized for Flipkart Search Grounding.
 * This function uses the Gemini 3 Pro Search tool to "browse" and extract.
 */
export const analyzeFlipkartUrl = async (url: string): Promise<any> => {
  const ai = getAI();
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `AUDIT TASK: Analyze product integrity for Ananya.
    TARGET: ${url}
    
    INSTRUCTIONS:
    1. Use Google Search to fetch product specifications, current price, and seller rating from Flipkart.
    2. Analyze recent reviews for bot patterns: Look for repetitive "Fast delivery" phrases or identical "Certified Buyer" ratings.
    3. Evaluate if the listing shows signs of being a counterfeit (unauthorized seller, mismatched price, poor image quality).
    4. Calculate DeBERTa v3 scores (0-100) for Performance, Durability, Pricing, and Sensitivity based on review sentiment.
    
    Format the output as a strict JSON object.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          productInfo: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              price: { type: Type.NUMBER },
              image: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ["name", "price"]
          },
          analysis: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              isCounterfeit: { type: Type.BOOLEAN },
              sentiment: {
                type: Type.OBJECT,
                properties: {
                  positive: { type: Type.NUMBER },
                  neutral: { type: Type.NUMBER },
                  negative: { type: Type.NUMBER }
                }
              },
              scores: {
                type: Type.OBJECT,
                properties: {
                  performance: { type: Type.NUMBER },
                  durability: { type: Type.NUMBER },
                  pricing: { type: Type.NUMBER },
                  sensitivity: { type: Type.NUMBER }
                }
              },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
              lda: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    topic: { type: Type.STRING },
                    count: { type: Type.NUMBER }
                  }
                }
              },
              seasonal: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    date: { type: Type.STRING },
                    score: { type: Type.NUMBER }
                  }
                }
              },
              fakeReviews: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    user: { type: Type.STRING },
                    comment: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  }
                }
              },
              authenticityOverview: {
                type: Type.OBJECT,
                properties: {
                  genuinePercentage: { type: Type.NUMBER },
                  fakePercentage: { type: Type.NUMBER },
                  suspiciousPercentage: { type: Type.NUMBER }
                }
              }
            },
            required: ["summary", "isCounterfeit", "sentiment", "scores", "keywords", "fakeReviews", "authenticityOverview", "lda", "seasonal"]
          }
        }
      }
    }
  });

  try {
    const rawJson = JSON.parse(cleanJsonResponse(response.text));
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "Flipkart Source",
      uri: chunk.web?.uri
    })).filter((s: any) => s.uri) || [];

    return { ...rawJson, groundingSources: sources };
  } catch (e) {
    console.error("Parse Error:", e);
    throw new Error("Failed to parse AI response");
  }
};

export const chatWithAssistant = async (history: { role: 'user' | 'assistant', content: string }[], userMessage: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are FlipIntegrity AI. You are helping Ananya detect fraudulent listings and fake reviews on Flipkart. Be professional, analytical, and alert her to specific counterfeit risks.'
    }
  });
  const response = await chat.sendMessage({ message: userMessage });
  return response.text;
};
