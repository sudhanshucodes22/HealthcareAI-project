import sequelize from '../config/database.js';
import User from './User.js';
import HealthRecord from './HealthRecord.js';
import BloodDonor from './BloodDonor.js';
import ChatHistory from './ChatHistory.js';
import Medication from './Medication.js';
import Insurance from './Insurance.js';
import Appointment from './Appointment.js';

// Define associations
User.hasMany(HealthRecord, { foreignKey: 'userId', onDelete: 'CASCADE' });
HealthRecord.belongsTo(User, { foreignKey: 'userId' });

User.hasOne(BloodDonor, { foreignKey: 'userId', onDelete: 'CASCADE' });
BloodDonor.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(ChatHistory, { foreignKey: 'userId', onDelete: 'CASCADE' });
ChatHistory.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Medication, { foreignKey: 'userId', onDelete: 'CASCADE' });
Medication.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Insurance, { foreignKey: 'userId', onDelete: 'CASCADE' });
Insurance.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Appointment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

// Sync database
export const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: false });
        console.log('✅ Database synchronized successfully.');
    } catch (error) {
        console.error('❌ Error synchronizing database:', error);
        throw error;
    }
};

export {
    User,
    HealthRecord,
    BloodDonor,
    ChatHistory,
    Medication,
    Insurance,
    Appointment,
};
