import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig();

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASS as string,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        dialect: 'postgres',
        logging: false,
    }
);

// 👇 Dynamically load all *.model.ts files
const db: any = {
    sequelize,
    Sequelize,
};



fs.readdirSync(__dirname)
    .filter((file) =>
        file !== 'index.ts' &&
        file.endsWith('.model.ts')
    )
    .forEach((file) => {
        const modelPath = path.join(__dirname, file);
        const modelModule = require(modelPath);
        const defineModel = modelModule.default;

        if (typeof defineModel === 'function') {
            const model = defineModel(sequelize, DataTypes);
            db[model.name] = model;
        } else {
            console.warn(`⚠️ Skipping file ${file} — no valid model factory export.`);
        }
    });

// 👇 Wire up associations if defined
Object.values(db).forEach((model: any) => {
    if (typeof model?.associate === 'function') {
        model.associate(db);
    }
});

sequelize.sync({ alter: true }) // or { force: true } to drop and recreate
    .then(() => {
        console.log('📦 DB synced');
    })
    .catch(console.error);


export { db };
