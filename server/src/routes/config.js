import express from 'express';

const router = express.Router();

/**
 * @route   GET /api/config
 * @desc    Get site-wide configuration settings
 * @access  Public
 */
router.get('/', (req, res) => {
    res.json({
        siteName: 'HealthCare AI',
        backgroundImage: '/hospital-bg.png',
        theme: {
            primary: 'teal',
            secondary: 'cyan',
            mode: 'dark'
        },
        features: {
            aiDiseasePrediction: true,
            bloodDonation: true,
            mentalHealth: true,
            medicineReminder: true,
            emergencyLocator: true
        }
    });
});

export default router;
