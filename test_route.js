import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';

async function testExtraction() {
    try {
        const { generateText } = await import('./server/gemini.ts');

        const rawText = "Hiring for Software Engineer, Google loaded, salary 50LPA. Apply by Dec 30.";
        const prompt = `Extract job details from the following text and return a ONLY a JSON object (no markdown, no backticks) compatible with the following schema:
      {
        "title": "Job Title"
      }
      
      Text: ${rawText}`;

        const response = await generateText(prompt);
        const jsonStr = response.replace(/```json|```/g, "").trim();

        try {
            const parsed = JSON.parse(jsonStr);
            fs.writeFileSync('route_err.json', JSON.stringify({ success: true, data: parsed }, null, 2));
        } catch (parseError) {
            fs.writeFileSync('route_err.json', JSON.stringify({
                error: "Parse Error",
                textReceived: jsonStr,
                message: parseError.message
            }, null, 2));
        }

    } catch (error) {
        fs.writeFileSync('route_err.json', JSON.stringify({
            error: "Gemini Error",
            message: error.message,
            stack: error.stack
        }, null, 2));
    }
}

testExtraction();
