import { DataTypes } from 'sequelize';

const SilentAuctionModel = {
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
    expirationDateTime: {
        type: DataTypes.DATE, 
        allowNull: false 
    }
}

export default SilentAuctionModel; 