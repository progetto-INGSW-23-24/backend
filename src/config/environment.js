import dotenv from 'dotenv'; 

dotenv.config() 

const SERVER_PORT = process.env.SERVER_PORT; 
const DB_PORT = process.env.DB_PORT; 
const DB_USER = process.env.DB_USER; 
const DB_PSW = process.env.DB_PSW; 
const DB_SCHEMA = process.env.DB_SCHEMA; 
const HOST = process.env.HOST; 
const DB_NAME = process.env.DB_NAME; 
const DOMAIN = process.env.DOMAIN; 

const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID; 
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID; 
const COGNITO_REGION = process.env.COGNITO_REGION; 

export {
    SERVER_PORT, 
    DB_PORT, 
    DB_USER, 
    DB_PSW, 
    DB_SCHEMA, 
    HOST, 
    DB_NAME,
    DOMAIN, 

    COGNITO_CLIENT_ID, 
    COGNITO_USER_POOL_ID,
    COGNITO_REGION
}