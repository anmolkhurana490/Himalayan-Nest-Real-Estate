// Subscription Controller - Request Handler Layer
// Handles HTTP requests and responses for subscription endpoints

import subscriptionService from './subscriptionService.js';
import { HTTP_STATUS } from '../../../constants/httpStatus.js';

class SubscriptionController {
    /**
     * Create a new subscription
     * @route POST /api/v1/subscriptions
     */
    async subscribe(req, res) {
        const { planType, period } = req.body;

        try {
            const subscription = await subscriptionService.subscribe(
                req.user.id,
                planType,
                period
            );

            res.status(HTTP_STATUS.CREATED).json({
                success: true,
                message: 'Subscription created successfully',
                data: subscription
            });
        } catch (error) {
            console.error('Error creating subscription:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error creating subscription',
                error: error.message
            });
        }
    }

    /**
     * Get current user's subscription
     * @route GET /api/v1/subscriptions/my-subscription
     */
    async getSubscription(req, res) {
        try {
            const subscription = await subscriptionService.getSubscription(req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Subscription fetched successfully',
                subscription
            });
        } catch (error) {
            console.error('Error fetching subscription:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'Error fetching subscription',
                error: error.message
            });
        }
    }

    /**
     * Get all subscriptions (admin only)
     * @route GET /api/v1/subscriptions
     */
    async getAllSubscriptions(req, res) {
        try {
            const subscriptions = await subscriptionService.getAllSubscriptions(req.query);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: subscriptions
            });
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Update subscription
     * @route PUT /api/v1/subscriptions
     */
    async updateSubscription(req, res) {
        try {
            const subscription = await subscriptionService.updateSubscription(
                req.user.id,
                req.body
            );

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Subscription updated successfully',
                data: subscription
            });
        } catch (error) {
            console.error('Error updating subscription:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Cancel subscription
     * @route DELETE /api/v1/subscriptions
     */
    async cancelSubscription(req, res) {
        try {
            await subscriptionService.cancelSubscription(req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Subscription cancelled successfully'
            });
        } catch (error) {
            console.error('Error cancelling subscription:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Check subscription status
     * @route GET /api/v1/subscriptions/status
     */
    async checkSubscriptionStatus(req, res) {
        try {
            const isActive = await subscriptionService.hasActiveSubscription(req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                isActive
            });
        } catch (error) {
            console.error('Error checking subscription status:', error);
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new SubscriptionController();
