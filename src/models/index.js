import UserModel from './User/User.js';
import AuctionCategoryModel from './AuctionCategory/AuctionCategory.js';
import { SilentAuctionModel, DescendingAuctionModel, EnglishAuctionModel } from './Auction/index.js';
import { DescendingAuctionOfferModel, SilentAuctionOfferModel, EnglishAuctionOfferModel } from './AuctionOffer/index.js';
import connection from '../config/connection.js';
import { isDescendingAuctionExpired } from './Auction/DescendantAuction.js';
import { isSilentAuctionExpired } from './Auction/SilentAuction.js';
import { isEnglishAuctionExpired } from './Auction/EnglishAuction.js';


// Definizione Modelli 
const User = connection.define('User', UserModel, { updatedAt: false });


const SilentAuction = connection.define('SilentAuction', SilentAuctionModel, { updatedAt: false });
const EnglishAuction = connection.define('EnglishAuction', EnglishAuctionModel, { updatedAt: false });
const DescendingAuction = connection.define('DescendingAuction', DescendingAuctionModel, { updatedAt: false });

const SilentAuctionOffer = connection.define('SilentAuctionOffer', SilentAuctionOfferModel, { updatedAt: false });
const EnglishAuctionOffer = connection.define('EnglishAuctionOffer', EnglishAuctionOfferModel, { updatedAt: false });
const DescendingAuctionOffer = connection.define('DescendingAuctionOffer', DescendingAuctionOfferModel, { updatedAt: false });

const AuctionCategory = connection.define('AuctionCategory', AuctionCategoryModel, { timestamps: false });

// Definizione Associazioni 
User.createdSilentAuctions = User.hasMany(SilentAuction, { foreignKey: { allowNull: false, name: 'sellerId' }, onDelete: 'CASCADE' });
User.createdDescendingAuctions = User.hasMany(DescendingAuction, { foreignKey: { allowNull: false, name: 'sellerId' }, onDelete: 'CASCADE' });
User.createdEnglishAuctions = User.hasMany(EnglishAuction, { foreignKey: { allowNull: false, name: 'sellerId' }, onDelete: 'CASCADE' });

SilentAuction.belongsTo(User, { foreignKey: { name: 'sellerId', allowNull: false }, as: 'seller' });
DescendingAuction.belongsTo(User, { foreignKey: { name: 'sellerId', allowNull: false }, as: 'seller' });
EnglishAuction.belongsTo(User, { foreignKey: { name: 'sellerId', allowNull: false }, as: 'seller' });



User.wonSilentAuctions = User.hasMany(SilentAuction, { foreignKey: { allowNull: true, name: 'buyerId' }, onDelete: 'CASCADE' });
User.wonDecendingAuctions = User.hasMany(DescendingAuction, { foreignKey: { allowNull: true, name: 'buyerId' }, onDelete: 'CASCADE' });
User.wonEnglishAuctions = User.hasMany(EnglishAuction, { foreignKey: { allowNull: true, name: 'buyerId' }, onDelete: 'CASCADE' });

SilentAuction.belongsTo(User, { foreignKey: { name: 'buyerId', allowNull: false }, as: 'buyer' });
DescendingAuction.belongsTo(User, { foreignKey: { name: 'buyerId', allowNull: false }, as: 'buyer' });
EnglishAuction.belongsTo(User, { foreignKey: { name: 'buyerId', allowNull: false }, as: 'buyer' });



SilentAuction.offers = SilentAuction.hasMany(SilentAuctionOffer, { foreignKey: { allowNull: false, name: 'auctionId' }, onDelete: 'CASCADE' })
DescendingAuction.offers = DescendingAuction.hasMany(DescendingAuctionOffer, { foreignKey: { allowNull: false, name: 'auctionId' }, onDelete: 'CASCADE' });
EnglishAuction.offers = EnglishAuction.hasMany(EnglishAuctionOffer, { foreignKey: { allowNull: false, name: 'auctionId' }, onDelete: 'CASCADE' });

