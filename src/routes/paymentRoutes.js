import express from "express";
import { depositFunds, verifyDeposit, requestOtp, verifyOtp, handleWebhookController, getUserBalance } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

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
 *               email:
 *                 type: string
 *                 description: The email of the user
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
 *     parameters:
 *       - in: query
 *         name: reference
 *         required: true
 *         description: The reference of the payment to verify
 *         schema:
 *           type: string
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
 * /api/payments/withdraw/request-otp:
 *   post:
 *     tags: [Payment Management]
 *     summary: Request OTP for withdrawal
 *     description: This endpoint allows users to request an OTP for withdrawal.
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
 *     responses:
 *       200:
 *         description: OTP requested successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/withdraw/request-otp", authMiddleware, requestOtp);

/**
 * @swagger
 * /api/payments/withdraw/verify:
 *   post:
 *     tags: [Payment Management]
 *     summary: Verify OTP and process withdrawal
 *     description: This endpoint allows users to verify OTP and complete the withdrawal.
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
 *               otp:
 *                 type: string
 *                 description: The OTP received for verification
 *     responses:
 *       200:
 *         description: Withdrawal processed successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/withdraw/verify", authMiddleware, verifyOtp);


/**
 * @swagger
 * /api/payments/balance:
 *   get:
 *     tags: [Payment Management]
 *     summary: Get user balance
 *     description: This endpoint allows users to retrieve their current balance.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User balance retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/balance", authMiddleware, getUserBalance);

/**
 * @swagger
 * /api/payments/webhook:
 *   post:
 *     tags: [Payment Management]
 *     summary: Handle Paystack webhook notifications
 *     description: This endpoint handles webhook notifications from Paystack for payment status updates.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: Type of the event (e.g., charge.success)
 *               data:
 *                 type: object
 *                 properties:
 *                   reference:
 *                     type: string
 *                     description: Reference of the payment
 *     responses:
 *       200:
 *         description: Webhook processed successfully
 *       400:
 *         description: Invalid webhook payload
 */
router.post("/webhook", handleWebhookController);

export default router;
