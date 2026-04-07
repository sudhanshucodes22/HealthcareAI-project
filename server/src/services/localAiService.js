/**
 * Local AI Service - Providing offline medical insights and mental health support.
 * This service uses keyword-based analysis to simulate a medical AI's reasoning.
 */

const MEDICAL_KNOWLEDGE = [
    {
        keywords: ['fever', 'bukhar', 'thanda', 'cold', 'flu', 'shardi'],
        prediction: "Based on your symptoms, you might have a **Viral Infection or Mild Flu** (Aapko viral fever ya thandi lag sakti hai).\n\n**Recommendations:**\n• Take plenty of rest and stay hydrated.\n• Monitor your temperature regularly.\n• Over-the-counter medicine like paracetamol can help, but consult a doctor first.\n• If fever exceeds 102°F, seek medical attention immediately.",
        severity: 'moderate'
    },
    {
        keywords: ['headache', 'sir dard', 'migraine', 'tension'],
        prediction: "You seem to be experiencing a **Tension Headache or Migraine** (Ye sir dard stress ya migraine ki wajah se ho sakta hai).\n\n**Recommendations:**\n• Rest in a quiet, dark room.\n• Drink water and avoid bright screens.\n• Gentle neck stretches might help.\n• If the headache is sudden and severe, visit an emergency room.",
        severity: 'mild'
    },
    {
        keywords: ['stomach', 'pet dard', 'acidity', 'digestion', 'gas'],
        prediction: "Your symptoms suggest **Indigestion or Gastritis** (Aapko acidity ya pachan ki samasya ho sakti hai).\n\n**Recommendations:**\n• Eat light, non-spicy meals.\n• Drink ginger tea or warm water.\n• Avoid lying down immediately after eating.\n• Consult a doctor if you feel sharp, persistent pain.",
        severity: 'moderate'
    },
    {
        keywords: ['stress', 'anxiety', 'worried', 'ghabrahat', 'tension', 'sad', 'dukh'],
        prediction: "It sounds like you're dealing with **Stress or Anxiety** (Aap thoda stress ya ghabrahat mehsoos kar rahe hain).\n\n**Recommendations:**\n• Practice deep breathing exercises.\n• Take a short walk or listen to calming music.\n• Talk to a friend or professional about your feelings.\n• Remember, it's okay to take a break and prioritize yourself.",
        severity: 'mild'
    },
    {
        keywords: ['chest pain', 'heart', 'breathless', 'seene mein dard'],
        prediction: "⚠️ **URGENT:** These symptoms could indicate a serious condition like a **Cardiac Issue** (Ye gambhir samasya ho sakti hai).\n\n**Recommendations:**\n• **CONTACT EMERGENCY SERVICES IMMEDIATELY (Call 102/108).**\n• Do not drive yourself; ask someone to take you to the hospital.\n• Stay calm and sit in a comfortable position.",
        severity: 'severe'
    }
];

const MENTAL_HEALTH_RESPONSES = [
    "I understand how you're feeling. Aesa hota hai, life can be tough sometimes. I'm here for you. ❤️",
    "Koi baat nahi, take it easy. Everything will be fine. Just focus on one small step at a time.",
    "That sounds really difficult. I'm proud of you for sharing this with me. You are not alone in this.",
    "Remember that your feelings are valid. It's okay to feel this way. How can I best support you right now?",
    "Aap bohot strong ho! You've handled tough times before, and you'll handle this too. Bas thoda relax karo.",
    "I'm listening. Tell me more about what's on your mind. Main yahin hoon, no pressure at all.",
];

export const analyzeSymptomsLocally = (symptoms) => {
    const lowerSymptoms = symptoms.toLowerCase();

    // Find the first matching knowledge base entry
    const entry = MEDICAL_KNOWLEDGE.find(item =>
        item.keywords.some(keyword => lowerSymptoms.includes(keyword))
    );

    if (entry) {
        return {
            prediction: `**Note: Using local AI core due to API connectivity.**\n\n${entry.prediction}`,
            severity: entry.severity
        };
    }

    // Default fallback if no keywords match
    return {
        prediction: `Thank you for sharing. Based on your report: "${symptoms}"\n\n**General Advice:**\n• Maintain a symptom diary to track changes.\n• Ensure you're getting 7-8 hours of sleep.\n• Eat a balanced diet and stay hydrated.\n• Since I couldn't identify specific symptoms, please consult a healthcare professional for a detailed checkup.`,
        severity: 'unknown'
    };
};

export const generateMentalHealthResponseLocally = (message) => {
    const randomIndex = Math.floor(Math.random() * MENTAL_HEALTH_RESPONSES.length);
    return `**Offline Buddy Mode:** ${MENTAL_HEALTH_RESPONSES[randomIndex]}`;
};
