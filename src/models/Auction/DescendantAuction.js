import { DataTypes } from "sequelize";

const DescendingAuctionModel = {
    id: {
        type: DataTypes.UUID, 
        defaultValue: DataTypes.UUIDV4, 
        primaryKey: true 
    }, 
    description: {
        type: DataTypes.TEXT, 
        allowNull: false, 
    }, 
    imagePath: {
        type: DataTypes.TEXT, 
        defaultValue: "", 
        allowNull: false 
    }, 
    startingPrice: {
        type: DataTypes.DOUBLE, 
        allowNull: false 
    }, 
    minimumPrice: {
        type: DataTypes.DOUBLE, 
        allowNull: false 
    }, 
    decreaseAmount: {
        type: DataTypes.DOUBLE, 
        allowNull: false 
    }, 
    decreaseTime: {
        type: DataTypes.SMALLINT, 
        defaultValue: 60, 
        allowNull: false 
    }
}

export default DescendingAuctionModel; 