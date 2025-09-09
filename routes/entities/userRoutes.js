const express = require('express');
const router = express.Router();
const userController = require('../../controllers/Entities/userController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

router.get('/', authenticateJWT, authorizeRoles('superadmin'), userController.listUsers);
router.get('/:id', authenticateJWT, authorizeRoles('superadmin'), userController.getUser);
router.patch('/:id', authenticateJWT, authorizeRoles('superadmin'), userController.updateUser);
router.delete('/:id', authenticateJWT, authorizeRoles('superadmin'), userController.removeUser);

module.exports = router;