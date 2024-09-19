import express from 'express'; 
import connection from './config/connection.js';

const SERVER_PORT = 3000; 
const app = express(); 

app.get('/', (req, res) => {
    res.send("Dieti Deals Backend"); 
})


app.listen(SERVER_PORT, () => {
    console.log(`Server running at localhost:${SERVER_PORT}`);
})
