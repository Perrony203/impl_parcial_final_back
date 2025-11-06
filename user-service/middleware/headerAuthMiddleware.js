'use strict';

/**
 * Header Authentication Middleware
 *
 * This middleware extracts user information from HTTP headers sent by the API Gateway.
 * The Gateway validates JWT tokens and forwards user context via X-User-* headers.
 *
 * This service does NOT validate JWT tokens - that's the Gateway's responsibility.
 * We trust the headers sent by the Gateway as the services are in a trusted network.
 *
 * Headers expected:
 * - X-User-Id: User ID
 * - X-User-Role: User role (superadmin, daemon)
 * - X-User-Name: User name
 * - X-User-Email: User email
 */

const headerAuthMiddleware = (req, res, next) => {
  // Extract user information from headers
  const userId = req.headers['x-user-id'];
  const userRole = req.headers['x-user-role'];
  const userName = req.headers['x-user-name'];
  const userEmail = req.headers['x-user-email'];

  // If headers exist, populate req.user
  if (userId && userRole) {
    req.user = {
      id: parseInt(userId, 10),
      role: userRole,
      name: userName || '',
      email: userEmail || ''
    };

    console.log(`[Header Auth] User authenticated: ${userName} (${userRole})`);
  } else {
    // No user headers - this is OK for public routes like /auth/login
    req.user = null;
  }

  // Always continue to next middleware
  next();
};

module.exports = headerAuthMiddleware;
