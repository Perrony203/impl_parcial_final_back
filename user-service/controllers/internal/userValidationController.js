'use strict';

const { User } = require('../../models');

/**
 * Internal User Validation Controller
 *
 * This controller provides endpoints for service-to-service communication
 * to validate user existence and retrieve user information.
 *
 * IMPORTANT: These endpoints should NOT be exposed through the API Gateway.
 * They are for internal microservice communication only.
 */

/**
 * Validate if a user exists and return basic information
 * GET /internal/users/:id/validate
 */
const validateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'role']
    });

    if (!user) {
      return res.status(200).json({
        exists: false
      });
    }

    return res.status(200).json({
      exists: true,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.error('Error validating user:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to validate user'
    });
  }
};

module.exports = {
  validateUser
};
