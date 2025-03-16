import express from "express";
import { transferFunds, requestMoney } from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js"; 

const router = express.Router();

/**
 * @swagger
 * /transfer:
 *   post:
 *     tags: [Money Transfer Management]
 *     summary: Secure fund transfer
 *     description: Transfers funds securely from one user to another.
 *     parameters:
 *       - in: body
 *         name: transferDetails
 *         description: Details of the transfer.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *               description: Amount to transfer.
 *             recipientId:
 *               type: string
 *               description: ID of the recipient.
 *     responses:
 *       200:
 *         description: Transfer successful.
 *       400:
 *         description: Invalid request.
 *     x-postman-collection:
 *       description: |
 *         Example Postman request:
 *         - URL: http://localhost:5000/transfer
 *         - Method: POST
 *         - Body:
 *           {
 *             "amount": 100,
 *             "recipientId": "recipient_user_id"
 *           }
 */
router.post("/transfer", authMiddleware, transferFunds);

/**
 * @swagger
 * /request-money:
 *   post:
 *     tags: [Money Transfer Management]
 *     summary: Request money from another user
 *     description: Sends a money request to another user.
 *     parameters:
 *       - in: body
 *         name: requestDetails
 *         description: Details of the money request.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             amount:
 *               type: number
 *               description: Amount requested.
 *             requesterId:
 *               type: string
 *               description: ID of the requester.
 *     responses:
 *       200:
 *         description: Request sent successfully.
 *       400:
 *         description: Invalid request.
 *     x-postman-collection:
 *       description: |
 *         Example Postman request:
 *         - URL: http://localhost:5000/request-money
 *         - Method: POST
 *         - Body:
 *           {
 *             "amount": 50,
 *             "requesterId": "requester_user_id"
 *           }
 */
router.post("/request-money", authMiddleware, requestMoney);

export default router;
