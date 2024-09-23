import { DataTypes } from "sequelize";

const AuctionCategoryModel = {
  categoryId: {
    type: DataTypes.INTEGER, 
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  auctionId: DataTypes.STRING,
  auctionType: DataTypes.STRING 
}

export default AuctionCategoryModel; 