import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ChatHistory = sequelize.define('ChatHistory', {
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
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    response: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    timestamps: true,
    updatedAt: false,
    tableName: 'ChatHistories',
});

export default ChatHistory;
