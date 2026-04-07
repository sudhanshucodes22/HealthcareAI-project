import axios from 'axios';
import config from '../config/env.js';

const SPECIALTIES_POOL = [
    'Cardiology (Heart)',
    'Orthopedics (Back & Bones)',
    'Neurology (Brain)',
    'Ophthalmology (Eye)',
    'Dermatology (Skin)',
    'Gastroenterology (Stomach)',
    'Pediatrics (Kids)',
    'General Medicine'
];

const DOCTORS_POOL = [
    { name: 'Dr. Rajesh Sharma', time: '10:00 AM - 04:00 PM' },
    { name: 'Dr. Priya Mehta', time: '09:00 AM - 01:00 PM' },
    { name: 'Dr. Amit Verma', time: '02:00 PM - 08:00 PM' },
    { name: 'Dr. Sneha Gupta', time: '11:00 AM - 05:00 PM' },
    { name: 'Dr. Vikram Singh', time: '08:00 AM - 12:00 PM' }
];

export const findNearbyHospitals = async (latitude, longitude, radius = 5000) => {
    try {
        const query = `
            [out:json][timeout:15];
            (
              node["amenity"="hospital"](around:${radius},${latitude},${longitude});
              node["amenity"="clinic"](around:${radius},${latitude},${longitude});
              node["amenity"="doctors"](around:${radius},${latitude},${longitude});
              node["healthcare"="ambulance"](around:${radius},${latitude},${longitude});
            );
            out center;
        `;

        const response = await axios.post('https://overpass-api.de/api/interpreter', query, {
            headers: { 'Content-Type': 'text/plain' }
        });

        const results = [];
        if (response.data && response.data.elements) {
            response.data.elements.forEach(el => {
                if (el.tags && el.tags.name) {
                    let type = 'clinic';
                    if (el.tags.amenity === 'hospital') type = 'hospital';
                    if (el.tags.healthcare === 'ambulance') type = 'ambulance';

                    results.push({
                        id: el.id.toString(),
                        name: el.tags.name,
                        address: el.tags['addr:street'] ? `${el.tags['addr:street']} ${el.tags['addr:city'] || ''}` : 'Local facility',
                        location: { lat: el.lat, lng: el.lon },
                        type: type,
                        rating: 4.0 + (Math.random() * 1.0), // Mock rating since Overpass doesn't have ratings
                        isOpen: true,
                        emergencyServices: el.tags.emergency === 'yes' || type === 'hospital',
                        phone: el.tags.phone || 'N/A',
                        distance: 'Nearby',
                        specialties: SPECIALTIES_POOL.slice(0, 2 + Math.floor(Math.random() * 3)),
                        doctors: DOCTORS_POOL.slice(0, 2 + Math.floor(Math.random() * 2))
                    });
                }
            });
        }

        // If nothing found dynamically, provide the mock data
        if (results.length === 0) {
            console.warn('⚠️ Overpass API returned 0 results. Returning dynamic mock data.');
            return [
                {
                    id: 'mock-1',
                    name: 'City General Hospital (Mock)',
                    address: 'Local area',
                    distance: '1.2 km',
                    phone: '+91-141-5550100',
                    type: 'hospital',
                    rating: 4.5,
                    location: { lat: latitude + 0.005, lng: longitude + 0.005 },
                    isOpen: true,
                    emergencyServices: true,
                    specialties: ['Cardiology (Heart)', 'General Medicine', 'Neurology (Brain)'],
                    doctors: [
                        { name: 'Dr. Rajesh Sharma', time: '10:00 AM - 04:00 PM' },
                        { name: 'Dr. Priya Mehta', time: '09:00 AM - 01:00 PM' }
                    ]
                },
                {
                    id: 'mock-2',
                    name: 'Emergency Medical Center (Mock)',
                    address: 'Local area',
                    distance: '2.5 km',
                    phone: '+91-141-5550200',
                    type: 'emergency',
                    rating: 4.3,
                    location: { lat: latitude - 0.008, lng: longitude + 0.003 },
                    isOpen: true,
                    emergencyServices: true,
                    specialties: ['Emergency Medicine', 'Orthopedics (Back & Bones)', 'Trauma Care'],
                    doctors: [
                        { name: 'Dr. Vikram Singh', time: '08:00 AM - 12:00 PM' },
                        { name: 'Dr. Amit Verma', time: '02:00 PM - 08:00 PM' }
                    ]
                },
                {
                    id: 'mock-3',
                    name: 'St. Mary\'s Clinic (Mock)',
                    address: 'Local area',
                    distance: '3.8 km',
                    phone: '+91-141-5550300',
                    type: 'clinic',
                    rating: 4.7,
                    location: { lat: latitude + 0.002, lng: longitude - 0.01 },
                    isOpen: true,
                    emergencyServices: false,
                    specialties: ['Pediatrics (Kids)', 'Ophthalmology (Eye)', 'Dermatology (Skin)', 'General Medicine'],
                    doctors: [
                        { name: 'Dr. Sneha Gupta', time: '11:00 AM - 05:00 PM' },
                        { name: 'Dr. Amit Verma', time: '02:00 PM - 08:00 PM' }
                    ]
                },
                {
                    id: 'mock-4',
                    name: 'City Ambulance Hub (Mock)',
                    address: 'Local area',
                    distance: '1.0 km',
                    phone: '102',
                    type: 'ambulance',
                    rating: 4.9,
                    location: { lat: latitude - 0.004, lng: longitude - 0.006 },
                    isOpen: true,
                    emergencyServices: true,
                    specialties: ['Emergency', 'Ambulance', 'Trauma Care'],
                    doctors: [{ name: 'On-Call Lead', time: '24/7' }]
                }
            ];
        }

        return results;
    } catch (error) {
        console.error('Error calling Overpass API:', error.message);
        throw new Error('Failed to find nearby facilities');
    }
};
