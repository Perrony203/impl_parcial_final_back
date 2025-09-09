const express = require('express');
const router = express.Router();
const resistanceAttemptController = require('../../controllers/Entities/resistance_attemptController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

router.post('/', authenticateJWT, authorizeRoles('daemon'), resistanceAttemptController.createAttempt);
router.get('/', authenticateJWT, authorizeRoles('superadmin'), resistanceAttemptController.listAttempts);
router.get('/:id', authenticateJWT, resistanceAttemptController.getAttempt);
router.patch('/:id', authenticateJWT, resistanceAttemptController.updateAttempt);
router.delete('/:id', authenticateJWT, authorizeRoles('superadmin'), resistanceAttemptController.removeAttempt);

module.exports = router;