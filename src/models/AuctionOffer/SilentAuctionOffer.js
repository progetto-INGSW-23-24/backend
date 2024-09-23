import { DataTypes } from "sequelize"; 


const SilentAuctionOfferModel = {
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
} 

export default SilentAuctionOfferModel; 
