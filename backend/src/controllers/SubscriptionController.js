import { Subscription } from '../config/db.js';

export const subscribe = async (dealer, planType, period) => {
    try {
        const subscriptionData = {
            dealerId: dealer.id,
            planType: planType,
            endDate: new Date(Date.now() + period),
        };

        const newSubscription = await Subscription.create();
        return res.status(201).json(newSubscription);
    } catch (error) {
        throw new Error('Error creating subscription: ' + error.message);
    }
}

export const getSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ where: { dealerId: req.user.id } });
        return res.status(200).json({ subscription });
    } catch (error) {
        console.error('Error checking subscription:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}