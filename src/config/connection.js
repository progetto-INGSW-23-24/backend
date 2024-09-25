import { Sequelize } from "sequelize";
import * as fs from "fs";
import { DB_NAME, DB_USER, DB_PSW, DB_PORT, DB_SCHEMA, DB_HOST } from './environment.js';

const connection = new Sequelize({
    database: DB_NAME,
    username: DB_USER,
    password: DB_PSW,
    host: DB_HOST,
    port: DB_PORT,
    schema: DB_SCHEMA,
    dialect: "postgres",
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: true,
            ca: fs.readFileSync('src/config/dieti_deals_24_backend_key.pem').toString()
        }
    }
})

try {
    await connection.authenticate()
    console.log('connection ok');
} catch (error) {
    console.log(`Unable to connect: ${error}`);
}

export default connection; 