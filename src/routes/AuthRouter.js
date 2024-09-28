import express from 'express';
import { AuthController } from '../controllers/index.js';

const authRouter = express.Router();

authRouter.post('/signup', AuthController.signup);

authRouter.post('/googleSignup', AuthController.signupWithGoogle);

authRouter.post('/signin', AuthController.signin);

authRouter.post('/emailResendCode', AuthController.resendEmailConfirmCode);

authRouter.post('/refreshToken', AuthController.refreshToken);

export default authRouter; 