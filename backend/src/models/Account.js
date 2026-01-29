import { DataTypes } from "sequelize";
import { AUTH_PROVIDERS } from "../constants/user.js";

const AccountModel = (sequelize) => {
    const Account = sequelize.define("Accounts", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Users', key: 'id' },
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: false,
            values: Object.values(AUTH_PROVIDERS),
        },
        providerAccountId: {
            type: DataTypes.STRING,
            allowNull: true, // Can be null for credential-based accounts
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true, // Password can be null for OAuth users
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });

    return Account;
}

export default AccountModel;
