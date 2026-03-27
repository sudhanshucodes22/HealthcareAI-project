import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const HealthRecord = sequelize.define('HealthRecord', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
    },
    symptoms: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    prediction: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    severity: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    timestamps: true,
    updatedAt: false,
    tableName: 'HealthRecords',
});

export default HealthRecord;
