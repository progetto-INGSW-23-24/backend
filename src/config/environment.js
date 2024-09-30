import dotenv from 'dotenv';

dotenv.config()

const SERVER_PORT = process.env.SERVER_PORT;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PSW = process.env.DB_PSW;
const DB_SCHEMA = process.env.DB_SCHEMA;
const DB_HOST = process.env.DB_HOST;
const DB_NAME = process.env.DB_NAME;
const SERVER_HOST = process.env.SERVER_HOST;

const COGNITO_CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_REGION = process.env.COGNITO_REGION;

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const S3_AWS_REGION = process.env.S3_AWS_REGION;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

export {
    SERVER_PORT,
    SERVER_HOST,

    DB_PORT,
    DB_USER,
    DB_PSW,
    DB_SCHEMA,
    DB_HOST,
    DB_NAME,

    COGNITO_CLIENT_ID,
    COGNITO_USER_POOL_ID,
    COGNITO_REGION,

    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    S3_AWS_REGION,
    S3_BUCKET_NAME,
}