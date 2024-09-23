import { DataTypes } from 'sequelize';

const SilentAuctionModel = {
    id: {
        type: DataTypes.STRING, 
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