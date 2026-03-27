import express from 'express';
import * as insuranceController from '../controllers/insuranceController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/apply', authenticate, insuranceController.applyInsurance);
router.get('/my', authenticate, insuranceController.getMyInsurances);
router.get('/all', authenticate, insuranceController.getAllInsurances);

export default router;
