import { getSubscription } from '../controllers/SubscriptionController.js';
import { ForbiddenError, InternalServerError } from '../utils/errorUtils.js';
import logger from '../config/logger.js';

const SubscriptionMiddleware = async (req, res, next) => {
    try {
        const subscription = await getSubscription(req, res);
        if (!subscription) {
            return next(new ForbiddenError('No active subscription found'));
        }
        req.subscription = subscription;
        next();
    } catch (error) {
        logger.warn('Subscription middleware error:', error);
        next(new InternalServerError('Subscription check failed'));
    }
}

export default SubscriptionMiddleware;