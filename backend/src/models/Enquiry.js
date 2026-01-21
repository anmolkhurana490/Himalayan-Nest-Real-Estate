import { DataTypes } from "sequelize";
import { ENQUIRY_STATUS_VALUES } from '../constants/property.js';

const EnquiryModel = (sequelize) => {
    return sequelize.define("Enquiries", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
            primaryKey: true,
            allowNull: false,
        },
        property_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Properties', key: 'id' },
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Users', key: 'id' },
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            values: ENQUIRY_STATUS_VALUES,
            defaultValue: 'pending', // Default status is pending
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Automatically set the creation date
        },
    });
}

export default EnquiryModel