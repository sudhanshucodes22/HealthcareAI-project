import { Appointment } from '../models/index.js';

export const createAppointment = async (req, res, next) => {
    try {
        const { hospitalId, hospitalName, doctorName, specialty, appointmentDate, appointmentTime, reason } = req.body;
        const userId = req.user.id; // From auth middleware

        // Generate a random token number (e.g., ABC-123)
        const tokenNumber = Math.random().toString(36).substring(2, 5).toUpperCase() + '-' + Math.floor(100 + Math.random() * 900);

        const appointment = await Appointment.create({
            userId,
            hospitalId,
            hospitalName,
            doctorName,
            specialty,
            appointmentDate,
            appointmentTime,
            tokenNumber,
            reason,
        });

        res.status(201).json(appointment);
    } catch (error) {
        next(error);
    }
};

export const getUserAppointments = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const appointments = await Appointment.findAll({
            where: { userId },
            order: [['appointmentDate', 'DESC'], ['appointmentTime', 'DESC']],
        });
        res.json(appointments);
    } catch (error) {
        next(error);
    }
};

export const cancelAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const appointment = await Appointment.findOne({ where: { id, userId } });
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.json({ message: 'Appointment cancelled successfully', appointment });
    } catch (error) {
        next(error);
    }
};
