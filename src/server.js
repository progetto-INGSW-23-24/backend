import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import connection from './config/connection.js';
import { authRouter, userRouter, auctionRouter } from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import {
    SERVER_PORT,
    DB_PORT,
    DB_USER,
    DB_PSW,
    DB_SCHEMA,
    DB_HOST,
    DB_NAME,
    SERVER_HOST,
    COGNITO_CLIENT_ID,
    COGNITO_USER_POOL_ID,
    COGNITO_REGION
} from './config/environment.js';

import dotenv from 'dotenv';

dotenv.config();

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

app.use(errorHandler);

app.get('/', (req, res) => {
    // res.send("Dieti Deals Backend"); 
    res.json(
        {
            "SERVER_PORT": SERVER_PORT,
            "DB_PORT": DB_PORT ?? "niente",
            "DB_USER": DB_USER ?? "niente",
            "DB_PSW": DB_PSW ?? "niente",
            "DB_SCHEMA": DB_SCHEMA ?? "niente",
            "DB_HOST": DB_HOST ?? "niente",
            "DB_NAME": DB_NAME ?? "niente",
            "SERVER_HOST": SERVER_HOST ?? "niente",
            "COGNITO_CLIENT_ID": COGNITO_CLIENT_ID ?? "niente",
            "COGNITO_USER_POOL_ID": COGNITO_USER_POOL_ID ?? "niente",
            "COGNITO_REGION": COGNITO_REGION ?? "niente"
        }
    );
})


app.listen(SERVER_PORT, () => {
    console.log(`Server running at localhost:${SERVER_PORT}`);
})
