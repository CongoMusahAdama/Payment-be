import express from 'express';
import { updateProfile, uploadKYC, getUserProfile } from '../controllers/userController.js'; // Import the new controller method
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../config/fileuploads.js'; 

const router = express.Router();

/**
 * @swagger
 * api/users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieves the user profile based on the user ID.
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 *     tags:
 *       - User Profile Management
 */
router.get('/profile', authMiddleware, getUserProfile); // Get user profile

/**
 * @swagger
 * api/users/upload-kyc:
 *   post:
 *     summary: Upload KYC document
 *     description: Uploads a KYC document for the user.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               kycDocument:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: KYC document uploaded successfully
 *       400:
 *         description: Invalid input
 *     tags:
 *       - User Profile Management
 */
router.post('/upload-kyc', authMiddleware, upload.single('kycDocument'), uploadKYC); // KYC document upload

/**
 * @swagger
 * api/users/profile:
 *   put:
 *     summary: Update user profile
 *     description: Updates the user profile with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid input
 *     tags:
 *       - User Profile Management
 */
router.put('/profile', authMiddleware, updateProfile); // Profile update

export default router;
