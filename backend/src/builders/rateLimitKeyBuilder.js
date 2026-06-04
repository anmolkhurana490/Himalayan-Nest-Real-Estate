// Generates keys with specific templates for Rate Limiting
// Rate-limit key builders used by the rate limiter middleware.
// Each function receives an Express `req` and returns a stable string key.

// Generate key with IP
export const buildKeyByIP = (req) => `ip:${req.ip}`;

// Generate key with UserId
export const buildKeyByUserId = (req) => `user:${req.user.id}`;

// Generate key with Ip + Email
export const buildKeyByIpAndEmail = (req) => `ip:${req.ip}|email:${req.body.email}`;