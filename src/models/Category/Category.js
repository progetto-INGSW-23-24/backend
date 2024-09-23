import { DataTypes } from "sequelize";

const CategoryModel = {
    name: {
        type: DataTypes.TEXT, 
        allowNull: false 
    }
}

export default CategoryModel; 