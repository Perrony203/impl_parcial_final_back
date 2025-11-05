'use strict';
const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware for API Gateway
 *
 * This middleware validates JWT tokens and propagates user information
 * to downstream microservices via HTTP headers.
 *
 * IMPORTANT: The Gateway does NOT have database access.
 * It only validates the token signature and extracts the payload.
 */

// Helper to wrap async handlers and forward errors
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const authenticateJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verify token signature and extract payload
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request object for local use
        req.user = {
            id: payload.id,
            role: payload.role,
            name: payload.name,
            email: payload.email
        };

        // Propagate user information to downstream microservices via headers
        req.headers['x-user-id'] = payload.id.toString();
        req.headers['x-user-role'] = payload.role;
        req.headers['x-user-name'] = payload.name;
        req.headers['x-user-email'] = payload.email;

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
});

const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }

    next();
};

module.exports = { authenticateJWT, authorizeRoles, asyncHandler };
