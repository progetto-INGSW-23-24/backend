import HttpError from "../config/HttpError.js";
import { AuctionCategory } from "../models/index.js";

class CategoryController {

    static async getCategories(req, res, next) {
        try {
            const categories = await AuctionCategory.findAll();

            res.status(200).json(categories);
        } catch (error) {
            next(new HttpError(`Errore nel selezionare le categorie: ${error.message}`, 500));
        }
    }

}

export default CategoryController; 