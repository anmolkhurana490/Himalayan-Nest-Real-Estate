// Subscription Service - Business Logic Layer
// Handles subscription management business logic

import subscriptionRepository from '../../../repositories/subscriptionRepository.js';
import { SUBSCRIPTION_MESSAGES } from '../../../constants/messages.js';

class SubscriptionService {
    /**
     * Create a new subscription
     * @param {String} dealerId - Dealer user ID
     * @param {String} planType - Subscription plan type
     * @param {Number} period - Subscription period in milliseconds
     * @returns {Promise<Object>} - Created subscription
     */
    async subscribe(dealerId, planType, period) {
        const subscriptionData = {
            dealerId,
            planType,
            endDate: new Date(Date.now() + period),
            isActive: true
        };

        const newSubscription = await subscriptionRepository.create(subscriptionData);
        return newSubscription;
    }

    /**
     * Get subscription by dealer ID
     * @param {String} dealerId - Dealer user ID
     * @returns {Promise<Object>} - Subscription details
     */
    async getSubscription(dealerId) {
        const subscription = await subscriptionRepository.findByDealerId(dealerId);
        return subscription;
    }

    /**
     * Get all subscriptions
     * @param {Object} filters - Optional filter criteria
     * @returns {Promise<Array>} - List of subscriptions
     */
    async getAllSubscriptions(filters = {}) {
        const subscriptions = await subscriptionRepository.findAll(filters);
        return subscriptions;
    }

    /**
     * Update subscription
     * @param {String} dealerId - Dealer user ID
     * @param {Object} updates - Update data
     * @returns {Promise<Object>} - Updated subscription
     */
    async updateSubscription(dealerId, updates) {
        const subscription = await subscriptionRepository.updateByDealerId(dealerId, updates);

        if (!subscription) {
            throw new Error('Subscription not found');
        }

        return subscription;
    }

    /**
     * Cancel subscription
     * @param {String} dealerId - Dealer user ID
     * @returns {Promise<Boolean>}
     */
    async cancelSubscription(dealerId) {
        const subscription = await subscriptionRepository.findByDealerId(dealerId);

        if (!subscription) {
            throw new Error('Subscription not found');
        }

        await subscriptionRepository.updateByDealerId(dealerId, { isActive: false });
        return true;
    }

    /**
     * Check if dealer has active subscription
     * @param {String} dealerId - Dealer user ID
     * @returns {Promise<Boolean>}
     */
    async hasActiveSubscription(dealerId) {
        return await subscriptionRepository.hasActiveSubscription(dealerId);
    }
}

export default new SubscriptionService();
