'use strict';

const { createProxyMiddleware } = require('http-proxy-middleware');
const { getServiceUrl } = require('../utils/eurekaHelper');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * Proxy Routes Configuration
 *
 * Configures HTTP proxy middleware to route requests to microservices
 * discovered through Eureka service registry.
 *
 * Routes:
 * - USER-SERVICE: /badPlan/auth/*, /badPlan/users/*
 * - RESISTANCE-SERVICE: /badPlan/victims/*, /badPlan/attempts/*, /badPlan/rewards/*, /badPlan/content/*, /badPlan/reports/*
 */

module.exports = (app, eurekaClient) => {
    console.log('[Proxy Routes] Configuring proxy routes...');

    // Helper function to create proxy middleware with Eureka integration
    const createServiceProxy = (serviceName, options = {}) => {
        return createProxyMiddleware({
            target: 'http://localhost:3000', // Placeholder, will be overridden by router
            changeOrigin: true,
            timeout: 30000,
            logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',

            // Dynamic router - resolve service URL from Eureka at request time
            router: (req) => {
                const serviceUrl = getServiceUrl(eurekaClient, serviceName);
                if (!serviceUrl) {
                    console.error(`[Proxy] Service ${serviceName} not available in Eureka`);
                    return null;
                }
                console.log(`[Proxy] Routing ${req.method} ${req.path} -> ${serviceName} (${serviceUrl})`);
                return serviceUrl;
            },

            // Propagate user headers from authentication middleware
            onProxyReq: (proxyReq, req, res) => {
                // If user is authenticated, ensure headers are propagated
                if (req.headers['x-user-id']) {
                    proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
                    proxyReq.setHeader('x-user-role', req.headers['x-user-role']);
                    proxyReq.setHeader('x-user-name', req.headers['x-user-name']);
                    proxyReq.setHeader('x-user-email', req.headers['x-user-email']);
                }

                // Log the proxied request
                console.log(`[Proxy] -> ${proxyReq.method} ${proxyReq.path}`);
            },

            // Error handling
            onError: (err, req, res) => {
                console.error(`[Proxy Error] ${serviceName}:`, err.message);

                if (err.code === 'ECONNREFUSED') {
                    return res.status(503).json({
                        error: 'Service Unavailable',
                        message: `${serviceName} is currently unavailable`,
                        serviceName
                    });
                }

                if (err.code === 'ETIMEDOUT' || err.code === 'ESOCKETTIMEDOUT') {
                    return res.status(504).json({
                        error: 'Gateway Timeout',
                        message: `Request to ${serviceName} timed out`,
                        serviceName
                    });
                }

                return res.status(502).json({
                    error: 'Bad Gateway',
                    message: 'An error occurred while communicating with the service',
                    serviceName
                });
            },

            ...options
        });
    };

    // ============================================================
    // USER-SERVICE ROUTES
    // ============================================================

    // Public routes - Authentication (login, register)
    app.use('/badPlan/auth', createServiceProxy('USER-SERVICE'));
    console.log('[Proxy Routes] ✓ Configured /badPlan/auth/* -> USER-SERVICE (public)');

    // Protected routes - User management
    app.use('/badPlan/users', authenticateJWT, createServiceProxy('USER-SERVICE'));
    console.log('[Proxy Routes] ✓ Configured /badPlan/users/* -> USER-SERVICE (protected)');

    // ============================================================
    // RESISTANCE-SERVICE ROUTES
    // ============================================================

    // Public routes - Content (GET only)
    app.get('/badPlan/content/*', createServiceProxy('RESISTANCE-SERVICE'));
    console.log('[Proxy Routes] ✓ Configured GET /badPlan/content/* -> RESISTANCE-SERVICE (public)');

    // Public routes - Reports (POST only)
    app.post('/badPlan/reports/*', createServiceProxy('RESISTANCE-SERVICE'));
    console.log('[Proxy Routes] ✓ Configured POST /badPlan/reports/* -> RESISTANCE-SERVICE (public)');

    // Protected routes - Victims
    app.use('/badPlan/victims', authenticateJWT, createServiceProxy('RESISTANCE-SERVICE'));
    console.log('[Proxy Routes] ✓ Configured /badPlan/victims/* -> RESISTANCE-SERVICE (protected)');

    // Protected routes - Attempts
    app.use('/badPlan/attempts', authenticateJWT, createServiceProxy('RESISTANCE-SERVICE'));
    console.log('[Proxy Routes] ✓ Configured /badPlan/attempts/* -> RESISTANCE-SERVICE (protected)');

    // Protected routes - Rewards
    app.use('/badPlan/rewards', authenticateJWT, createServiceProxy('RESISTANCE-SERVICE'));
    console.log('[Proxy Routes] ✓ Configured /badPlan/rewards/* -> RESISTANCE-SERVICE (protected)');

    // Protected routes - Content (non-GET methods)
    app.use('/badPlan/content', authenticateJWT, createServiceProxy('RESISTANCE-SERVICE'));
    console.log('[Proxy Routes] ✓ Configured POST/PUT/DELETE /badPlan/content/* -> RESISTANCE-SERVICE (protected)');

    // Protected routes - Reports (non-POST methods)
    app.use('/badPlan/reports', authenticateJWT, createServiceProxy('RESISTANCE-SERVICE'));
    console.log('[Proxy Routes] ✓ Configured GET/PUT/DELETE /badPlan/reports/* -> RESISTANCE-SERVICE (protected)');

    console.log('[Proxy Routes] All proxy routes configured successfully');
};
