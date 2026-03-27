import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/env.js';

let genAI = null;
let model = null;

const initializeGemini = () => {
    if (!config.geminiApiKey) {
        console.warn('⚠️  Gemini API key not configured. AI features will use fallback responses.');
        return false;
    }

    try {
        genAI = new GoogleGenerativeAI(config.geminiApiKey);
        // Using gemini-2.5-flash as it is supported and has quota for this key
        model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        console.log('✅ Gemini AI initialized successfully (gemini-2.5-flash).');
        return true;
    } catch (error) {
        console.error('❌ Error initializing Gemini:', error);
        return false;
    }
};

const isInitialized = initializeGemini();

export const analyzeDiseaseSymptoms = async (symptoms) => {
    if (!isInitialized || !model) {
        // Fallback response when API key is not configured
        return {
            prediction: `Based on your symptoms: ${symptoms}\n\nThis is a fallback response. To get AI-powered predictions, please configure your Gemini API key.\n\nGeneral recommendations:\n✓ Monitor your symptoms\n✓ Stay hydrated\n✓ Get adequate rest\n✓ Consult a healthcare professional if symptoms persist or worsen`,
            severity: 'unknown',
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

        const modelToUse = model || genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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

        // Provide a graceful fallback response instead of crashing
        return {
            prediction: `I apologize, but I am currently unable to connect to my AI analysis engine.\n\nHowever, based on your reported symptoms: "${symptoms}"\n\n**General Recommendations:**\n• Please monitor your symptoms closely.\n• Drink plenty of fluids and get adequate rest.\n• Consult a primary care physician if your condition worsens or persists.`,
            severity: 'unknown',
        };
    }
};

export const generateMentalHealthResponse = async (message, chatHistory = []) => {
    if (!isInitialized || !model) {
        // Fallback response
        return `Thank you for sharing. I'm here to listen and support you. To enable AI-powered mental health support, please configure your Gemini API key.\n\nIn the meantime, remember:\n• Your feelings are valid\n• It's okay to ask for help\n• Take things one day at a time\n• Consider reaching out to a mental health professional`;
    }

    try {
        const historyContext = chatHistory.length > 0
            ? `Previous conversation:\n${chatHistory.map(h => `User: ${h.message}\nAssistant: ${h.response}`).join('\n')}\n\n`
            : '';

        const prompt = `You are a compassionate, human-like mental health support friend. Your role is to provide emotional support, encouragement, and positive guidance. You must be empathetic, non-judgmental, and supportive.

Crucially, you should converse naturally in a mix of English, Hindi, and Hinglish, just like a supportive human friend in India would speak (e.g., "Koi baat nahi, take it easy", "I understand how you're feeling aesa hota hai").

${historyContext}Current message from user: "${message}"

Provide a supportive, empathetic response in conversational English/Hindi/Hinglish. Keep it warm and friendly. If the user seems to be in crisis, gently suggest professional help. Do not provide medical diagnoses.`;

        const modelToUse = model || genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await modelToUse.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('❌ Error calling Gemini API (Mental Health):', error.message);

        // Provide a graceful fallback response instead of crashing
        return "I'm really sorry, but I'm having a bit of trouble connecting to my AI core right now. However, I want you to know that your feelings are valid and I'm here for you. Koi baat nahi, take it easy. If you're feeling overwhelmed, please consider reaching out to a mental health professional or a trusted friend.";
    }
};
