import express from "express";
import { AuctionController } from '../controllers/index.js'; 

const auctionRouter = express.Router(); 


/* ---------------------------------------------- */

// ottenere le auctions dal db, vedere bene per quali parametri filtrare
auctionRouter.get('', async (req, res, next) => {

})

// ottenere aste di un utente in particolare
auctionRouter.get('/:userId', async (req, res, next) => {

})

// caricamento nuova asta 
auctionRouter.post('', async (req, res, next) => {

})

// modifica attributi di un'asta 
auctionRouter.patch(':id', async (req, res, next) => {

})

// eliminazione di un'asta
auctionRouter.delete(':id', async (req, res, next) => {

})

/* ---------------------------------------------- */

// ottieni tutte le offerte relative ad un'asta 
auctionRouter.get(':id/offers', async (req, res, next) => {

})

// fare un'offerta 
auctionRouter.post(':id/offers', async (req, res, next) => {

})

// accetta un offerta 
auctionRouter.patch(':id/offers/:offerId', async (req, res, next) => {

})


export default auctionRouter; 