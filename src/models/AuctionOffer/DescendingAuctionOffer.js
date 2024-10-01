import { DataTypes } from "sequelize"; 


const DescendingAuctionOfferModel = {
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
} 

export default DescendingAuctionOfferModel; 
