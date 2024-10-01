import express from 'express';
import OfferController from '../controllers/OfferController.js';

const offerRouter = express.Router();

offerRouter.get('/created', OfferController.getCreatedAuctions);

offerRouter.get('/purchased', OfferController.getPurchasedAuctions);

export default offerRouter; 