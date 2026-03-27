import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const BloodDonor = sequelize.define('BloodDonor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    bloodType: {
        type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastDonation: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: true,
    tableName: 'BloodDonors',
});

export default BloodDonor;
