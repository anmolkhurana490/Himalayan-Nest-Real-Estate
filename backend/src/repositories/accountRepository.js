// Account Repository - Database Operations Layer
// Handles all CRUD operations for Account model

import { Account } from '../config/db.js';

class AccountRepository {
    /**
     * Create a new account
     * @param {Object} accountData - Account data
     * @returns {Promise<Account>}
     */
    async create(accountData) {
        return await Account.create(accountData);
    }

    /**
     * Find account by user ID and provider
     * @param {String} userId - User ID
     * @param {String} provider - Provider name
     * @returns {Promise<Account|null>}
     */
    async findByUserAndProvider(userId, provider) {
        return await Account.findOne({
            where: { userId, provider }
        });
    }

    /**
     * Find account by provider and provider account ID
     * @param {String} provider - Provider name
     * @param {String} providerAccountId - Provider account ID
     * @returns {Promise<Account|null>}
     */
    async findByProviderAccount(provider, providerAccountId) {
        return await Account.findOne({
            where: { provider, providerAccountId }
        });
    }

    /**
     * Find all accounts for a user
     * @param {String} userId - User ID
     * @returns {Promise<Array<Account>>}
     */
    async findByUserId(userId) {
        return await Account.findAll({ where: { userId } });
    }

    /**
     * Delete account by ID
     * @param {String} id - Account ID
     * @returns {Promise<Boolean>}
     */
    async delete(id) {
        const account = await Account.findByPk(id);
        if (!account) return false;

        await account.destroy();
        return true;
    }
}

export default new AccountRepository();
