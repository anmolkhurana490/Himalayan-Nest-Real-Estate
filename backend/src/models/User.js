import { DataTypes } from "sequelize";
import { USER_ROLES } from '../constants/user.js';

const UserModel = (sequelize) => {
    const User = sequelize.define("Users", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensure emails are unique
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true, // Phone is optional
        },
        role: {
            type: DataTypes.STRING,
            values: Object.values(USER_ROLES),
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true, // Bio is optional
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Automatically set the creation date
        },
    });

    return User;
}

export default UserModel;