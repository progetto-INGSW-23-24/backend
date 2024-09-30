import UserModel from './User/User.js';
import AuctionCategoryModel from './AuctionCategory/AuctionCategory.js';
import { SilentAuctionModel, DescendingAuctionModel, EnglishAuctionModel } from './Auction/index.js';
import { DescendingAuctionOfferModel, SilentAuctionOfferModel, EnglishAuctionOfferModel } from './AuctionOffer/index.js';
import connection from '../config/connection.js';


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

SilentAuction.belongsTo(User, { foreignKey: { name: 'sellerId', allowNull: false } });
DescendingAuction.belongsTo(User, { foreignKey: { name: 'sellerId', allowNull: false } });
EnglishAuction.belongsTo(User, { foreignKey: { name: 'sellerId', allowNull: false } });



User.wonSilentAuctions = User.hasMany(SilentAuction, { foreignKey: { allowNull: true, name: 'buyerId' }, onDelete: 'CASCADE' });
User.wonDecendingAuctions = User.hasMany(DescendingAuction, { foreignKey: { allowNull: true, name: 'buyerId' }, onDelete: 'CASCADE' });
User.wonEnglishAuctions = User.hasMany(EnglishAuction, { foreignKey: { allowNull: true, name: 'buyerId' }, onDelete: 'CASCADE' });

SilentAuction.belongsTo(User, { foreignKey: { name: 'buyerId', allowNull: false } });
DescendingAuction.belongsTo(User, { foreignKey: { name: 'buyerId', allowNull: false } });
EnglishAuction.belongsTo(User, { foreignKey: { name: 'buyerId', allowNull: false } });



SilentAuction.offers = SilentAuction.hasMany(SilentAuctionOffer, { foreignKey: { allowNull: false, name: 'offerId' }, onDelete: 'CASCADE' })
DescendingAuction.offers = DescendingAuction.hasMany(DescendingAuctionOffer, { foreignKey: { allowNull: false, name: 'offerId' }, onDelete: 'CASCADE' });
EnglishAuction.offers = EnglishAuction.hasMany(EnglishAuctionOffer, { foreignKey: { allowNull: false, name: 'offerId' }, onDelete: 'CASCADE' });

SilentAuctionOffer.belongsTo(SilentAuction, { foreignKey: { name: 'offerId', allowNull: false } });
DescendingAuctionOffer.belongsTo(DescendingAuction, { foreignKey: { name: 'offerId', allowNull: false } });
EnglishAuctionOffer.belongsTo(EnglishAuction, { foreignKey: { name: 'offerId', allowNull: false } });



User.SilentOffers = User.hasMany(SilentAuctionOffer, { foreignKey: { allowNull: false, name: 'userId' }, onDelete: 'CASCADE' });
User.DescendingOffers = User.hasMany(DescendingAuctionOffer, { foreignKey: { allowNull: false, name: 'userId' }, onDelete: 'CASCADE' });
User.usersOffers = User.hasMany(EnglishAuctionOffer, { foreignKey: { allowNull: false, name: 'userId' }, onDelete: 'CASCADE' });

SilentAuctionOffer.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });
DescendingAuctionOffer.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });
EnglishAuctionOffer.belongsTo(User, { foreignKey: { name: 'userId', allowNull: false } });

// Definizione Triggers 

// 1. Asta al ribasso , Offerta permessa soltanto se non ci sono altre offerte 
DescendingAuctionOffer.beforeCreate(async (offer, options) => {
  const existingOffer = await DescendingAuctionOffer.findOne({
    where: {
      auctionId: offer.auctionId
    }
  })
  if (existingOffer) throw new Error("Qualcuno ha già presentato un'offerta, l'asta è conclusa.");
})

// 2. Asta al ribasso , dopo che è stata presentata un'offerta questa viene automaticamente vinta 
DescendingAuctionOffer.afterCreate(async (offer, options) => {
  await DescendingAuction.update(
    { buyedId: offer.userId },
    { where: { id: offer.auctionId } }
  )
})

// 3. Asta all'inglese , se un'utente ha già creato un offerta viene aggiornata, altrimenti viene creata
EnglishAuctionOffer.beforeCreate(async (newOffer, options) => {
  const existingOffer = await EnglishAuctionOffer.findOne({
    where: {
      auctionId: newOffer.auctionId,
      userId: newOffer.userId
    }
  })

  if (existingOffer) {
    await existingOffer.update({ amount: newOffer.amount });
    throw new Error("Offerta aggiornata")
  }
})

// 4. Asta silenziosa , Offerte non permesse dopo la scadenza 
SilentAuctionOffer.beforeCreate(async (offer, options) => {
  const auction = await SilentAuction.findOne({
    where: { id: offer.auctionId }
  });

  if (auction.endDate && new Date() > auction.endDate) throw new Error("L'asta è scaduta, non puoi più presentare un'offerta")
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
  if (new Date() > auction.endDate) {
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
    await userPreviousOffer.update({
      amount: offer.amount
    });

    // Impedisce la creazione di una nuova offerta (l'aggiornamento è già avvenuto)
    throw new Error('La tua offerta è stata aggiornata con successo.');
  }
});

// aggiornamento timer dopo la creazione o l'aggiornamento del timer 
EnglishAuctionOffer.afterUpsert(async (result, options) => {
  const offer = result[0];  // Ottieni l'offerta dopo l'upsert

  const auction = await EnglishAuction.findOne({ where: { id: offer.auctionId } });

  if (auction) {
    // Aggiorna il prezzo corrente dell'asta e resetta il timer
    const newEndTime = new Date(new Date().getTime() + auction.bidDuration * 1000);
    await auction.update({
      currentPrice: offer.amount,
      endDate: newEndTime
    });

    console.log(`Timer dell'asta (ID: ${auction.id}) resettato a ${newEndTime}`);
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