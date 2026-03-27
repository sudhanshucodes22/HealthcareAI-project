import { BloodDonor, User } from '../models/index.js';
import { Op } from 'sequelize';

export const registerDonor = async (req, res, next) => {
    try {
        const { bloodType, location, city, state, lastDonation } = req.body;

        if (!bloodType || !location || !city) {
            return res.status(400).json({ error: 'Blood type, location, and city are required' });
        }

        // Check if user is already a donor
        let donor = await BloodDonor.findOne({ where: { userId: req.user.id } });

        if (donor) {
            // Update existing donor
            await donor.update({
                bloodType,
                location,
                city,
                state,
                lastDonation,
            });
        } else {
            // Create new donor
            donor = await BloodDonor.create({
                userId: req.user.id,
                bloodType,
                location,
                city,
                state,
                lastDonation,
                available: true,
            });
        }

        // Also update user's blood type
        await req.user.update({ bloodType });

        res.json({
            message: 'Donor registration successful',
            donor: {
                id: donor.id,
                bloodType: donor.bloodType,
                location: donor.location,
                city: donor.city,
                state: donor.state,
                lastDonation: donor.lastDonation,
                available: donor.available,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const searchDonors = async (req, res, next) => {
    try {
        const { bloodType, city, state } = req.query;

        const where = { available: true };

        if (bloodType) {
            where.bloodType = bloodType;
        }

        if (city) {
            where.city = { [Op.like]: `%${city}%` };
        }

        if (state) {
            where.state = { [Op.like]: `%${state}%` };
        }

        const donors = await BloodDonor.findAll({
            where,
            include: [{
                model: User,
                attributes: ['name', 'phone', 'email'],
            }],
            limit: 50,
        });

        res.json(donors);
    } catch (error) {
        next(error);
    }
};

export const updateAvailability = async (req, res, next) => {
    try {
        const { available } = req.body;

        const donor = await BloodDonor.findOne({ where: { userId: req.user.id } });

        if (!donor) {
            return res.status(404).json({ error: 'Donor registration not found' });
        }

        await donor.update({ available });

        res.json({
            message: 'Availability updated successfully',
            available: donor.available,
        });
    } catch (error) {
        next(error);
    }
};

export const getMyDonorProfile = async (req, res, next) => {
    try {
        const donor = await BloodDonor.findOne({
            where: { userId: req.user.id },
            include: [{
                model: User,
                attributes: ['name', 'phone', 'email'],
            }],
        });

        if (!donor) {
            return res.status(404).json({ error: 'Donor registration not found' });
        }

        res.json(donor);
    } catch (error) {
        next(error);
    }
};
