import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GOOGLE_MAPS_API_KEY;
console.log('Testing with API Key:', apiKey ? 'Present' : 'Missing');

if (!apiKey) {
    console.warn('\n⚠️  No API Key found in .env. The application will use MOCK DATA.');
    console.log('To use live data, uncomment GOOGLE_MAPS_API_KEY in server/.env and add a valid key.');
    process.exit(0);
}

const lat = 26.79;  // Sample: Sitapura area, Jaipur
const lng = 75.82;
const radius = 10000;

async function testMaps() {
    console.log(`\n--- Testing Google Maps Nearby Search (${lat}, ${lng}) ---`);

    const types = ['hospital', 'clinic', 'health', 'doctor'];

    for (const type of types) {
        console.log(`\nSearching for type: ${type}...`);
        try {
            const response = await axios.get(
                'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
                {
                    params: {
                        location: `${lat},${lng}`,
                        radius,
                        type,
                        key: apiKey,
                    },
                }
            );

            console.log(`Status: ${response.data.status}`);
            if (response.data.status === 'OK') {
                console.log(`✅ Found ${response.data.results.length} ${type}s.`);
                if (response.data.results.length > 0) {
                    console.log(`Example: ${response.data.results[0].name} (${response.data.results[0].vicinity})`);
                }
            } else if (response.data.status === 'ZERO_RESULTS') {
                console.log(`ℹ️  No ${type}s found in this radius.`);
            } else {
                console.error(`❌ Error Status: ${response.data.status}`);
                if (response.data.error_message) {
                    console.error(`Message: ${response.data.error_message}`);
                }
            }
        } catch (error) {
            console.error(`❌ Request failed: ${error.message}`);
        }
    }
}

testMaps();
