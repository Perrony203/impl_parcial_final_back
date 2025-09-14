const express = require('express');
const router = express.Router();
const contentController = require('../../controllers/Entities/resistance_contentController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * /content:
 *   get:
 *     summary: Se lista todo el contenido de la página pública.    
 *     tags: [Content]      
 *     responses:       
 *       200:
 *         description: Devolución del contenido de la página. 
 */
router.get('/', contentController.listContent);

/**
 * @swagger
 * /content:
 *   post:
 *     summary: Realizar el registro de contenido en la página pública.
 *     tags: [Content]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - mediaUrl
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Meme graciosillo"
 *               content:
 *                 type: string
 *                 example: "Que risa el meme jajajaja"
 *               midiaUrl:
 *                 type: string
 *                 example: "https://meme-gracioso"
 *     responses:
 *       400:
 *         description: Parámetros incompletos
 *       201:
 *         description: Creado correctamente 
 */
router.post('/', authenticateJWT, authorizeRoles('superadmin'), contentController.createContent);

/**
 * @swagger
 * /content/:id:
 *   patch:
 *     summary: Actualizar un post de contenido (solo accesible por el superusuario) 
 *     tags: [Content]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - mediaUrl
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Meme graciosillo"
 *               content:
 *                 type: string
 *                 example: "Que risa el meme jajajaja"
 *               midiaUrl:
 *                 type: string
 *                 example: "https://meme-gracioso"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Id del post a actualizar
 *     responses:
 *       404:
 *         description:El contenido no existe.          
 *       200:
 *         description: Se actualiza el contenido. 
 */
router.patch('/:id', authenticateJWT, authorizeRoles('superadmin'), contentController.updateContent);

/**
 * @swagger
 * /content/:id:
 *   delete:
 *     summary: Eliminar un post de contenido en específico por su Id (solo accesible por el superusuario) 
 *     tags: [Content]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: id del contenido
 *     responses:
 *       404:
 *         description: El contenido no existe.          
 *       204:
 *         description: Contenido eliminado. 
 */
router.delete('/:id', authenticateJWT, authorizeRoles('superadmin'), contentController.removeContent);

module.exports = router;