const express = require('express');
const router = express.Router();
const userController = require('../../controllers/Entities/userController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Se listan todos los usuarios (daemons y superadmins). Solo disponible para superadmins.    
 *     tags: [User]      
 *     responses:       
 *       200:
 *         description: Devolución de la lista de los usuarios 
 */
router.get('/', authenticateJWT, authorizeRoles('superadmin'), userController.listUsers);

/**
 * @swagger
 * /users/:id:
 *   get:
 *     summary: Buscar un usuario en específico por su id (solo accesible por el superusuario) 
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       404:
 *         description: El usuario no existe.          
 *       200:
 *         description: Se devuelve el usuario. 
 */
router.get('/:id', authenticateJWT, authorizeRoles('superadmin'), userController.getUser);

/**
 * @swagger
 * /users/:id:
 *   patch:
 *     summary: Buscar un usuario en específico por su id (solo accesible por el superusuario) 
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
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
 *               email:
 *                 type: string
 *                 example: "carlitos@badplan.com"
 *               role:
 *                 type: string
 *                 example: "superadmin/daemon"
 *     responses:
 *       404:
 *         description: El usuario no existe.          
 *       200:
 *         description: Se actualiza el usuario. 
 */
router.patch('/:id', authenticateJWT, authorizeRoles('superadmin'), userController.updateUser);

/**
 * @swagger
 * /users/:id:
 *   delete:
 *     summary: Eliminar un usuario en específico por su id (solo accesible por el superusuario) 
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       404:
 *         description: El usuario no existe.          
 *       204:
 *         description: Usuario eliminado. 
 */
router.delete('/:id', authenticateJWT, authorizeRoles('superadmin'), userController.removeUser);

module.exports = router;