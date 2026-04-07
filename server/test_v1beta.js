import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];

async function testV1Beta() {
    console.log('Testing with v1beta...');
    for (const model of models) {
        console.log(`\n--- Testing model: ${model} ---`);
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const response = await axios.post(url, {
                contents: [{ parts: [{ text: "Hello, are you working?" }] }]
            });
            console.log('✅ Success:', response.data.candidates[0].content.parts[0].text);
            return model; // Return the first working model
        } catch (error) {
            console.log(`❌ Error with ${model}:`, error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        }
    }
}

testV1Beta();
