import express from 'express'; 
import cors from 'cors'; 
import bodyParser from 'body-parser'; 
import connection from './config/connection.js';
import { authRouter, userRouter, auctionRouter } from './routes/index.js'; 
import errorHandler from './middlewares/errorHandler.js'; 

const SERVER_PORT = 3000; 

const app = express(); 

app.use(cors()); 
app.use(express.json()); 
app.use(bodyParser.json()); 

app.use('/users', userRouter);
app.use('/auctions', auctionRouter); 
app.use('/auth', authRouter);   

app.use(errorHandler); 

app.get('/', (req, res) => {
    res.send("Dieti Deals Backend"); 
})


app.listen(SERVER_PORT, () => {
    console.log(`Server running at localhost:${SERVER_PORT}`);
})
