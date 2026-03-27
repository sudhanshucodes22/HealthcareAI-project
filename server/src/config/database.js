import { Sequelize } from 'sequelize';
import config from './env.js';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.dbPath,
    logging: config.nodeEnv === 'development' ? console.log : false,
});

export const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
        throw error;
    }
};

export default sequelize;
