import { DataTypes } from "sequelize";

const EnquiryMessageModel = (sequelize) => {
    return sequelize.define("EnquiryMessages", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        enquiry_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Enquiries', key: 'id' },
        },
        sender_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Users', key: 'id' },
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    });
}

export default EnquiryMessageModel
