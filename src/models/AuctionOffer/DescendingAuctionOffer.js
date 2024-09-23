import { DataTypes } from "sequelize"; 


const DescendingAuctionOfferModel = {
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
} 

export default DescendingAuctionOfferModel; 
