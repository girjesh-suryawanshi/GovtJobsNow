export async function generateText(prompt: string, provider: "gemini" | "groq" = "groq"): Promise<string> {
  if (provider === "groq") {
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      console.warn("Missing Groq API Key! Falling back to Gemini...");
      return generateText(prompt, "gemini");
    }
    
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Groq API Error Response:", JSON.stringify(data, null, 2));
        throw new Error(data.error?.message || "Groq API rejected request");
      }

      if (!data.choices || data.choices.length === 0) {
        throw new Error("No choices returned from Groq");
      }

      const text = data.choices[0]?.message?.content;

      if (!text) {
        throw new Error("Empty text response from Groq");
      }

      return text;
    } catch (error) {
      console.error("Groq API error:", error);
      throw error;
    }
  }

  // Original Gemini Fallback
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_INTEGRATIONS_GEMINI_API_KEY;

  if (!apiKey || apiKey === "no-key") {
    throw new Error("Missing Gemini API Key in environment variables.");
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    // We are requesting the AI to extract data in a JSON structure based on the prompt.
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.1, // Keep it deterministic for extraction
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API Error Response:", JSON.stringify(data, null, 2));
      throw new Error(data.error?.message || "Gemini API rejected request");
    }

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error("No candidates returned from Gemini");
    }

    const text = data.candidates[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("Empty text response from Gemini");
    }

    return text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}
