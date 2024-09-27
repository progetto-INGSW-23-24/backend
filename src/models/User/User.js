import { DataTypes } from "sequelize"; 

const UserModel = {
        id: {
            type: DataTypes.UUID, 
            primaryKey: true  
        }, 
        firstName: {
            type: DataTypes.TEXT,
            allowNull: false 
        }, 
        lastName: {
            type: DataTypes.TEXT,
            allowNull: false 
        },
        email: {
            type: DataTypes.TEXT, 
            allowNull: false
        }, 
        bio: {
            type: DataTypes.TEXT, 
            defaultValue: "", 
            allowNull: false 
        },
        webSiteLink: {
            type: DataTypes.TEXT, 
            defaultValue: "", 
            allowNull: false
        }, 
        profileImagePath: {
            type: DataTypes.TEXT, 
            defaultValue: "", 
            allowNull: false 
        },
        fcm: {
            type: DataTypes.TEXT, 
            allowNull: true 
        }, 
        socialLink: {
            type: DataTypes.ARRAY(DataTypes.STRING), 
            defaultValue: [],
            allowNull: false
        }
}

export default UserModel; 