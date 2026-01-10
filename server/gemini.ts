import { GoogleGenAI } from "@google/genai";

// Replit AI Integrations uses specific base URL and empty apiVersion
const genAI = new GoogleGenAI(process.env.AI_INTEGRATIONS_GEMINI_API_KEY!);

export const ai = genAI;

export async function generateText(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
  }, {
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
    apiVersion: "",
  });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
