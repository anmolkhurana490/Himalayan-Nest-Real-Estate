export const TOKEN_TYPES = {
  ACCESS: 'access',
  EMAIL_VERIFICATION: 'email_verification',
  PASSWORD_RESET: 'password_reset',
};

export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: '7d',
  EMAIL_VERIFICATION: '24h',
  PASSWORD_RESET: '1h',
};


export const SALT_ROUNDS = 10; // for Password Hashing

// For User Profile
export const selectFields = { id: true, name: true, email: true, phone: true, role: true, bio: true };

export const SIGNUP_TOKEN_EXPIRES_IN = '15m'; // 15 min

export const ACCESS_TOKEN_EXPIRES_IN = '7d'; // 7 days
export const ACCESS_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export const AUTH_REDIS_EXPIRY_SECONDS = 7 * 24 * 60 * 60; // 7 days in seconds

export const PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1;
export const EMAIL_VERIFICATION_TOKEN_EXPIRY_HOURS = 24;

export const LOGIN_LIMIT = {
  LIMIT: 5,
  WINDOW_SEC: 10 * 60 // 10min
}

export const FORGOT_PW_LIMIT = {
  LIMIT: 5,
  WINDOW_SEC: 10 * 60 // 10min
}