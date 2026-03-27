import { HealthRecord } from '../models/index.js';
import { analyzeDiseaseSymptoms } from '../services/geminiService.js';

export const predictDisease = async (req, res, next) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms) {
            return res.status(400).json({ error: 'Symptoms are required' });
        }

        const analysis = await analyzeDiseaseSymptoms(symptoms);

        const record = await HealthRecord.create({
            userId: req.user.id,
            symptoms,
            prediction: analysis.prediction,
            severity: analysis.severity,
        });

        res.json({
            id: record.id,
            symptoms: record.symptoms,
            prediction: record.prediction,
            severity: record.severity,
            createdAt: record.createdAt,
        });
    } catch (error) {
        next(error);
    }
};

export const getHistory = async (req, res, next) => {
    try {
        const records = await HealthRecord.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 50,
        });

        res.json(records);
    } catch (error) {
        next(error);
    }
};

export const getRecord = async (req, res, next) => {
    try {
        const { id } = req.params;

        const record = await HealthRecord.findOne({
            where: { id, userId: req.user.id },
        });

        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.json(record);
    } catch (error) {
        next(error);
    }
};
