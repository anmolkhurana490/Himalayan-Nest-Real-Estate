// Subscription Controller - Request Handler Layer
// Handles HTTP requests and responses for subscription endpoints

import subscriptionService from './subscriptionService.js';
import { HTTP_STATUS } from '../../../constants/httpStatus.js';

class SubscriptionController {
    /**
     * Create a new subscription
     * @route POST /api/v1/subscriptions
     */
    async subscribe(req, res, next) {
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
            next(error);
        }
    }

    /**
     * Get current user's subscription
     * @route GET /api/v1/subscriptions/my-subscription
     */
    async getSubscription(req, res, next) {
        try {
            const subscription = await subscriptionService.getSubscription(req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Subscription fetched successfully',
                subscription
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all subscriptions (admin only)
     * @route GET /api/v1/subscriptions
     */
    async getAllSubscriptions(req, res, next) {
        try {
            const subscriptions = await subscriptionService.getAllSubscriptions(req.query);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                data: subscriptions
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update subscription
     * @route PUT /api/v1/subscriptions
     */
    async updateSubscription(req, res, next) {
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
            next(error);
        }
    }

    /**
     * Cancel subscription
     * @route DELETE /api/v1/subscriptions
     */
    async cancelSubscription(req, res, next) {
        try {
            await subscriptionService.cancelSubscription(req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                message: 'Subscription cancelled successfully'
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Check subscription status
     * @route GET /api/v1/subscriptions/status
     */
    async checkSubscriptionStatus(req, res, next) {
        try {
            const isActive = await subscriptionService.hasActiveSubscription(req.user.id);

            res.status(HTTP_STATUS.OK).json({
                success: true,
                isActive
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new SubscriptionController();
