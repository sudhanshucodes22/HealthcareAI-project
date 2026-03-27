import express from 'express';
import * as bloodController from '../controllers/bloodController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register-donor', authenticate, bloodController.registerDonor);
router.get('/donors', authenticate, bloodController.searchDonors);
router.put('/availability', authenticate, bloodController.updateAvailability);
router.get('/my-profile', authenticate, bloodController.getMyDonorProfile);

export default router;
