// User Role Constants
// Defines all available user roles in the system

export const USER_ROLES = {
    CUSTOMER: 'customer',
    DEALER: 'dealer',
    ADMIN: 'admin',
};

export const AUTH_PROVIDERS = {
    CREDENTIALS: 'credentials',
    GOOGLE: 'google',
    FACEBOOK: 'facebook',
};

// Association Attributes for Sequelize Models
export const USER_ASSOCIATIONS_ATTRIBUTES = ['id', 'name', 'email', 'role', 'phone'];

// Subscription Plan Constants
export const SUBSCRIPTION_PLANS = {
    BASIC: 'basic',
    PREMIUM: 'premium',
};