import { DescendingAuction, EnglishAuction, SilentAuction } from "../models/index.js";
import HttpError from '../config/HttpError.js';

class OfferController {






    static async getCreatedAuctions(req, res, next) {
        const userId = req.user.userId;

        try {
            const silentAuctions = await SilentAuction.findAll({
                where: { buyerId: userId },
                order: [['createdAt', 'DESC']],
            });

            const descendingAuctions = await DescendingAuction.findAll({
                where: { buyerId: userId },
                order: [['createdAt', 'DESC']],
            });

            const englishAuctions = await EnglishAuction.findAll({
                where: { buyerId: userId },
                order: [['createdAt', 'DESC']],
            });

            const allAuctions = [...silentAuctions, ...descendingAuctions, ...englishAuctions];
            allAuctions.sort((a, b) => b.createdAt - a.createdAt); // Ordina tutte le aste per data di creazione

            res.send(200).json(allAuctions);
        } catch (error) {
            console.error('Errore nel recupero delle aste:', error);
            next(new HttpError(`Errore nel recupero delle aste: ${error.message}`, 500));
        }
    }


    static async getPurchasedAuctions(req, res, next) {
        const userId = req.user.userId;

        try {
            const silentAuctions = await SilentAuction.findAll({
                where: { sellerId: userId },
                order: [['createdAt', 'DESC']],
            });

            const descendingAuctions = await DescendingAuction.findAll({
                where: { sellerId: userId },
                order: [['createdAt', 'DESC']],
            });

            const englishAuctions = await EnglishAuction.findAll({
                where: { sellerId: userId },
                order: [['createdAt', 'DESC']],
            });

            const allAuctions = [...silentAuctions, ...descendingAuctions, ...englishAuctions];
            allAuctions.sort((a, b) => b.createdAt - a.createdAt); // Ordina tutte le aste per data di creazione

            res.send(200).json(allAuctions);
        } catch (error) {
            console.error('Errore nel recupero delle aste:', error);
            next(new HttpError(`Errore nel recupero delle aste: ${error.message}`, 500));
        }
    }


}

export default OfferController; 