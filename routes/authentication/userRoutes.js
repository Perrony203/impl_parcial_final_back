const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authentication/userAuthController');
const { authenticateJWT, authorizeRoles } = require('../../middleware/authMiddleware');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realizar el login de daemons y superusuario (Andrei Mes Manur) 
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:               
 *               email:
 *                 type: string
 *                 example: "carlitos@badplan.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       401:
 *         description: credenciales inválidas
 *       200:
 *         description: Login correcto 
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/register-daemon:
 *   post:
 *     summary: Realizar el registro de daemons (solo accesible por el superusuario) 
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "carlos"
 *               email:
 *                 type: string
 *                 example: "carlitos@badplan.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       400:
 *         description: Parámetros incompletos
 *       409:
 *         description: El daemon ya existe  
 *       201:
 *         description: Creado correctamente 
 */
router.post('/register-daemon', authenticateJWT, authorizeRoles('superadmin'), authController.createDaemon);

/**
 * @swagger
 * /auth/me:
 *   post:
 *     summary: Para un usuario (daemon o superadmin) permite visualizar su perfil 
 *     tags: [Auth]
 *     responses:        
 *       200:
 *         description: Usuario llamado correctamente 
 */
router.get('/me', authenticateJWT, authController.me);

module.exports = router;

