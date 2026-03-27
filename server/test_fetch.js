import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function testModel(modelName) {
    console.log(`--- Testing model: ${modelName} ---`);
    const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: 'Say hello!' }] }]
            })
        });

        const data = await response.json();
        if (response.ok) {
            console.log(`✅ Success with ${modelName}:`, data.candidates[0].content.parts[0].text);
        } else {
            console.error(`❌ Error with ${modelName}:`, JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error(`❌ Exception with ${modelName}:`, error.message);
    }
}

async function runTests() {
    await testModel('gemini-1.5-flash');
    await testModel('gemini-1.5-flash-latest');
    await testModel('gemini-pro');
}

runTests();
