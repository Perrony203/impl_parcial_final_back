const express = require('express');
const router = express.Router();
const contentController = require('../../controllers/Entities/resistance_contentController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

// Público
router.get('/', contentController.listContent);
router.get('/:id', contentController.getContent);
//Super admin
router.post('/', authenticateJWT, authorizeRoles('superadmin'), contentController.createContent);
router.patch('/:id', authenticateJWT, authorizeRoles('superadmin'), contentController.updateContent);
router.delete('/:id', authenticateJWT, authorizeRoles('superadmin'), contentController.removeContent);

module.exports = router;