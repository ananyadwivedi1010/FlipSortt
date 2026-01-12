
import { GoogleGenAI, Type } from "@google/genai";
import { Review, AnalysisResult } from "../types.ts";

const getAI = () => new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });


const cleanJsonResponse = (text: string | undefined) => {
  if (!text) return "";
  return text.replace(/```json\n?|```/g, '').trim();
};

/**
 * REPLACING SCRAPER: Uses Gemini Search Grounding to fetch live Flipkart data.
 */
export const analyzeFlipkartUrl = async (url: string): Promise<any> => {
  const ai = getAI();
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `ACT AS AN E-COMMERCE INTEGRITY AUDIT AGENT. 
    TARGET URL: ${url}
    
    1. USE GOOGLE SEARCH TO BROWSE THIS FLIPKART PRODUCT PAGE.
    2. EXTRACT: Product Name, Price, and Image URL.
    3. REVIEWS AUDIT: Identify fraudulent patterns. Look for "Certified Buyer" accounts posting identical or template-based positive feedback.
    4. GENERATE METRICS: Score (0-100) based on review sentiment analysis for:
       - Performance
       - Durability
       - Pricing
       - Sensitivity
    5. COUNTERFEIT CHECK: Verify listing images and seller reputation.
    
    RETURN JSON FOLLOWING SCHEMA ONLY.`,
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
            }
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
              authenticityOverview: {
                type: Type.OBJECT,
                properties: {
                  genuinePercentage: { type: Type.NUMBER },
                  fakePercentage: { type: Type.NUMBER },
                  suspiciousPercentage: { type: Type.NUMBER }
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
              }
            }
          }
        }
      }
    }
  });

  const rawJson = JSON.parse(cleanJsonResponse(response.text));
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
    title: chunk.web?.title || "Flipkart Marketplace Data",
    uri: chunk.web?.uri
  })).filter((s: any) => s.uri) || [];

  return { ...rawJson, groundingSources: sources };
};

export const chatWithAssistant = async (history: { role: string, content: string }[], userMessage: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are FlipIntegrity AI. You assist Ananya in monitoring product authenticity and detecting fake review clusters on the Flipkart marketplace.'
    }
  });
  const response = await chat.sendMessage({ message: userMessage });
  return response.text;
};

export const analyzeProductReviews = async (reviews: Review[], productName: string): Promise<AnalysisResult> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these reviews for "${productName}": ${JSON.stringify(reviews)}. Score Performance, Durability, Pricing, and Sensitivity.`,
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
          lda: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { topic: { type: Type.STRING }, count: { type: Type.NUMBER } } } },
          seasonal: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { date: { type: Type.STRING }, score: { type: Type.NUMBER } } } },
          authenticityOverview: { type: Type.OBJECT, properties: { genuinePercentage: { type: Type.NUMBER }, fakePercentage: { type: Type.NUMBER }, suspiciousPercentage: { type: Type.NUMBER } } },
          isCounterfeit: { type: Type.BOOLEAN },
          fakeReviews: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { user: { type: Type.STRING }, comment: { type: Type.STRING }, reason: { type: Type.STRING } } } }
        }
      }
    }
  });
  return JSON.parse(cleanJsonResponse(response.text));
};
