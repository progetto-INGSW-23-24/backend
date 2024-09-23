import { DataTypes } from "sequelize";

const EnglishAuctionModel = {
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
    increaseThresold: {
        type: DataTypes.DOUBLE, 
        defaultValue: 10, 
    }, 
    timer: {
        type: DataTypes.SMALLINT, 
        defaultValue: 60, 
        allowNull: false 
    }
}

export default EnglishAuctionModel; 