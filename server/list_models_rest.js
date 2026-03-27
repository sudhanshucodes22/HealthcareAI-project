import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
    console.log('Listing available models via REST...');
    const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            console.log('Available Models:');
            if (data.models && data.models.length > 0) {
                data.models.forEach(model => {
                    console.log(`- ${model.name} (${model.displayName})`);
                });
            } else {
                console.log('No models found for this key.');
            }
        } else {
            console.error('❌ Error listing models:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('❌ Exception listing models:', error.message);
    }
}

listModels();
