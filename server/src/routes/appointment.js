import express from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All appointment routes require authentication
router.use(authenticate);

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getUserAppointments);
router.put('/:id/cancel', appointmentController.cancelAppointment);

export default router;
