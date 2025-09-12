const express = require('express');
const router = express.Router();
const rewardPunishmentController = require('../../controllers/Entities/reward_punishmentController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

router.post('/', authenticateJWT, authorizeRoles('superadmin'), rewardPunishmentController.createRewardPunishment);
router.get('/', authenticateJWT, authorizeRoles('superadmin'), rewardPunishmentController.listAll);
router.get('/me', authenticateJWT, authorizeRoles('daemon', 'superadmin'), rewardPunishmentController.listMine);
router.get('/daemon/:id', authenticateJWT, authorizeRoles('superadmin'), rewardPunishmentController.getForDaemon);

module.exports = router;