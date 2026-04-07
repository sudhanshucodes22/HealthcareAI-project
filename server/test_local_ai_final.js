import axios from 'axios';

async function testLocalAi() {
    console.log('--- TESTING LOCAL AI FALLBACK ---');

    // Test Disease Predictor Fallback
    try {
        console.log('\nTesting Symptom: "I have high fever and thanda"');
        const response = await axios.post('http://localhost:3000/api/disease/predict', {
            symptoms: "I have high fever and thanda"
        }, {
            headers: { 'Authorization': 'Bearer test-token' } // Note: Auth may be needed, but we can check if it gets through to the service
        });
        console.log('✅ Disease Prediction:', response.data.prediction);
    } catch (error) {
        console.log('❌ Disease Prediction Error:', error.response ? error.response.data : error.message);
    }

    // Test Mental Health Fallback
    try {
        console.log('\nTesting Mental Health: "Feeling very stressed"');
        const response = await axios.post('http://localhost:3000/api/mental/chat', {
            message: "Feeling very stressed"
        }, {
            headers: { 'Authorization': 'Bearer test-token' }
        });
        console.log('✅ Mental Health Response:', response.data.response);
    } catch (error) {
        console.log('❌ Mental Health Error:', error.response ? error.response.data : error.message);
    }
}

testLocalAi();
