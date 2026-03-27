import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function testModel() {
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent("Say hello!");
        console.log("SUCCESS:", result.response.text());
    } catch (error) {
        console.error("ERROR:", error.message);
    }
}

testModel();
