import { User, HealthRecord, BloodDonor, ChatHistory, Medication } from './src/models/index.js';

const models = { User, HealthRecord, BloodDonor, ChatHistory, Medication };

async function inspectDatabase() {
    console.log('--- Database Inspection ---');

    for (const [modelName, model] of Object.entries(models)) {
        try {
            const count = await model.count();
            console.log(`\nTable: ${modelName} (${count} records)`);

            if (count > 0) {
                const records = await model.findAll({ limit: 5, raw: true });
                console.table(records);
            } else {
                console.log('  No records found.');
            }
        } catch (error) {
            console.error(`Error inspecting table ${modelName}:`, error.message);
        }
    }

    process.exit();
}

inspectDatabase();
