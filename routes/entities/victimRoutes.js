const express = require('express');
const router = express.Router();
const victimController = require('../../controllers/Entities/victimController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

router.post('/', authenticateJWT, authorizeRoles('daemon', 'superadmin'), victimController.createVictim);
router.get('/', authenticateJWT, victimController.listVictims);
router.get('/:id', authenticateJWT, victimController.getVictim);
router.patch('/:name', authenticateJWT, authorizeRoles('superadmin'), victimController.updateVictim);
router.delete('/:name', authenticateJWT, authorizeRoles('superadmin'), victimController.removeVictim);

module.exports = router;
