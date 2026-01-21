import { DataTypes } from "sequelize";
import { SUBSCRIPTION_PLAN_VALUES } from '../constants/property.js';

const SubscriptionModel = (sequelize) => {
    return sequelize.define("Subscriptions", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
            primaryKey: true,
            allowNull: false,
        },
        dealerId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Users', key: 'id' },
        },
        planType: {
            type: DataTypes.STRING,
            allowNull: false,
            values: SUBSCRIPTION_PLAN_VALUES,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true, // Subscription is active by default
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Automatically set the creation date
        },
    });
}

export default SubscriptionModel;