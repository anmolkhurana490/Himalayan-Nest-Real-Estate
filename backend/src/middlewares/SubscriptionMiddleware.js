import { getSubscription } from '../controllers/SubscriptionController.js';

const SubscriptionMiddleware = async (req, res, next) => {
    try {
        const subscription = await getSubscription(req, res);
        if (!subscription) {
            return res.status(403).json({ error: 'No active subscription found' });
        }
        req.subscription = subscription;
        next();
    } catch (error) {
        console.error('Subscription middleware error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export default SubscriptionMiddleware;