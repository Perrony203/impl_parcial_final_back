const express = require('express');
const router = express.Router();
const reportController = require('../../controllers/Entities/reportController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Realizar el registro de un reporte anónimo.
 *     tags: [Report]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Se cayó la página"
 *               content:
 *                 type: string
 *                 example: "Necesito que solucionen rápido, me quedé sin memes"
 *     responses:
 *       404:
 *         description: Parámetros incompletos o nivel de peligro fuera de rango
 *       201:
 *         description: Creado correctamente 
 */
router.post('/', reportController.createAnonymousReport);

/**
 * @swagger
 * /reports:
 *   get:
 *     summary: Se listan todos los reportes anónimos.    
 *     tags: [Report]      
 *     responses:       
 *       200:
 *         description: Devolución de la lista de los reportes anónimos. 
 */
router.get('/', authenticateJWT, authorizeRoles('superadmin'), reportController.listReports);

/**
 * @swagger
 * /reports:id:
 *   get:
 *     summary: Elimina un reporte anónimo en específico por su id. 
 *     tags: [Report]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       404:
 *         description:El reporte no existe.          
 *       200:
 *         description: Se devuelve el reporte. 
 */
router.delete('/:id', authenticateJWT, authorizeRoles('superadmin'), reportController.removeReport);

module.exports = router;