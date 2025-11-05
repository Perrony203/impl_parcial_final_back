const express = require('express');
const router = express.Router();
const resistanceAttemptController = require('../../controllers/Entities/resistance_attemptController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * /attempts:
 *   post:
 *     summary: Realizar el registro de una intento de resistencia
 *     tags: [Attempt]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - victimName
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Se nos metieron"
 *               content:
 *                 type: string
 *                 example: "A la página"
 *               victimName:
 *                 type: string
 *                 example: "Carlos"
 * 
 *     responses:
 *       400:
 *         description: Parámetros incompletos
 *       404:
 *         description: Víctima no encontrada
 *       201:
 *         description: Creado correctamente 
 */
router.post('/', authenticateJWT, authorizeRoles('daemon', 'superadmin'), resistanceAttemptController.createAttempt);

/**
 * @swagger
 * /attempts:
 *   get:
 *     summary: Se listan todos los intentos de resistencia.    
 *     tags: [Attempt]      
 *     responses:       
 *       200:
 *         description: Devolución de la lista de las intentos de resistencia 
 */
router.get('/', authenticateJWT, authorizeRoles('superadmin'), resistanceAttemptController.listAttempts);

/**
 * @swagger
 * /attempts/:id:
 *   get:
 *     summary: Buscar un intento de resistencia en específico por su id. 
 *     tags: [Attempt]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del intento de resistencia
 *     responses:
 *       404:
 *         description:La víctima no existe.     
 *       403:
 *         description:El daemon no tiene permiso para ver este intento de resistencia      
 *       200:
 *         description: Se devuelve el intento de resistencia. 
 */
router.get('/:id', authenticateJWT, authorizeRoles('superadmin'), resistanceAttemptController.getAttempt);

/**
 * @swagger
 * /attempts/victim/:id:
 *   get:
 *     summary: Buscar los intentos de resistencia para una víctima en específico por su id. 
 *     tags: [Attempt]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la víctima
 *     responses:
 *       404:
 *         description:No hay historial de intentos de resistencia para la víctima.       
 *       200:
 *         description: Se devuelve el intento de resistencia. 
 */
router.get('/victim/:id', authenticateJWT, authorizeRoles('superadmin'), resistanceAttemptController.getForVictim);

/**
 * @swagger
 * /attempts/:id:
 *   patch:
 *     summary: Actualizar un intento de resistencia en específico por su id (solo accesible por el superusuario) 
 *     tags: [Attempt]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Título del intento de resistencia"
 *               content:
 *                 type: string
 *                 example: "Descripción del intento de resistencia"               
 *               state:
 *                 type: string
 *                 example: "Pending/In_proggress/Resolved/Rejected"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: id del usuario
 *     responses:
 *       404:
 *         description:El intento de resistencia no existe.          
 *       200:
 *         description: Se actualiza el intento de resistencia. 
 */
router.patch('/:id', authenticateJWT, authorizeRoles('superadmin'), resistanceAttemptController.updateAttempt);

/**
 * @swagger
 * /attempts/:id:
 *   delete:
 *     summary: Eliminar un intento de resistencia en específico por su id (solo accesible por el superusuario) 
 *     tags: [Attempt]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: id del usuario
 *     responses:
 *       404:
 *         description: El intento de resistencia no existe.          
 *       204:
 *         description: Intento de resistenca eliminado. 
 */
router.delete('/:id', authenticateJWT, authorizeRoles('superadmin'), resistanceAttemptController.removeAttempt);

module.exports = router;