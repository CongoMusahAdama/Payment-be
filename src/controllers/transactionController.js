import { transferFundsService, requestMoneyService } from "../services/transactionService.js";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation



// ✅ Handle Money Transfers
export const transferFunds = async (req, res) => {
  try {
    const { recipientId, amount } = req.body;
    const senderId = req.user._id; // Get user ID from JWT

    // Validate recipientId is not empty and is a string
    if (!recipientId || typeof recipientId !== 'string') {
        return res.status(400).json({ message: "Invalid recipient ID format" });

    }

    const transaction = await transferFundsService(senderId, recipientId, amount);



    res.status(200).json({ message: "Transfer successful", transaction });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Handle Money Requests
export const requestMoney = async (req, res) => {
  try {
    const { recipientId, amount, note } = req.body;
    const requesterId = req.user._id;

    const moneyRequest = await requestMoneyService(requesterId, recipientId, amount, note);

    res.status(200).json({ message: "Money request sent", request: moneyRequest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
