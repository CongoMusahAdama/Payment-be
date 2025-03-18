import express from "express";
import { depositFunds, verifyDeposit, withdrawFunds } from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // Updated to default import

const router = express.Router();

router.post("/deposit", authMiddleware, depositFunds);
router.get("/verify", verifyDeposit);
router.post("/withdraw", authMiddleware, withdrawFunds);

export default router;
