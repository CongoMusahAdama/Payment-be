import express from "express";
import { transferFunds, requestMoney, getTransactionHistory, fetchAllMoneyRequests, approveMoneyRequest, } from "../controllers/transactionController.js";
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
 * /api/transactions/approve/{requestId}:
 *   put:
 *     tags: [Money Transfer Management]
 *     summary: Approve a money request
 *     description: Approves a pending money request after validating the requester's wallet balance.
 *     security:
 *       - bearerAuth: []  
 *     parameters:
 *       - in: path
 *         name: requestId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the money request to approve
 *     responses:
 *       200:
 *         description: Money request approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 moneyRequest:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     sender:
 *                       type: string
 *                     requester:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     status:
 *                       type: string
 *                       enum: [pending, approved, declined]
 *       400:
 *         description: Insufficient funds or invalid request
 *       401:
 *         description: Unauthorized (invalid token)
 *       404:
 *         description: Money request not found
 *       500:
 *         description: Internal server error
 */
router.put("/approve/:requestId", authMiddleware, approveMoneyRequest);

export default router;
