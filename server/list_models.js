import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log('Testing with API Key:', apiKey ? 'Present' : 'Missing');

const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
    try {
        console.log('Listing models...');
        const result = await genAI.listModels();
        console.log('Available Models:');
        result.models.forEach(model => {
            console.log(`- ${model.name} (${model.displayName})`);
            console.log(`  Supported Methods: ${model.supportedGenerationMethods.join(', ')}`);
        });
    } catch (error) {
        console.error('❌ Error listing models:', error.message);
        if (error.response) {
            const data = await error.response.json();
            console.error('API Response:', JSON.stringify(data, null, 2));
        }
    }
}

listModels();
