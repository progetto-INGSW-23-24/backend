import { DataTypes } from "sequelize";

const AuctionCategoryModel = {
    categoryId: {
        type: DataTypes.SMALLINT,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}

export default AuctionCategoryModel; 