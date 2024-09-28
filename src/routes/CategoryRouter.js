import express from "express";
import cognitoAuth from "../middlewares/cognitoAuth.js";
import CategoryController from "../controllers/CategoryController.js";

const categoryRouter = express.Router();

// modifica profilo utente 
categoryRouter.get('', cognitoAuth, CategoryController.getCategories);

export default categoryRouter; 