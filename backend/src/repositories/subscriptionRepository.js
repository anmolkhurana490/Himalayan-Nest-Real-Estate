// Subscription Repository - Database Operations Layer
// Handles all CRUD operations for Subscription model

import { Subscription } from '../config/db.js';

class SubscriptionRepository {
    /**
     * Create a new subscription
     * @param {Object} subscriptionData - Subscription data
     * @returns {Promise<Subscription>}
     */
    async create(subscriptionData) {
        return await Subscription.create(subscriptionData);
    }

    /**
     * Find subscription by ID
     * @param {String} id - Subscription ID
     * @returns {Promise<Subscription|null>}
     */
    async findById(id) {
        return await Subscription.findByPk(id);
    }

    /**
     * Find subscription by dealer ID
     * @param {String} dealerId - Dealer user ID
     * @returns {Promise<Subscription|null>}
     */
    async findByDealerId(dealerId) {
        return await Subscription.findOne({
            where: { dealerId }
        });
    }

    /**
     * Get all subscriptions
     * @param {Object} filters - Optional filter criteria
     * @returns {Promise<Array<Subscription>>}
     */
    async findAll(filters = {}) {
        return await Subscription.findAll({
            where: filters,
            order: [['createdAt', 'DESC']]
        });
    }

    /**
     * Update subscription by ID
     * @param {String} id - Subscription ID
     * @param {Object} updates - Data to update
     * @returns {Promise<Subscription|null>}
     */
    async update(id, updates) {
        const subscription = await this.findById(id);
        if (!subscription) return null;

        return await subscription.update(updates);
    }

    /**
     * Update subscription by dealer ID
     * @param {String} dealerId - Dealer user ID
     * @param {Object} updates - Data to update
     * @returns {Promise<Subscription|null>}
     */
    async updateByDealerId(dealerId, updates) {
        const subscription = await this.findByDealerId(dealerId);
        if (!subscription) return null;

        return await subscription.update(updates);
    }

    /**
     * Delete subscription by ID
     * @param {String} id - Subscription ID
     * @returns {Promise<Boolean>}
     */
    async delete(id) {
        const subscription = await this.findById(id);
        if (!subscription) return false;

        await subscription.destroy();
        return true;
    }

    /**
     * Check if dealer has active subscription
     * @param {String} dealerId - Dealer user ID
     * @returns {Promise<Boolean>}
     */
    async hasActiveSubscription(dealerId) {
        const subscription = await this.findByDealerId(dealerId);
        if (!subscription) return false;

        return new Date(subscription.endDate) > new Date();
    }
}

export default new SubscriptionRepository();
