import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/env.js';
import { analyzeSymptomsLocally, generateMentalHealthResponseLocally } from './localAiService.js';

let genAI = null;
let model = null;

const initializeGemini = () => {
    if (!config.geminiApiKey) {
        console.warn('⚠️  Gemini API key not configured. AI features will use fallback responses.');
        return false;
    }

    try {
        genAI = new GoogleGenerativeAI(config.geminiApiKey);
        // Using gemini-1.5-flash as it is supported and has quota for this key
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        console.log('✅ Gemini AI initialized successfully (gemini-1.5-flash).');
        return true;
    } catch (error) {
        console.error('❌ Error initializing Gemini:', error);
        return false;
    }
};

const isInitialized = initializeGemini();

export const analyzeDiseaseSymptoms = async (symptoms) => {
    if (!isInitialized || !model) {
        // Use Local AI Service as a high-quality fallback
        const localResult = analyzeSymptomsLocally(symptoms);
        return {
            prediction: localResult.prediction,
            severity: localResult.severity,
        };
    }

    try {
        const prompt = `You are a friendly and professional human medical AI assistant. A patient reports the following symptoms: "${symptoms}". 

Please provide the information naturally, conversing in a mix of English, Hindi, and Hinglish (like how a real Indian doctor or friend might speak, e.g., "Aapko shayad viral ho sakta hai...").

1. Possible conditions (list 2-4 most likely conditions)
2. Severity assessment (mild, moderate, or severe)
3. Recommendations for care
4. When to seek immediate medical attention

Format your response clearly with bullet points. Remember to keep the tone empathetic, human-like, and clearly state this is informational only and not a diagnosis.`;

        const modelToUse = model || genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await modelToUse.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Extract severity from response
        let severity = 'moderate';
        const lowerText = text.toLowerCase();
        if (lowerText.includes('severe') || lowerText.includes('emergency') || lowerText.includes('urgent')) {
            severity = 'severe';
        } else if (lowerText.includes('mild') || lowerText.includes('slight')) {
            severity = 'mild';
        }

        return {
            prediction: text,
            severity,
        };
    } catch (error) {
        console.error('❌ Error calling Gemini API (Disease Analysis):', error.message);

        // Fallback to Local AI Intelligence
        const localResult = analyzeSymptomsLocally(symptoms);
        return {
            prediction: localResult.prediction,
            severity: localResult.severity,
        };
    }
};

export const generateMentalHealthResponse = async (message, chatHistory = []) => {
    if (!isInitialized || !model) {
        // Fallback to Local AI Support
        return generateMentalHealthResponseLocally(message);
    }

    try {
        const historyContext = chatHistory.length > 0
            ? `Previous conversation:\n${chatHistory.map(h => `User: ${h.message}\nAssistant: ${h.response}`).join('\n')}\n\n`
            : '';

        const prompt = `You are a compassionate, human-like mental health support friend. Your role is to provide emotional support, encouragement, and positive guidance. You must be empathetic, non-judgmental, and supportive.

Crucially, you should converse naturally in a mix of English, Hindi, and Hinglish, just like a supportive human friend in India would speak (e.g., "Koi baat nahi, take it easy", "I understand how you're feeling aesa hota hai").

${historyContext}Current message from user: "${message}"

Provide a supportive, empathetic response in conversational English/Hindi/Hinglish. Keep it warm and friendly. If the user seems to be in crisis, gently suggest professional help. Do not provide medical diagnoses.`;

        const modelToUse = model || genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await modelToUse.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('❌ Error calling Gemini API (Mental Health):', error.message);

        // Fallback to Local AI Support
        return generateMentalHealthResponseLocally(message);
    }
};
