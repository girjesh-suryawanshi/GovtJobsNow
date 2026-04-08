
import { GoogleGenAI } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function run() {
  console.log("Testing gemini-2.5-flash for image generation...");

  try {
    const response = await ai.models.generateImages({
      model: 'gemini-2.5-flash',
      prompt: 'Professional government job featured image banner',
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9'
      }
    });
    console.log("generateImages SUCCEEDED!");
    console.log(response);
  } catch (err) {
    console.log("generateImages FAILED:", err.message);
  }

  try {
    console.log("\nAttempting content generation with gemini-2.5-flash...");
    const contentResp = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Generate an SVG banner image for a Government Job board for SSC CGL',
      config: {
        responseMimeType: 'text/plain',
      }
    });
    console.log("generateContent SUCCEEDED!");
    console.log(contentResp.text.substring(0, 300) + '...');
  } catch (err) {
    console.log("generateContent FAILED:", err.message);
  }
}
run();
