const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication/userAuthController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register-daemon', authenticateJWT, authorizeRoles('superadmin'), authController.createDaemon);
router.get('/me', authenticateJWT, authController.me);

module.exports = router;

