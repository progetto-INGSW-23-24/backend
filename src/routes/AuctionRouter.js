import express from "express";
import { AuctionController } from '../controllers/index.js';
import cognitoAuth from '../middlewares/cognitoAuth.js';
import { uploadAuctionImage } from "../middlewares/upload.js";

const auctionRouter = express.Router();

/* ---------------------------------------------- */

// ottenere le auctions dal db, vedere bene per quali parametri filtrare
auctionRouter.get('', cognitoAuth, AuctionController.getAuctions);

// ottenere aste di un utente in particolare
auctionRouter.get('/:userId', cognitoAuth, AuctionController.getUserAuctions);

// caricamento nuova asta 
auctionRouter.post(
    '',
    cognitoAuth,
    (req, res, next) => {
        uploadAuctionImage(req, res, function (err) {
            if (err) return res.status(400).json({ error: err.message });

            req.imageUrl = req.file.location; // Salva l'URL dell'immagine nel req
            next();
        })
    },
    AuctionController.createAuction
);

// eliminazione di un'asta
auctionRouter.delete(':id', cognitoAuth, AuctionController.deleteAuction);

/* ---------------------------------------------- */

// fare un'offerta 
auctionRouter.post(':id/offers', cognitoAuth, AuctionController.makeOffer);

// accetta un offerta 
auctionRouter.patch(':id/offers/:offerId', cognitoAuth, AuctionController.acceptSilentOffer);

export default auctionRouter; 