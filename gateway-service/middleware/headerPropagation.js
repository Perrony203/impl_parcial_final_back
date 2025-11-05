'use strict';

/**
 * Header Propagation Middleware
 *
 * This middleware ensures that user authentication headers are properly
 * propagated to downstream microservices.
 *
 * IMPORTANT: This middleware must be executed AFTER authenticateJWT
 * because it relies on req.user being populated.
 *
 * Headers propagated:
 * - x-user-id: User's unique identifier
 * - x-user-role: User's role (admin, user, etc.)
 * - x-user-name: User's display name
 * - x-user-email: User's email address
 */

const propagateHeaders = (req, res, next) => {
    // If user is authenticated, ensure headers are set
    if (req.user) {
        // These headers should already be set by authenticateJWT,
        // but we ensure they're present for downstream services
        req.headers['x-user-id'] = req.headers['x-user-id'] || req.user.id.toString();
        req.headers['x-user-role'] = req.headers['x-user-role'] || req.user.role;
        req.headers['x-user-name'] = req.headers['x-user-name'] || req.user.name;
        req.headers['x-user-email'] = req.headers['x-user-email'] || req.user.email;

        // Optional: Log for debugging (remove in production)
        if (process.env.NODE_ENV === 'development') {
            console.log('[Header Propagation] User headers:', {
                userId: req.headers['x-user-id'],
                role: req.headers['x-user-role'],
                name: req.headers['x-user-name'],
                email: req.headers['x-user-email']
            });
        }
    }

    next();
};

module.exports = { propagateHeaders };
