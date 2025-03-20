import express from "express";
import { downloadTransactionReport } from "../controllers/reportController.js";
import authMiddleware  from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/reports/download:
 *   get:
 *     tags: [Report Management]
 *     summary: Download transaction report
 *     security:
 *       - bearerAuth: []
 *     description: Downloads the transaction report in PDF or CSV format.
 *     responses:
 *       200:
 *         description: Report file downloaded successfully.
 *       400:
 *         description: Invalid request.
 */
router.get("/download", authMiddleware, downloadTransactionReport);


export default router;
