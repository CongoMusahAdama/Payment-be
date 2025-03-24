import { transferFundsService, requestMoneyService, getUserTransactions } from "../services/transactionService.js";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation
import Transaction from "../models/transaction.js";

// ✅ Handle Money Transfers
export const transferFunds = async (req, res) => {
  try {
    const { recipientId, amount } = req.body;
    const senderId = req.user._id; // Get user ID from JWT

    console.log("Received Request Body:", req.body);
    console.log("Sender ID (from token):", senderId);

    if (!recipientId || typeof recipientId !== "string") {
      console.log("Invalid Recipient ID Format:", recipientId);
      return res.status(400).json({ message: "Invalid recipient ID format" });
    }

    const transaction = await transferFundsService(senderId, recipientId, amount);

    res.status(200).json({ message: "Transfer successful", transaction });
  } catch (error) {
    console.error("Transfer Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// ✅ Handle Money Requests
export const requestMoney = async (req, res) => {
  try {
    const { recipientId, requesterId, amount, note } = req.body;

    //const requesterId = req.user._id;

    const moneyRequest = await requestMoneyService(requesterId, recipientId, amount, note);

    res.status(200).json({ message: "Money request sent", request: moneyRequest });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Retrieve User Transaction History
export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    const transactions = await getUserTransactions(userId);

    res.status(200).json({ message: "Transaction history retrieved", transactions });
  } catch (error) {
    console.log("Error:", error.message);

    res.status(400).json({ message: error.message });
  }
};
