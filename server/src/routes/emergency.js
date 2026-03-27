import express from 'express';
import * as emergencyController from '../controllers/emergencyController.js';

const router = express.Router();

router.post('/nearby', emergencyController.getNearbyHospitals);

export default router;
