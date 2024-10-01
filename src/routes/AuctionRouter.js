import express from "express";
import { AuctionController } from '../controllers/index.js';
import cognitoAuth from '../middlewares/cognitoAuth.js';
import { upload, uploadAuctionImage } from "../middlewares/upload.js";

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
    upload.single("image"),
    uploadAuctionImage,
    AuctionController.createAuction
);

// eliminazione di un'asta
auctionRouter.delete('/:id', cognitoAuth, AuctionController.deleteAuction);

/* ---------------------------------------------- */

// fare un'offerta 
auctionRouter.post('/:id/offers', cognitoAuth, AuctionController.makeOffer);

// accetta un offerta 
auctionRouter.patch('/:id/offers/:offerId', cognitoAuth, AuctionController.acceptSilentOffer);


auctionRouter.get('/created', AuctionController.getCreatedAuctions);
auctionRouter.get('/purchased', AuctionController.getPurchasedAuctions);

export default auctionRouter; 