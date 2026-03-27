import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing with API Key:', apiKey ? 'Present' : 'Missing');

if (!apiKey) {
    console.error('No API Key found in .env');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
    console.log('--- Testing gemini-1.5-flash ---');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Say hello!');
        const text = (await result.response).text();
        console.log('✅ Success with gemini-1.5-flash:', text);
        return;
    } catch (error) {
        console.error('❌ Error with gemini-1.5-flash:', error.message);
    }

    console.log('\n--- Testing gemini-2.0-flash ---');
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent('Say hello!');
        const text = (await result.response).text();
        console.log('✅ Success with gemini-2.0-flash:', text);
        return;
    } catch (error) {
        console.error('❌ Error with gemini-2.0-flash:', error.message);
        if (error.message.includes('429') || error.message.includes('quota')) {
            console.error('⚠️  DIAGNOSTIC: This model has 0 limit set for this key.');
        }
    }
}

test();
