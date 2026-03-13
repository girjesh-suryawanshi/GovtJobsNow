import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';

async function listModels() {
    const apiKey = process.env.GEMINI_API_KEY;
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await res.json();
        fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

listModels();
