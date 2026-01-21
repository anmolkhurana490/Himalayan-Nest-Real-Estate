// User Repository - Database Operations Layer
// Handles all CRUD operations for User model

import { User } from '../config/db.js';

class UserRepository {
    /**
     * Create a new user
     * @param {Object} userData - User data
     * @returns {Promise<User>}
     */
    async create(userData) {
        return await User.create(userData);
    }

    /**
     * Find user by ID
     * @param {String} id - User ID
     * @param {Array} attributes - Optional: specific attributes to retrieve
     * @returns {Promise<User|null>}
     */
    async findById(id, attributes = null) {
        const options = { where: { id } };
        if (attributes) {
            options.attributes = attributes;
        }
        return await User.findOne(options);
    }

    /**
     * Find user by email
     * @param {String} email - User email
     * @returns {Promise<User|null>}
     */
    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    /**
     * Find user by criteria
     * @param {Object} criteria - Search criteria
     * @param {Array} attributes - Optional: specific attributes to retrieve
     * @returns {Promise<User|null>}
     */
    async findOne(criteria, attributes = null) {
        const options = { where: criteria };
        if (attributes) {
            options.attributes = attributes;
        }
        return await User.findOne(options);
    }

    /**
     * Get all users
     * @param {Object} criteria - Optional filter criteria
     * @returns {Promise<Array<User>>}
     */
    async findAll(criteria = {}) {
        return await User.findAll({ where: criteria });
    }

    /**
     * Update user by ID
     * @param {String} id - User ID
     * @param {Object} updates - Data to update
     * @returns {Promise<User|null>}
     */
    async update(id, updates) {
        const user = await this.findById(id);
        if (!user) return null;

        return await user.update(updates);
    }

    /**
     * Delete user by ID
     * @param {String} id - User ID
     * @returns {Promise<Boolean>}
     */
    async delete(id) {
        const user = await this.findById(id);
        if (!user) return false;

        await user.destroy();
        return true;
    }

    /**
     * Check if user exists by email
     * @param {String} email - User email
     * @returns {Promise<Boolean>}
     */
    async existsByEmail(email) {
        const count = await User.count({ where: { email } });
        return count > 0;
    }
}

export default new UserRepository();
