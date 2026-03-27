import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Insurance = sequelize.define('Insurance', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    planName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    applicantName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    applicantAge: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    applicantAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
        defaultValue: 'Pending',
    },
    applicationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: true,
    tableName: 'Insurances',
});

export default Insurance;
