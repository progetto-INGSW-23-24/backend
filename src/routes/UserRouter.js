import express from "express";
import { UserController } from '../controllers/index.js';
import cognitoAuth from "../middlewares/cognitoAuth.js";
import { upload, uploadProfilePicture } from "../middlewares/upload.js";

const userRouter = express.Router();

// modifica profilo utente 
userRouter.put('/profile',
    cognitoAuth,
    upload.single("image"),
    uploadProfilePicture,
    UserController.modifyProfile
);


export default userRouter; 