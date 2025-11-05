const express = require('express');
const router = express.Router();
const rewardPunishmentController = require('../../controllers/Entities/reward_punishmentController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * /rewards:
 *   post:
 *     summary: Realizar el registro de una recompensa o castigo a un daemon
 *     tags: [Reward-punishment]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - daemonId
 *               - type
 *               - description
 *             properties:
 *               daemonId:
 *                 type: integer
 *                 example: "3"
 *               type:
 *                 type: string
 *                 example: "reward/punishment"
 *               dscription:
 *                 type: string
 *                 example: "Se portó muy mal"
 * 
 *     responses:
 *       404:
 *         description: Parámetros incompletos o nivel de peligro fuera de rango
 *       201:
 *         description: Creado correctamente 
 */
router.post('/', authenticateJWT, authorizeRoles('superadmin'), rewardPunishmentController.createRewardPunishment);

/**
 * @swagger
 * /rewards:
 *   get:
 *     summary: Se listan todas las recompensas y castigos.    
 *     tags: [Reward-punishment]      
 *     responses:       
 *       200:
 *         description: Devolución de la lista de recompensas y castigos. 
 */
router.get('/', authenticateJWT, authorizeRoles('superadmin'), rewardPunishmentController.listAll);

/**
 * @swagger
 * /rewards/me:
 *   get:
 *     summary: Buscar las recompensas y castigos propios del usuario. 
 *     tags: [Reward-punishment]     
 *     responses:           
 *       200:
 *         description: Se devuelve la lista de recompensas y castigos. 
 */
router.get('/me', authenticateJWT, authorizeRoles('daemon', 'superadmin'), rewardPunishmentController.listMine);

/**
 * @swagger
 * /rewards/daemon/:id:
 *   get:
 *     summary: Buscar las recompensas y castigos propios de un usuario. 
 *     tags: [Reward-punishment]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       404:
 *         description:EL usuario no existe.          
 *       200:
 *         description: Se devuelve el historial de recompensas y castigos para el usurio. 
 */
router.get('/daemon/:id', authenticateJWT, authorizeRoles('superadmin'), rewardPunishmentController.getForDaemon);

module.exports = router;