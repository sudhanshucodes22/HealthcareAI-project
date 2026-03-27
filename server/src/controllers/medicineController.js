import { Medication } from '../models/index.js';

export const createMedication = async (req, res, next) => {
    try {
        const { name, dosage, frequency, time, startDate, endDate, notes } = req.body;

        if (!name || !dosage || !frequency || !time || !startDate) {
            return res.status(400).json({
                error: 'Name, dosage, frequency, time, and start date are required',
            });
        }

        const medication = await Medication.create({
            userId: req.user.id,
            name,
            dosage,
            frequency,
            time,
            startDate,
            endDate,
            notes,
            active: true,
        });

        res.status(201).json(medication);
    } catch (error) {
        next(error);
    }
};

export const getAllMedications = async (req, res, next) => {
    try {
        const medications = await Medication.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
        });

        res.json(medications);
    } catch (error) {
        next(error);
    }
};

export const getMedication = async (req, res, next) => {
    try {
        const { id } = req.params;

        const medication = await Medication.findOne({
            where: { id, userId: req.user.id },
        });

        if (!medication) {
            return res.status(404).json({ error: 'Medication not found' });
        }

        res.json(medication);
    } catch (error) {
        next(error);
    }
};

export const updateMedication = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, dosage, frequency, time, startDate, endDate, active, notes } = req.body;

        const medication = await Medication.findOne({
            where: { id, userId: req.user.id },
        });

        if (!medication) {
            return res.status(404).json({ error: 'Medication not found' });
        }

        await medication.update({
            name: name || medication.name,
            dosage: dosage || medication.dosage,
            frequency: frequency || medication.frequency,
            time: time || medication.time,
            startDate: startDate || medication.startDate,
            endDate: endDate !== undefined ? endDate : medication.endDate,
            active: active !== undefined ? active : medication.active,
            notes: notes !== undefined ? notes : medication.notes,
        });

        res.json(medication);
    } catch (error) {
        next(error);
    }
};

export const deleteMedication = async (req, res, next) => {
    try {
        const { id } = req.params;

        const medication = await Medication.findOne({
            where: { id, userId: req.user.id },
        });

        if (!medication) {
            return res.status(404).json({ error: 'Medication not found' });
        }

        await medication.destroy();

        res.json({ message: 'Medication deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const getUpcomingMedications = async (req, res, next) => {
    try {
        const medications = await Medication.findAll({
            where: {
                userId: req.user.id,
                active: true,
            },
            order: [['time', 'ASC']],
        });

        res.json(medications);
    } catch (error) {
        next(error);
    }
};
