import express from 'express'; 
import { AuthController } from '../controllers/index.js'; 

const authRouter = express.Router(); 

authRouter.post('/signup', AuthController.signup)

authRouter.post('/googleSignup', AuthController.signupWithGoogle)

authRouter.post('/signin', async (req, res, next) => {
    const result = await AuthController.signin(req, res, next); 
    return res.status(200).json(result); 
})

authRouter.post('/emailConfirmCode', AuthController.confirmEmail); 

authRouter.post('/emailResendCode', AuthController.resendEmailConfirmCode); 

export default authRouter; 