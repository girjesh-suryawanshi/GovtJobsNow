export async function generateText(prompt: string): Promise<string> {
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
