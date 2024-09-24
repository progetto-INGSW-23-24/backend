import { DataTypes } from "sequelize";

const AuctionCategoryModel = {
  categoryId: {
    type: DataTypes.SMALLINT,
    references: {
      model: 'Categories',
      key: 'categoryId'
    },
    allowNull: false 
  },
  auctionId: {
    type: DataTypes.UUID, 
    allowNull: false 
  },
  auctionType: {
    type: DataTypes.ENUM('English', 'Descendant', 'Silent'),
    allowNull: false 
  },
}

export default AuctionCategoryModel; 