SilentAuctionOffer.belongsTo(SilentAuction, { foreignKey: { name: 'auctionId', allowNull: false } });
DescendingAuctionOffer.belongsTo(DescendingAuction, { foreignKey: { name: 'auctionId', allowNull: false } });
EnglishAuctionOffer.belongsTo(EnglishAuction, { foreignKey: { name: 'auctionId', allowNull: false } });



User.SilentOffers = User.hasMany(SilentAuctionOffer, { foreignKey: { allowNull: false, name: 'userId' }, onDelete: 'CASCADE' });
User.DescendingOffers = User.hasMany(DescendingAuctionOffer, { foreignKey: { allowNull: false, name: 'userId' }, onDelete: 'CASCADE' });
User.usersOffers = User.hasMany(EnglishAuctionOffer, { foreignKey: { allowNull: false, name: 'userId' }, onDelete: 'CASCADE' });

SilentAuctionOffer.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });
DescendingAuctionOffer.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });
EnglishAuctionOffer.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });

// Definizione Triggers 

// Asta al ribasso , Offerta permessa soltanto se non ci sono altre offerte 
DescendingAuctionOffer.beforeCreate(async (offer, options) => {
  const descendingAuction = await DescendingAuction.findOne({ where: { id: offer.auctionId } })
  const auctionAlreadyPurchased = descendingAuction.buyerId !== null;
  const isOfferExpired = isDescendingAuctionExpired(descendingAuction);
  if (auctionAlreadyPurchased) throw new Error("Qualcuno ha già presentato un'offerta, l'asta è conclusa.");
  if (isOfferExpired) throw new Error("L'asta è conclusa.");
})

// Asta al ribasso , dopo che è stata presentata un'offerta questa viene automaticamente vinta 
DescendingAuctionOffer.afterCreate(async (offer, options) => {
  await DescendingAuction.update(
    { buyerId: offer.userId },
    { where: { id: offer.auctionId } }
  )
})

// Asta silenziosa , Offerte non permesse dopo la scadenza 
SilentAuctionOffer.beforeCreate(async (offer, options) => {
  const auction = await SilentAuction.findOne({ where: { id: offer.auctionId } });
  const isAuctionExpired = isSilentAuctionExpired(auction);

  if (isAuctionExpired) throw new Error("L'asta è scaduta, non puoi più presentare un'offerta")
})


// GESTIONE ASTA ALL'INGLESE 

// se l'utente è stato l'ultimo a fare un'offerta, non ne può presentare subito un'altra 
// questo hook controlla anche se l'asta non è scaduta 
EnglishAuctionOffer.beforeCreate(async (offer, options) => {
  // Trova l'asta associata all'offerta
  const auction = await EnglishAuction.findOne({ where: { id: offer.auctionId } });

  if (!auction) {
    throw new Error('Asta non trovata.');
  }

  // Verifica se l'asta è scaduta
  if (await isEnglishAuctionExpired(auction)) {
    throw new Error('L\'asta è già scaduta. Non è possibile fare altre offerte.');
  }

  // Trova l'ultima offerta per questa asta
  const lastOffer = await EnglishAuctionOffer.findOne({
    where: { auctionId: offer.auctionId },
    order: [['createdAt', 'DESC']]
  });

  // Se l'utente è l'ultimo offerente, impedisci una nuova offerta e richiedi di attendere
  if (lastOffer && lastOffer.userId === offer.userId) {
    throw new Error('Hai già fatto l\'ultima offerta. Attendi che qualcun altro faccia un\'offerta prima di presentare una nuova offerta.');
  }

  // Trova l'offerta precedente dello stesso utente per questa asta
  const userPreviousOffer = await EnglishAuctionOffer.findOne({
    where: {
      auctionId: offer.auctionId,
      userId: offer.userId
    }
  });

  if (userPreviousOffer) {
    // Aggiorna l'offerta esistente con la nuova somma offerta
    await userPreviousOffer.update({ amount: offer.amount });

    return false; // Restituisci false per interrompere il flusso di creazione
  }
});

export {
  User,
  AuctionCategory,
  SilentAuction,
  DescendingAuction,
  EnglishAuction,
  SilentAuctionOffer,
  DescendingAuctionOffer,
  EnglishAuctionOffer,
}; 