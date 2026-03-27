import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing with API Key:', apiKey ? 'Present' : 'Missing');

if (!apiKey) {
    console.error('No API Key found in server/.env');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function test() {
    try {
        const prompt = 'Hello, are you working? Reply with "Yes, I am working!"';
        console.log('Sending prompt:', prompt);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('Response:', text);
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('API Error details:', JSON.stringify(error.response, null, 2));
        }
    }
}

test();
