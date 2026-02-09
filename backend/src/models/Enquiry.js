import { DataTypes } from "sequelize";
import { ENQUIRY_STATUS } from '../constants/property.js';

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
        sender_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Users', key: 'id' },
        },
        receiver_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Users', key: 'id' },
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            values: Object.values(ENQUIRY_STATUS),
            defaultValue: 'pending', // Default status is pending
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Automatically set the creation date
        },
        closedAt: {
            type: DataTypes.DATE,
            allowNull: true, // Closed date can be null until the enquiry is resolved
        },
    });
}

export default EnquiryModel