import { ChatHistory } from '../models/index.js';
import { generateMentalHealthResponse } from '../services/geminiService.js';

export const chat = async (req, res, next) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Get recent chat history for context
        const recentHistory = await ChatHistory.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 5,
        });

        const historyContext = recentHistory.reverse();

        const response = await generateMentalHealthResponse(message, historyContext);

        const chatRecord = await ChatHistory.create({
            userId: req.user.id,
            message,
            response,
        });

        res.json({
            id: chatRecord.id,
            message: chatRecord.message,
            response: chatRecord.response,
            createdAt: chatRecord.createdAt,
        });
    } catch (error) {
        next(error);
    }
};

export const getHistory = async (req, res, next) => {
    try {
        const history = await ChatHistory.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'ASC']],
            limit: 100,
        });

        res.json(history);
    } catch (error) {
        next(error);
    }
};

export const clearHistory = async (req, res, next) => {
    try {
        await ChatHistory.destroy({
            where: { userId: req.user.id },
        });

        res.json({ message: 'Chat history cleared successfully' });
    } catch (error) {
        next(error);
    }
};
