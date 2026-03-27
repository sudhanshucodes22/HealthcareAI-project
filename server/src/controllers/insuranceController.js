import { Insurance, User } from '../models/index.js';

export const applyInsurance = async (req, res, next) => {
    try {
        const { planName, price, applicantName, applicantAge, applicantAddress, paymentMethod } = req.body;

        if (!planName || !price || !applicantName || !applicantAge || !applicantAddress || !paymentMethod) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const application = await Insurance.create({
            userId: req.user.id,
            planName,
            price,
            applicantName,
            applicantAge,
            applicantAddress,
            paymentMethod
        });

        res.status(201).json({
            message: 'Insurance application submitted successfully',
            application,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyInsurances = async (req, res, next) => {
    try {
        const insurances = await Insurance.findAll({
            where: { userId: req.user.id },
            order: [['applicationDate', 'DESC']],
        });

        res.json(insurances);
    } catch (error) {
        next(error);
    }
};

export const getAllInsurances = async (req, res, next) => {
    try {
        // This could be restricted to admin if needed
        const insurances = await Insurance.findAll({
            include: [{
                model: User,
                attributes: ['name', 'email', 'phone'],
            }],
            order: [['applicationDate', 'DESC']],
        });

        res.json(insurances);
    } catch (error) {
        next(error);
    }
};
