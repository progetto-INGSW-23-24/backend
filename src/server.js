import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import connection from './config/connection.js';
import { authRouter, userRouter, auctionRouter } from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import { SERVER_HOST } from './config/environment.js';
import categoryRouter from './routes/CategoryRouter.js';

const SERVER_PORT = 3000;

const app = express();

// Get the current file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = path.dirname(__filename);


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/users', userRouter);
app.use('/auctions', auctionRouter);
app.use('/auth', authRouter);
app.use('/category', categoryRouter);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.status("Dieti Deals Backend");
})


app.listen(SERVER_PORT, () => {
    console.log(`Server running at ${SERVER_HOST}:${SERVER_PORT}`);
})
