import { findNearbyHospitals } from '../services/mapsService.js';

export const getNearbyHospitals = async (req, res, next) => {
    try {
        const { latitude, longitude, radius } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const hospitals = await findNearbyHospitals(
            parseFloat(latitude),
            parseFloat(longitude),
            radius ? parseInt(radius) : 5000
        );

        res.json(hospitals);
    } catch (error) {
        next(error);
    }
};
