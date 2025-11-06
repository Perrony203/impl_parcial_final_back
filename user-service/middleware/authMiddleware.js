'use strict';

/**
 * Authentication Middleware Utilities
 *
 * This file contains utility functions for authentication.
 * JWT validation is handled by the API Gateway.
 * User information comes from headers via headerAuthMiddleware.
 */

/**
 * Async handler wrapper to catch errors in async route handlers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Authorization middleware - checks if user has required role
 * @param {Array} roles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = {
  asyncHandler,
  authorizeRoles
};
