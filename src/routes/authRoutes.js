import express from 'express';
import authController from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: User Registration
 *     description: Registers a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *     tags:
 *       - Authentication
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User Login
 *     description: Authenticates a user and returns a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Invalid credentials
 *     tags:
 *       - Authentication
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: User Logout
 *     description: Logs out the user and invalidates the token.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *     tags:
 *       - Authentication
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh Token
 *     description: Refreshes the authentication token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New token generated
 *       401:
 *         description: Refresh token is required
 *     tags:
 *       - Authentication  # FIXED: Proper indentation
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @swagger
 * /api/auth/mfa-setup:
 *   post:
 *     summary: MFA Setup
 *     description: Initiates the MFA setup process by sending a verification code to the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: MFA setup initiated, verification code sent
 *     tags:
 *       - Authentication
 */
router.post('/mfa-setup', authController.mfaSetup);

/**
 * @swagger
 * /api/auth/mfa-verify:
 *   post:
 *     summary: MFA Verification
 *     description: Verifies the provided MFA code.
 *     security:  # FIXED: Proper indentation
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               code:
 *                 type: string
 *     responses:
 *       200:
 *         description: MFA verification successful
 *       400:
 *         description: Invalid verification code
 *     tags:
 *       - Authentication
 */
router.post('/mfa-verify', authController.mfaVerify);

// Default export for the router
export default router;
