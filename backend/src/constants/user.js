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

// Association Attributes for Prisma Models
export const SELECT_USER_ASSOCIATIONS = { 'id': true, 'name': true, 'email': true, 'role': true, 'phone': true };

// Subscription Plan Constants
export const SUBSCRIPTION_PLANS = {
    BASIC: 'basic',
    PREMIUM: 'premium',
};