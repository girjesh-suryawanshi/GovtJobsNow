import express from "express";
import { storage } from "./storage";

export const aiRouter = express.Router();

aiRouter.post("/chat", async (req, res) => {
  try {
    const { message, jobId } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 1. Get settings
    const settings = await storage.getSiteSettings();

    if (!settings) {
      return res.status(500).json({ error: "System configuration missing." });
    }

    const provider = settings.aiModelProvider || "gemini";

    // 2. Local Database Search (RAG)
    const matchedJobs = await storage.searchJobsForRAG(message);
    const matchedExams = await storage.searchExamsForRAG(message);
    
    let systemPrompt = "You are the GovtJobNow AI Assistant. You help users with their questions about government jobs in India. Be concise, accurate, and professional.";
    
    if (matchedJobs.length > 0 || matchedExams.length > 0) {
      systemPrompt += `\n\nI have found the following relevant information in our database:`;
      
      matchedJobs.forEach(job => {
        systemPrompt += `\n- JOB: ${job.title} | Department: ${job.department} | Qualification: ${job.qualification} | Age: ${job.ageLimit || "Not specified"} | Apply link: [Click here to view full details](https://govtjobnow.com/job/${job.slug})`;
      });
      
      matchedExams.forEach(exam => {
        systemPrompt += `\n- EXAM: ${exam.title} | Link: [Click here to view full details](https://govtjobnow.com/exam/${exam.slug})`;
      });
      
      systemPrompt += `\n\nUse this exact data to answer the user's question if it's relevant. You MUST include the exact Markdown link (e.g. [text](https://govtjobnow.com/job/slug)) at the end of your answer so the user can click it to visit the page. Do NOT make up links.`;
    }

    // 3. Add Job Context if provided (from the current page)
    if (jobId) {
      const job = await storage.getJob(jobId);
      if (job) {
        systemPrompt += `\n\nThe user is currently viewing the following job:\n`;
        systemPrompt += `Title: ${job.title}\n`;
        systemPrompt += `Department: ${job.department}\n`;
        systemPrompt += `Qualification: ${job.qualification}\n`;
        systemPrompt += `Age Limit: ${job.ageLimit || "Not specified"}\n`;
        systemPrompt += `Deadline: ${job.deadline}\n`;
        systemPrompt += `\nUse this information to answer their specific questions about this job.`;
      }
    }

    let botReply = "";

    // 3. Route to the chosen provider
    if (provider === "gemini") {
      if (!settings.geminiApiKey) throw new Error("Gemini API key not configured.");
      
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey: settings.geminiApiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: systemPrompt + "\n\nUser Question: " + message }] }
        ],
      });
      botReply = response.text || "Sorry, I could not generate a response.";

    } else if (provider === "groq") {
      if (!settings.groqApiKey) throw new Error("Groq API key not configured.");
      
      // We will just use native fetch for Groq
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${settings.groqApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192", // Default groq model
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Groq Error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      botReply = data.choices?.[0]?.message?.content || "Sorry, Groq failed to respond.";

    } else if (provider === "ollama") {
      const endpoint = settings.ollamaEndpoint || "http://localhost:11434";
      const model = settings.ollamaModel || "llama3";
      
      const response = await fetch(`${endpoint}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model,
          prompt: systemPrompt + "\n\nUser Question: " + message,
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama Error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      botReply = data.response || "Sorry, Ollama failed to respond.";
    }

    res.json({ reply: botReply });

  } catch (error: any) {
    console.error("[AI Chat Error]", error);
    res.status(500).json({ error: error.message || "Failed to process AI request." });
  }
});
