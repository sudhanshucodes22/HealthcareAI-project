import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const models = [
    'gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-pro', 'gemini-1.5-pro-latest',
    'gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-2.0-flash-thin-exp',
    'gemini-pro', 'gemini-pro-vision', 'gemini-1.0-pro', 'gemini-1.0-pro-001',
    'gemini-1.0-pro-vision-001', 'gemini-2.5-flash'
];

async function scan() {
    console.log('--- SCANNING FOR WORKING MODELS ---');
    console.log('Key:', apiKey ? 'Present' : 'Missing');

    for (const model of models) {
        for (const version of ['v1', 'v1beta']) {
            console.log(`\nTesting ${model} (${version})...`);
            try {
                const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`;
                const response = await axios.post(url, {
                    contents: [{ parts: [{ text: "hi" }] }]
                });
                console.log(`✅ SUCCESS with ${model} on ${version}!`);
                console.log('Response:', response.data.candidates[0].content.parts[0].text);
                return;
            } catch (error) {
                const status = error.response ? error.response.status : 'Network Error';
                const message = error.response ? (error.response.data.error ? error.response.data.error.message : 'Unknown') : error.message;
                console.log(`❌ ${status}: ${message}`);
            }
        }
    }
    console.log('\n--- SCAN COMPLETE: NO WORKING MODELS FOUND ---');
}

scan();
