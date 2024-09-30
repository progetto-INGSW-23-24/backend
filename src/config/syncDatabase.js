import connection from "./connection.js";
import * as Models from '../models/index.js';

const syncDatabase = async () => {
    try {
        await connection.sync({ alter: true });
        console.log('Database Modified');
    } catch (error) {
        console.log(`Error with database synchronization: ${error}`);
    }
}

await syncDatabase(); 