// Model Registration and Association Setup
// Initializes all Sequelize models and establishes relationships between them

import { Sequelize, DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

// Import all model definitions
import UserModel from "./User.js";
import PropertyModel from "./Property.js";

// Register all models and their associations
export const registerRelations = () => {
    const db = {};

    // Initialize models with sequelize instance
    db.User = UserModel(sequelize);
    db.Property = PropertyModel(sequelize);

    // Execute model associations (foreign keys, relationships)
    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db); // Call associate function if defined
        }
    });

    // Attach sequelize instances to db object for reference
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;
}