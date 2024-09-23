import express from "express";
import { UserController } from '../controllers/index.js'; 

const userRouter = express.Router(); 

// modifica profilo utente 
userRouter.patch(':id', async (req, res, next) => {
    
})


export default userRouter; 