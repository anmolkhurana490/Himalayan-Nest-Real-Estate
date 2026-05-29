// Subscription Repository - Prisma Implementation
import prisma from '../config/prismaClient.js';

class SubscriptionRepository {
    /**
     * Create a new subscription
     * @param {Object} subscriptionData - Subscription data
     * @returns {Promise<Subscription>}
     */
    async create(subscriptionData) {
        return await prisma.subscription.create({ data: subscriptionData });
    }

    /**
     * Find subscription by ID
     * @param {String} id - Subscription ID
     * @returns {Promise<Subscription|null>}
     */
    async findById(id) {
        return await prisma.subscription.findUnique({ where: { id } });
    }

    /**
     * Find subscription by dealer ID
     * @param {String} dealerId - Dealer user ID
     * @returns {Promise<Subscription|null>}
     */
    async findByDealerId(dealerId) {
        return await prisma.subscription.findFirst({ where: { dealerId } });
    }

    /**
     * Get all subscriptions
     * @param {Object} filters - Optional filter criteria
     * @returns {Promise<Array<Subscription>>}
     */
    async findAll(filters = {}) {
        return await prisma.subscription.findMany({
            where: filters,
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Update subscription by ID
     * @param {String} id - Subscription ID
     * @param {Object} updates - Data to update
     * @returns {Promise<Subscription|null>}
     */
    async update(id, updates) {
        const existing = await this.findById(id);
        if (!existing) return null;
        return await prisma.subscription.update({ where: { id }, data: updates });
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
        return await prisma.subscription.update({ where: { id: subscription.id }, data: updates });
    }

    /**
     * Delete subscription by ID
     * @param {String} id - Subscription ID
     * @returns {Promise<Boolean>}
     */
    async delete(id) {
        const existing = await this.findById(id);
        if (!existing) return false;
        await prisma.subscription.delete({ where: { id } });
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
