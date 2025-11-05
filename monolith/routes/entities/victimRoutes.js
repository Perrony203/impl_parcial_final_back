const express = require('express');
const router = express.Router();
const victimController = require('../../controllers/Entities/victimController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * /victims:
 *   post:
 *     summary: Realizar el registro de daemons.
 *     tags: [Victim]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - dangerLevel
 *             properties:
 *               name:
 *                 type: string
 *                 example: "carlos"
 *               dangerLevel:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       404:
 *         description: Parámetros incompletos o nivel de peligro fuera de rango
 *       201:
 *         description: Creado correctamente 
 */
router.post('/', authenticateJWT, authorizeRoles('daemon', 'superadmin'), victimController.createVictim);

/**
 * @swagger
 * /victims:
 *   get:
 *     summary: Se listan todas las victimas.    
 *     tags: [Victim]      
 *     responses:       
 *       200:
 *         description: Devolución de la lista de las victimas 
 */
router.get('/', authenticateJWT, authorizeRoles('superadmin', 'daemon'),victimController.listVictims);

/**
 * @swagger
 * /victims/:id:
 *   get:
 *     summary: Buscar un usuario en específico por su id. 
 *     tags: [Victim]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       404:
 *         description:La víctima no existe.          
 *       200:
 *         description: Se devuelve la víctima. 
 */
router.get('/:id', authenticateJWT, authorizeRoles('superadmin', 'daemon'), victimController.getVictim);

/**
 * @swagger
 * /victims/:name:
 *   patch:
 *     summary: Actualizar una víctima en específico por su nombre (solo accesible por el superusuario) 
 *     tags: [Victim]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "carlos"
 *               dangerLevel:
 *                 type: integer (1-10)
 *                 example: "1"
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: nombre del usuario
 *     responses:
 *       404:
 *         description:La víctima no existe.          
 *       200:
 *         description: Se actualiza la víctima. 
 */
router.patch('/:name', authenticateJWT, authorizeRoles('superadmin'), victimController.updateVictim);

/**
 * @swagger
 * /victims/:name:
 *   delete:
 *     summary: Eliminar una víctima en específico por su nombre (solo accesible por el superusuario) 
 *     tags: [Victim]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: nombre del usuario
 *     responses:
 *       404:
 *         description: El usuario no existe.          
 *       204:
 *         description: Usuario eliminado. 
 */
router.delete('/:name', authenticateJWT, authorizeRoles('superadmin'), victimController.removeVictim);

module.exports = router;
