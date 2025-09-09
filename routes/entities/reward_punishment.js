const express = require('express');
const router = express.Router();
const rewardPunishmentController = require('../../controllers/Entities/reward_punishment');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');


router.post('/', authenticateJWT, authorizeRoles('superadmin'), rewardPunishmentController.createRewardPunishment);
router.get('/', authenticateJWT, authorizeRoles('superadmin'), rewardPunishmentController.listAll);
router.get('/my', authenticateJWT, authorizeRoles('daemon'), rewardPunishmentController.listMine);

module.exports = router;