import express from "express";
import { depositFunds, verifyDeposit, withdrawFunds, handleWebhook } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Updated to default import

const router = express.Router();

/**
 * @swagger
 * /api/payments/deposit:
 *   post:
 *     tags: [Payment Management]
 *     summary: Deposit funds into the user's account
 *     description: This endpoint allows users to deposit funds into their account.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to deposit
 *               currency:
 *                 type: string
 *                 description: The currency of the deposit
 *     responses:
 *       200:
 *         description: Funds deposited successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/deposit", authMiddleware, depositFunds);

/**
 * @swagger
 * /api/payments/verify:
 *   get:
 *     tags: [Payment Management]
 *     summary: Verify a deposit
 *     description: This endpoint allows users to verify a deposit.
 *     responses:
 *       200:
 *         description: Deposit verified successfully
 *       404:
 *         description: Deposit not found
 *       500:
 *         description: Internal server error
 */
router.get("/verify", verifyDeposit);

/**
 * @swagger
 * /api/payments/withdraw:
 *   post:
 *     tags: [Payment Management]
 *     summary: Withdraw funds from the user's account
 *     description: This endpoint allows users to withdraw funds from their account.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount to withdraw
 *               currency:
 *                 type: string
 *                 description: The currency of the withdrawal
 *     responses:
 *       200:
 *         description: Funds withdrawn successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/withdraw", authMiddleware, withdrawFunds);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     tags: [Payment Management]
 *     summary: Handle Paystack webhook notifications
 *     description: This endpoint handles webhook notifications from Paystack for payment status updates.
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook payload
 */
router.post("/webhook", handleWebhook);

export default router;
