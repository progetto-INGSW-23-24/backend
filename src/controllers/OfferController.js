import { DescendingAuction, DescendingAuctionOffer, EnglishAuction, EnglishAuctionOffer, SilentAuction, SilentAuctionOffer } from "../models/index.js";
import HttpError from '../config/HttpError.js';
import { isSilentAuctionExpired } from "../models/Auction/SilentAuction.js";
import { isEnglishAuctionExpired } from "../models/Auction/EnglishAuction.js";
import { isDescendingAuctionExpired } from "../models/Auction/DescendantAuction.js";

class OfferController {

    static async getCreatedAuctions(req, res, next) {
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

            silentAuctions.forEach((auction) => {
                auction.dataValues.is_expired = isSilentAuctionExpired(auction);
                auction.dataValues.auction_type = 'silent';
            });
            englishAuctions.forEach(async (auction) => {
                auction.dataValues.is_expired = await isEnglishAuctionExpired(auction);
                auction.dataValues.auction_type = 'english';
            });
            descendingAuctions.forEach((auction) => {
                auction.dataValues.is_expired = isDescendingAuctionExpired(auction);
                auction.dataValues.auction_type = 'descending';
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
                include: [
                    {
                        model: SilentAuctionOffer,
                        where: { userId: userId }, // Filtra le offerte per userId specifico
                        required: true // Assicura che solo le SilentAuction con offerte dell'utente siano restituite
                    }
                ],
                order: [['createdAt', 'DESC']],
            })


            const descendingAuctions = await DescendingAuction.findAll({
                include: [
                    {
                        model: DescendingAuctionOffer,
                        where: { userId: userId }, // Filtra le offerte per userId specifico
                        required: true // Assicura che solo le SilentAuction con offerte dell'utente siano restituite
                    }
                ],
                order: [['createdAt', 'DESC']],
            })

            const englishAuctions = await EnglishAuction.findAll({
                include: [
                    {
                        model: EnglishAuctionOffer,
                        where: { userId: userId }, // Filtra le offerte per userId specifico
                        required: true // Assicura che solo le SilentAuction con offerte dell'utente siano restituite
                    }
                ],
                order: [['createdAt', 'DESC']],
            })

            silentAuctions.forEach((auction) => {
                auction.dataValues.is_expired = isSilentAuctionExpired(auction);
                auction.dataValues.auction_type = 'silent';
            });
            englishAuctions.forEach(async (auction) => {
                auction.dataValues.is_expired = await isEnglishAuctionExpired(auction);
                auction.dataValues.auction_type = 'english';
            });
            descendingAuctions.forEach((auction) => {
                auction.dataValues.is_expired = isDescendingAuctionExpired(auction);
                auction.dataValues.auction_type = 'descending';
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