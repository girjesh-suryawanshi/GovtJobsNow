import { GoogleGenAI } from "@google/genai";

// Replit AI Integrations uses specific base URL and empty apiVersion
// Use direct string for API key as required by standard constructor
const genAI = new GoogleGenAI(process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "no-key");

export async function generateText(prompt: string): Promise<string> {
  try {
    // For Replit AI Integrations, we must pass the custom baseUrl and empty apiVersion
    // in the second parameter (RequestOptions) of getGenerativeModel
    const model = genAI.getGenerativeModel(
      { model: "gemini-1.5-flash" },
      {
        baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
        apiVersion: "",
      }
    );
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error("Empty response from Gemini");
    }
    
    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}
