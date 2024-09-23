import { DataTypes } from "sequelize"; 


const EnglishAuctionOfferModel = {
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
} 

export default EnglishAuctionOfferModel; 
