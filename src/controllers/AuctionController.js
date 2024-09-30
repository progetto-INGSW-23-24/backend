import {
    EnglishAuction,
    DescendingAuction,
    SilentAuction,
    SilentAuctionOffer,
    DescendingAuctionOffer,
    EnglishAuctionOffer,
    User,
    AuctionCategory,
} from "../models/index.js";
import HttpError from '../config/HttpError.js';
import { Op } from "sequelize";

class AuctionController {

    static async getAuctions(req, res, next) {
        try {
            // Parametri di query: limit, page, categories
            const limit = parseInt(req.query.limit) || 10; // Default: 10 elementi
            const page = parseInt(req.query.page) || 1; // Default: prima pagina
            const offset = (page - 1) * limit; // Calcola l'offset per la paginazione
            console.log(`CATEGORIES: ${req.query.categories}`);
            const categoryIds = req.query.categories ? req.query.categories.split(',').map(Number) : null;
            

            // Condizioni di ricerca (filtraggio per categoria opzionale)
            const whereCondition = {};

            if (categoryIds && categoryIds.length > 0) {
                whereCondition.categories = { [Op.in]: categoryIds };
            }

            // Include le offerte e il venditore per ciascun tipo di asta
            const includeOffersAndUserCondition = {
                silent: [
                    { model: SilentAuctionOffer },
                    { model: User, as: 'seller' },
                ],
                english: [
                    { model: EnglishAuctionOffer },
                    { model: User, as: 'seller' },
                ],
                descending: [
                    { model: DescendingAuctionOffer },
                    { model: User, as: 'seller' },
                ]
            };

            // Trova tutte le aste (silent, descending, english) con paginazione, categorie, offerte e creatore
            const silentAuctions = await SilentAuction.findAndCountAll({
                where: whereCondition,
                limit,
                offset,
                include: [...includeOffersAndUserCondition.silent],
                order: [['createdAt', 'DESC']],
            });

            const englishAuctions = await EnglishAuction.findAndCountAll({
                where: whereCondition,
                limit,
                offset,
                include: [...includeOffersAndUserCondition.english],
                order: [['createdAt', 'DESC']]
            });

            const descendingAuctions = await DescendingAuction.findAndCountAll({
                where: whereCondition,
                limit,
                offset,
                include: [...includeOffersAndUserCondition.descending],
                order: [['createdAt', 'DESC']]
            });

            silentAuctions.rows.forEach(auction => { auction.dataValues.auction_type = 'silent'; });
            englishAuctions.rows.forEach(auction => { auction.dataValues.auction_type = 'english'; });
            descendingAuctions.rows.forEach(auction => { auction.dataValues.auction_type = 'descending'; });

            // Combinare le aste
            const allAuctions = [
                ...silentAuctions.rows,
                ...englishAuctions.rows,
                ...descendingAuctions.rows
            ];

            // Ordina tutte le aste per createdAt
            allAuctions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Contare il numero totale di aste (combinato tra tutti i tipi di asta)
            const totalAuctions = silentAuctions.count + englishAuctions.count + descendingAuctions.count;

            // Restituire la risposta con tutte le aste e le informazioni di paginazione
            res.status(200).json({
                auctions: allAuctions,
                total: totalAuctions,
                page,
                totalPages: Math.ceil(totalAuctions / limit)
            });

        } catch (error) {
            console.error('Errore nel recupero delle aste:', error);
            next(new HttpError(`Errore nel recupero delle aste: ${error.message}`, 500));
        }
    }


    static async getUserAuctions(req, res, next) {
        try {
            const userId = req.params.userId;
            const auctions = await EnglishAuction.findAll({
                where: { sellerId: userId },
                include: [AuctionCategory],
                order: [['createdAt', 'DESC']]
            })

            res.status(200).json({ auctions });
        } catch (error) {
            console.log(`Errore nel recupero delle aste dell'utente:, ${error.message}`);
            next(new HttpError(`Errore durante il recupero delle aste: ${error.message}`, 500));
        }
    }

