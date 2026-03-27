import express from 'express';
import * as mentalController from '../controllers/mentalController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', authenticate, mentalController.chat);
router.get('/history', authenticate, mentalController.getHistory);
router.delete('/history', authenticate, mentalController.clearHistory);

export default router;
