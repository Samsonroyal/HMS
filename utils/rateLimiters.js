const rateLimit = require('express-rate-limit');

// Strict limiter for authentication endpoints (login / register).
// Prevents credential stuffing, brute-force and account-creation abuse.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20,                // max 20 requests per window per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many attempts. Please try again in 15 minutes.' }
});

// General limiter for public / sensitive endpoints that can be abused
// to scrape data or spam mutations without a valid token.
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests. Please try again later.' }
});

module.exports = { authLimiter, apiLimiter };
