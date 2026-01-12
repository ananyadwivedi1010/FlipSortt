
import { GoogleGenAI, Type } from "@google/genai";
import { Review, AnalysisResult, CounterfeitReport } from "../types.ts";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJsonResponse = (text: string) => {
  // Removes markdown code blocks if the model accidentally includes them
  return text.replace(/```json\n?|```/g, '').trim();
};

export const analyzeProductReviews = async (reviews: Review[], productName: string): Promise<AnalysisResult> => {
  const ai = getAI();
  const reviewsText = reviews.length > 0 
    ? reviews.map(r => `Rating: ${r.rating}, Comment: ${r.comment}, Verified: ${r.isVerified}`).join('\n')
    : "No reviews yet.";
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these Flipkart product reviews for ${productName}. 
    Identify which are likely fake/bot-generated vs genuine. 
    Summarize the genuine sentiment. 
    Extract key features (Performance, Durability, Pricing, Sensitivity) on a scale of 0-100.
    Provide top keywords.
    
    Reviews:
    ${reviewsText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          scores: {
            type: Type.OBJECT,
            properties: {
              performance: { type: Type.NUMBER },
              durability: { type: Type.NUMBER },
              pricing: { type: Type.NUMBER },
              sensitivity: { type: Type.NUMBER },
            },
            required: ["performance", "durability", "pricing", "sensitivity"]
          },
          keywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          authenticityOverview: {
            type: Type.OBJECT,
            properties: {
              genuinePercentage: { type: Type.NUMBER },
              fakePercentage: { type: Type.NUMBER },
              suspiciousPercentage: { type: Type.NUMBER },
            },
            required: ["genuinePercentage", "fakePercentage", "suspiciousPercentage"]
          }
        },
        required: ["summary", "scores", "keywords", "authenticityOverview"]
      }
    }
  });

  return JSON.parse(cleanJsonResponse(response.text));
};

export const detectCounterfeit = async (imageBase64: string, expectedProductName: string): Promise<CounterfeitReport> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
        {
          text: `Check if this product image appears to be an authentic ${expectedProductName} or a counterfeit. 
          Look for inconsistencies in branding, packaging, build quality, and common counterfeit signs.
          Provide visual observations.`,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isAuthentic: { type: Type.BOOLEAN },
          confidence: { type: Type.NUMBER },
          reasons: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          visualObservations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["isAuthentic", "confidence", "reasons", "visualObservations"]
      }
    }
  });

  return JSON.parse(cleanJsonResponse(response.text));
};

export const chatWithAssistant = async (history: { role: string, content: string }[], userMessage: string) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are FlipIntegrity AI Assistant, a helpful expert in product authenticity and Flipkart shopping safety. Help users identify fake reviews, understand counterfeit risks, and make safe purchasing decisions.'
    }
  });

  const response = await chat.sendMessage({ message: userMessage });
  return response.text;
};
