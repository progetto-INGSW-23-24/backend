import { DataTypes } from "sequelize";

const CategoryModel = {
    categoryId: {
        type:DataTypes.SMALLINT,
        autoIncrement: true, 
        primaryKey: true 
    }, 
    name: {
        type: DataTypes.TEXT, 
        allowNull: false 
    }
}

export default CategoryModel; 