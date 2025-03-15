import express from 'express';
import userController from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// User Registration
router.post('/register', userController.register);

router.post('/login', userController.login);

router.post('/logout', authMiddleware, userController.logout); // User Logout

// Refresh Token
router.post('/refresh-token', userController.refreshToken);

router.post('/mfa-setup', userController.mfaSetup);

router.post('/mfa-verify', userController.mfaVerify);

// Default export for the router
export default router;
