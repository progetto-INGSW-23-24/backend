import express from 'express'; 
import { AuthController } from '../controllers/index.js'; 
import { User } from '../models/index.js';

const authRouter = express.Router(); 

authRouter.post('/signup', AuthController.signup); 

authRouter.post('/googleSignup', AuthController.signupWithGoogle); 

authRouter.post('/signin', AuthController.signin); 

authRouter.post('/emailResendCode', AuthController.resendEmailConfirmCode); 

export default authRouter; 