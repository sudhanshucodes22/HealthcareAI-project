import axios from 'axios';

async function testOverpass() {
    const latitude = 26.79;
    const longitude = 75.82;
    const radius = 5000;

    const query = `
        [out:json][timeout:15];
        (
          node["amenity"="hospital"](around:${radius},${latitude},${longitude});
          node["amenity"="clinic"](around:${radius},${latitude},${longitude});
        );
        out center;
    `;

    try {
        console.log('Testing Overpass API...');
        const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
            headers: { 'Content-Type': 'text/plain' }
        });
        console.log('✅ Success! Found:', response.data.elements.length, 'facilities.');
        if (response.data.elements.length > 0) {
            console.log('Example:', response.data.elements[0].tags.name);
        }
    } catch (error) {
        console.error('❌ Overpass API Error:', error.message);
    }
}

testOverpass();
