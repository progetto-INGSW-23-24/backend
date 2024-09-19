import connection from "./connection.js";

const syncDatabase = async () => {
    try {
        await connection.sync({force: true}); 
        console.log('Database Created');
    } catch(error) {
        console.log(`Error with database synchronization: ${error}`);
    }
}

await syncDatabase(); 