    static async createAuction(req, res, next) {
        try {
            const {
                auctionType,
                categories,
                description,
                expirationDateTime,
                startingPrice,
                minimumPrice,
                increaseThreshold,
                timer,
                decreaseAmount,
                decreaseTime
            } = req.body;

            const userId = req.user.userId;

            const imagePath = req.imageLocation;

            switch (auctionType) {
                case 'english':
                    const newEnglishAuction = await EnglishAuction.create({
                        categories,
                        description,
                        startingPrice,
                        increaseThreshold,
                        timer,
                        imagePath,
                        sellerId: userId
                    })

                    res.status(201).json({ message: 'Asta all\'Inglese Creata', auction: newEnglishAuction })
                    break;

                case 'descendant':
                    const newDescendingAuction = await DescendingAuction.create({
                        categories,
                        description,
                        imagePath,
                        startingPrice,
                        minimumPrice,
                        decreaseAmount,
                        decreaseTime,
                        sellerId: userId
                    })

                    res.status(201).json({ message: 'Asta al ribasso Creata', auction: newDescendingAuction })
                    break;

                case 'silent':
                    const newSilentAuction = await SilentAuction.create({
                        categories,
                        description,
                        imagePath,
                        expirationDateTime,
                        sellerId: userId
                    })

                    res.status(201).json({ message: 'Asta Silenziosa Creata', auction: newSilentAuction })
                    break;
            }
        } catch (error) {
            console.log(`Errore nella creazione dell'asta:${error.message}`);
            next(new HttpError(`Errore nella creazione dell'asta:${error.message}`, 500));
        }
    }

    static async deleteAuction(req, res, next) {
        try {
            const auctionId = req.params.id;
            const { auctionType } = req.body;

            switch (auctionType) {
                case "english":
                    const englishAuction = await EnglishAuction.findOne({ where: { id: auctionId } })
                    englishAuction.destroy();
                    res.send(200).json({ message: 'Asta Cancellata', auction: englishAuction });
                    break;

                case "descendant":
                    const descendantAuction = await DescendingAuction.findOne({ where: { id: auctionId } })
                    descendantAuction.destroy();
                    res.send(200).json({ message: 'Asta Cancellata', auction: descendantAuction });
                    break;

                case "silent":
                    const silentAuction = await SilentAuction.findOne({ where: { id: auctionId } })
                    silentAuction.destroy();
                    res.send(200).json({ message: 'Asta Cancellata', auction: silentAuction });
                    break;
            }
        } catch (error) {
            console.log("Errore nel cancellare l'asta", error);
            next(new HttpError(`Errore nel cancellare l\'asta: ${error.message}`));
        }
    }

    static async makeOffer(req, res, next) {
        try {
            const { amount, auctionType } = req.body;
            const auctionId = req.params.id;
            const userId = req.user.id; // id dell'utente autenticato

            let auctionModel, offerModel;

            // Seleziona il modello dell'asta e dell'offerta in base al tipo di asta
            switch (auctionType) {
                case 'english':
                    auctionModel = EnglishAuction;
                    offerModel = EnglishAuctionOffer;
                    break;
                case 'silent':
                    auctionModel = SilentAuction;
                    offerModel = SilentAuctionOffer;
                    break;
                case 'descending':
                    auctionModel = DescendingAuction;
                    offerModel = DescendingAuctionOffer;
                    break;
                default:
                    return res.status(400).json({ message: 'Tipo di asta non valido.' });
            }

            // Trova l'asta corretta
            const auction = await auctionModel.findByPk(auctionId);

            if (!auction) {
                return res.status(404).json({ message: 'Asta non trovata' });
            }

            // Verifica che l'asta non sia scaduta (logica inclusa negli hook)
            const isAuctionExpired = auction.timer <= 0;
            if (isAuctionExpired) {
                return res.status(400).json({ message: 'L\'asta è già scaduta.' });
            }

            // Creazione o aggiornamento offerta (la logica specifica sarà gestita negli hook)
            const newOffer = await offerModel.create({
                auctionId,
                userId,
                amount
            });

            // Risposta con l'offerta creata o aggiornata
            res.status(201).json({
                message: 'Offerta effettuata con successo',
                offer: newOffer
            });

        } catch (error) {
            console.error('Errore nel fare l\'offerta:', error);
            next(new HttpError(`Errore nel fare l'offerta: ${error.message}`, 500));
        }
    }

    static async acceptSilentOffer(req, res, next) {
        try {
            const offerId = req.params.offerId;
            const auctionId = req.params.id;

            // Trova l'asta
            const auction = await SilentAuction.findByPk(auctionId);
            const offer = await SilentAuctionOffer.findByPk(offerId);

            if (!auction || !offer) {
                return res.status(404).json({ message: 'Asta o Offerta non trovata' });
            }

            auction.buyerId = offer.userId;
            await auction.save();

            // Risposta con il risultato
            res.status(200).json({
                message: 'Offerta accettata, asta conclusa.',
                auction,
                offer
            });

        } catch (error) {
            console.error('Errore nell\'accettare l\'offerta:', error);
            next(new HttpError(`Errore nell'accettare l'offerta: ${error.message}`, 500));
        }
    }

}

export default AuctionController; 