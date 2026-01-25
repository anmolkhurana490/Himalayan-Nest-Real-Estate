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

export const ROLE_VALUES = Object.values(USER_ROLES);
export const AUTH_PROVIDER_VALUES = Object.values(AUTH_PROVIDERS);