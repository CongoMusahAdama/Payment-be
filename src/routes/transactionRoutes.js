import express from "express";
import { transferFunds, requestMoney, getTransactionHistory, fetchAllMoneyRequests, approveMoneyRequest } from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/transactions/transfer:
 *   post:
 *     tags: [Money Transfer Management]
 *     summary: Secure fund transfer
 *     security:
 *       - bearerAuth: []
 *     description: Transfers funds securely from one user to another.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount to transfer.
 *               sendersId:
 *                 type: string
 *                 description: ID of the sender.
 *               recipientId:
 *                 type: string
 *                 description: ID of the recipient.
 *     responses:
 *       200:
 *         description: Transfer successful.
 *       400:
 *         description: Invalid request.
 */
router.post("/transfer", authMiddleware, transferFunds);

/**
 * @swagger
 * /api/transactions/request-money:
 *   post:
 *     tags: [Money Transfer Management]
 *     summary: Request money from another user
 *     security:
 *       - bearerAuth: []
 *     description: Sends a money request to another user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Amount requested.
 *               recipientId:
 *                 type: string
 *                 description: ID of the recipient.
 *               requesterId:
 *                 type: string
 *                 description: ID of the requester.
 *               note:
 *                 type: string
 *                 description: Additional note.
 *     responses:
 *       200:
 *         description: Request sent successfully.
 *       400:
 *         description: Invalid request.
 */
router.post("/request-money", authMiddleware, requestMoney);

/**
 * @swagger
 * /api/transactions/history:
 *   get:
 *     tags: [Money Transfer Management]
 *     summary: Get transaction history
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves the transaction history for the authenticated user.
 *     responses:
 *       200:
 *         description: Successfully retrieved transaction history.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Transaction ID.
 *                       amount:
 *                         type: number
 *                         description: Amount of the transaction.
 *                       date:
 *                         type: string
 *                         format: date-time
 *                         description: Date of the transaction.
 *                       status:
 *                         type: string
 *                         description: Status of the transaction.
 *       400:
 *         description: Invalid request.
 */
router.get("/history", authMiddleware, getTransactionHistory);

/**
 * @swagger
 * /api/transactions/requests:
 *   get:
 *     tags: [Money Transfer Management]
 *     summary: Retrieve all money requests
 *     security:
 *       - bearerAuth: []
 *     description: Retrieves all pending and completed money requests.
 *     responses:
 *       200:
 *         description: Successfully retrieved money requests.
 *       500:
 *         description: Failed to fetch money requests.
 */
router.get("/requests", authMiddleware, fetchAllMoneyRequests);

/**
 * @swagger
 * /api/transactions/approve/{transactionId}:
 *   post:
 *     tags: [Money Transfer Management]
 *     summary: Approve a money request
 *     security:
 *       - bearerAuth: []
 *     description: Approves a pending money request by updating its status to approved.
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         description: ID of the transaction to approve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Transaction approved successfully.
 *       404:
 *         description: Transaction not found.
 *       400:
 *         description: Insufficient funds for this transaction.
 *       500:
 *         description: Failed to approve money request.
 */
router.post("/approve/:transactionId", authMiddleware, approveMoneyRequest);

export default router;
