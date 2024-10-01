import { DataTypes } from "sequelize";


const SilentAuctionOfferModel = {
    amount: {
        type: DataTypes.DOUBLE,
        allowNull: false
    }
}

export default SilentAuctionOfferModel; 
