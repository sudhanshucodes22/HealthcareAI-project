import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import config from '../config/env.js';

export const register = async (req, res, next) => {
    try {
        const { email, password, name, phone, bloodType } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password, and name are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
            name,
            phone,
            bloodType,
        });

        const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                bloodType: user.bloodType,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                bloodType: user.bloodType,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getProfile = async (req, res, next) => {
    try {
        const user = req.user;
        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            bloodType: user.bloodType,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { name, phone, bloodType } = req.body;
        const user = req.user;

        await user.update({
            name: name || user.name,
            phone: phone !== undefined ? phone : user.phone,
            bloodType: bloodType || user.bloodType,
        });

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                bloodType: user.bloodType,
            },
        });
    } catch (error) {
        next(error);
    }
};
