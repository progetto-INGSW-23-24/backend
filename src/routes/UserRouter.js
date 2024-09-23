import express from "express";
import { UserController } from '../controllers/index.js'; 
import cognitoAuth from "../middlewares/cognitoAuth.js";

const userRouter = express.Router(); 

// modifica profilo utente 
userRouter.put('/profile', cognitoAuth, UserController.modifyProfile); 


export default userRouter; 