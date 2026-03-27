import express from 'express';
import * as diseaseController from '../controllers/diseaseController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/predict', authenticate, diseaseController.predictDisease);
router.get('/history', authenticate, diseaseController.getHistory);
router.get('/history/:id', authenticate, diseaseController.getRecord);

export default router;
