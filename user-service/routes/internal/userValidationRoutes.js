'use strict';

const express = require('express');
const router = express.Router();
const { validateUser } = require('../../controllers/internal/userValidationController');

/**
 * Internal User Validation Routes
 *
 * These routes are for service-to-service communication only.
 * They should NOT be exposed through the API Gateway.
 *
 * No authentication required as these are internal endpoints
 * between trusted microservices.
 */

// Validate user existence and get basic info
router.get('/users/:id/validate', validateUser);

module.exports = router;
