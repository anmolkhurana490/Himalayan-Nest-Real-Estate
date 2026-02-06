import { DataTypes } from "sequelize";
import { PROPERTY_CATEGORIES, PROPERTY_PURPOSES } from '../constants/property.js';
import { vi } from "zod/v4/locales";

const PropertyModel = (sequelize) => {
    const Property = sequelize.define("Properties", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Automatically generate a UUID
            primaryKey: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            values: Object.values(PROPERTY_CATEGORIES),
        },
        property_subtype: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
        purpose: {
            type: DataTypes.STRING,
            allowNull: false,
            values: Object.values(PROPERTY_PURPOSES),
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        images: {
            type: DataTypes.JSON, // Store array of image URLs/paths
            allowNull: true,
            defaultValue: [],
        },
        author_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'Users', key: 'id' },
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true, // Property is active by default
        },
        viewCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0, // Initialize view count to 0
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Automatically set the creation date
        },
    });

    return Property;
}

export default PropertyModel