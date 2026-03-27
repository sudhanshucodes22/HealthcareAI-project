import express from 'express';
import * as medicineController from '../controllers/medicineController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, medicineController.createMedication);
router.get('/', authenticate, medicineController.getAllMedications);
router.get('/upcoming', authenticate, medicineController.getUpcomingMedications);
router.get('/:id', authenticate, medicineController.getMedication);
router.put('/:id', authenticate, medicineController.updateMedication);
router.delete('/:id', authenticate, medicineController.deleteMedication);

export default router;
