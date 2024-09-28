import HttpError from "../config/HttpError.js";
import { Category } from "../models/index.js";

class CategoryController {

    static async getCategories(req, res, next) {
        try {
            const categories = await Category.findAll();

            return res.status(200).json(categories);
        } catch (error) {
            next(new HttpError(`Errore nel selezionare le categorie: ${error.message}`, 500));
        }
    }

}

export default CategoryController; 