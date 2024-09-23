import UserModel from './User/User.js'; 
import AuctionCategoryModel from './AuctionCategory/AuctionCategory.js';
import CategoryModel from './Category/Category.js'; 
import { SilentAuctionModel, DescendingAuctionModel, EnglishAuctionModel } from './Auction/index.js'; 
import { DescendingAuctionOfferModel, SilentAuctionOfferModel, EnglishAuctionOfferModel } from './AuctionOffer/index.js'; 
import connection from '../config/connection.js';


// Definizione Modelli 
const User = connection.define('User', UserModel, {updatedAt: false}); 


const SilentAuction = connection.define('SilentAuction', SilentAuctionModel, {updatedAt: false}); 
const EnglishAuction = connection.define('EnglishAuction', EnglishAuctionModel, {updatedAt: false}); 
const DescendingAuction = connection.define('DescendingAuction', DescendingAuctionModel, {updatedAt: false}); 

const SilentAuctionOffer = connection.define('SilentAuctionOffer', SilentAuctionOfferModel, {updatedAt: false});  
const EnglishAuctionOffer = connection.define('EnglishAuctionOffer', EnglishAuctionOfferModel, {updatedAt: false}); 
const DescendingAuctionOffer = connection.define('DescendingAuctionOffer', DescendingAuctionOfferModel, {updatedAt: false}); 

const Category = connection.define('Category', CategoryModel, {timestamps: false});
const AuctionCategory = connection.define('AuctionCategory', AuctionCategoryModel, {timestamps: false}); 


// Definizione Associazioni 
User.createdSilentAuctions = User.hasMany(SilentAuction, {foreignKey: {allowNull: false, name: 'sellerId'}, onDelete: 'CASCADE'});
User.createdDescendingAuctions = User.hasMany(DescendingAuction, {foreignKey: {allowNull: false, name: 'sellerId'}, onDelete: 'CASCADE'}); 
User.createdEnglishAuctions = User.hasMany(EnglishAuction, {foreignKey: {allowNull: false, name: 'sellerId'}, onDelete: 'CASCADE'}); 


User.wonSilentAuctions = User.hasMany(SilentAuction, {foreignKey: {allowNull: true, name: 'buyerId'}, onDelete: 'CASCADE'}); 
User.wonDecendingAuctions = User.hasMany(DescendingAuction, {foreignKey: {allowNull: true, name: 'buyerId'}, onDelete: 'CASCADE'}); 
User.wonEnglishAuctions = User.hasMany(EnglishAuction, {foreignKey: {allowNull: true, name: 'buyerId'}, onDelete: 'CASCADE'}); 


SilentAuction.offers = SilentAuction.hasMany(SilentAuctionOffer, {foreignKey: {allowNull: false, name: 'offerId'}, onDelete: 'CASCADE'})
DescendingAuction.offers = DescendingAuction.hasMany(DescendingAuctionOffer, {foreignKey: {allowNull: false, name: 'offerId'}, onDelete: 'CASCADE'}); 
EnglishAuction.offers = EnglishAuction.hasMany(EnglishAuctionOffer, {foreignKey: {allowNull: false}, onDelete: 'CASCADE'}); 

SilentAuctionOffer.usersOffers = SilentAuctionOffer.hasMany(User, {foreignKey: {allowNull: false, name: 'userId'}, onDelete: 'CASCADE'}); 
DescendingAuctionOffer.usersOffers = DescendingAuctionOffer.hasMany(User, {foreignKey: {allowNull: false, name: 'userId'}, onDelete: 'CASCADE'}); 
EnglishAuctionOffer.usersOffers = EnglishAuctionOffer.hasMany(User, {foreignKey: {allowNull: false, name: 'userId'}, onDelete: 'CASCADE'}); 


// Associazioni Aste - Categorie con associazioni polimorfica
// English Auction associazione polimorfica
EnglishAuction.belongsToMany(Category, {
    through: {
      model: AuctionCategory,
      unique: false,
      scope: {
        auctionType: 'english_auction'
      }
    },
    foreignKey: 'auctionId',
    constraints: false
  });
  Category.belongsToMany(EnglishAuction, {
    through: {
      model: AuctionCategory,
      unique: false,
      scope: {
        auctionType: 'english_auction'
      }
    },
    foreignKey: 'categoryId',
    constraints: false
  });
  
  // Reverse Auction associazione polimorfica
  DescendingAuction.belongsToMany(Category, {
    through: {
      model: AuctionCategory,
      unique: false,
      scope: {
        auctionType: 'descending_auction'
      }
    },
    foreignKey: 'auctionId',
    constraints: false
  });
  Category.belongsToMany(DescendingAuction, {
    through: {
      model: AuctionCategory,
      unique: false,
      scope: {
        auctionType: 'descending_auction'
      }
    },
    foreignKey: 'categoryId',
    constraints: false
  });
  
  // Silent Auction associazione polimorfica
  SilentAuction.belongsToMany(Category, {
    through: {
      model: AuctionCategory,
      unique: false,
      scope: {
        auctionType: 'silent_auction'
      }
    },
    foreignKey: 'auctionId',
    constraints: false
  });
  Category.belongsToMany(SilentAuction, {
    through: {
      model: AuctionCategory,
      unique: false,
      scope: {
        auctionType: 'silent_auction'
      }
    },
    foreignKey: 'categoryId',
    constraints: false
  });
  

export { 
    User, 
    Category, 
    AuctionCategory,  
    SilentAuction, 
    DescendingAuction, 
    EnglishAuction,
    SilentAuctionOffer, 
    DescendingAuctionOffer, 
    EnglishAuctionOffer,  
}; 