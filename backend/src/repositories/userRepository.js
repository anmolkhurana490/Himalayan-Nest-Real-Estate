// User Repository - Database Operations Layer
// Handles all CRUD operations for User model

import prisma from '../config/prismaClient.js';

class UserRepository {
    /**
     * Create a new user
     * @param {Object} userData - User data
     * @param {Array} select - Optional: specific attributes to retrieve after creation
     * @returns {Promise<User>}
     */
    async create(userData, select = null) {
        return await prisma.user.create({
            data: userData,
            ...(select && { select })
        });
    }

    /**
     * Find user by ID
     * @param {String} id - User ID
     * @param {Array} select - Optional: specific attributes to retrieve
     * @returns {Promise<User|null>}
     */
    async findById(id, select = null) {
        return await prisma.user.findUnique({
            where: { id },
            ...(select && { select })
        });
    }

    /**
     * Find user by email
     * @param {String} email - User email
     * @param {Array} select - Optional: specific attributes to retrieve
     * @returns {Promise<User|null>}
     */
    async findByEmail(email, select = null) {
        return await prisma.user.findUnique({
            where: { email },
            ...(select && { select })
        });
    }

    /**
     * Find user by criteria
     * @param {Object} criteria - Search criteria
     * @param {Array} select - Optional: specific attributes to retrieve
     * @returns {Promise<User|null>}
     */
    async findOne(criteria, select = null) {
        return await prisma.user.findFirst({
            where: criteria,
            ...(select && { select })
        });
    }

    /**
     * Get all users
     * @param {Object} criteria - Optional filter criteria
     * @returns {Promise<Array<User>>}
     */
    async findAll(criteria = {}, select = null) {
        return await prisma.user.findMany({
            where: criteria,
            ...(select && { select })
        });
    }

    /**
     * Update user by ID
     * @param {String} id - User ID
     * @param {Object} updates - Data to update
     * @param {Array} select - Optional: specific attributes to retrieve after update
     * @returns {Promise<User|null>}
     */
    async update(id, updates, select = null) {
        const user = await this.findById(id);
        if (!user) return null;

        return await prisma.user.update({
            where: { id },
            data: updates,
            ...(select && { select })
        });
    }

    /**
     * Delete user by ID
     * @param {String} id - User ID
     * @returns {Promise<Boolean>}
     */
    async delete(id) {
        const user = await this.findById(id);
        if (!user) return false;

        await prisma.user.delete({
            where: { id }
        });
        return true;
    }

    /**
     * Check if user exists by email
     * @param {String} email - User email
     * @returns {Promise<Boolean>}
     */
    async existsByEmail(email) {
        const count = await prisma.user.count({
            where: { email }
        });
        return count > 0;
    }
}

export default new UserRepository();
