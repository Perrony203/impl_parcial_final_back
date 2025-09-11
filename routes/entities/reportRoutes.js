const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/Entities/reportController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

router.post('/', reportController.createAnonymousReport);
router.get('/', authenticateJWT, authorizeRoles('superadmin'), reportController.listReports);
router.delete('/:id', authenticateJWT, authorizeRoles('superadmin'), reportController.removeReport);

module.exports = router;