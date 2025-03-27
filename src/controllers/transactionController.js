import { transferFundsService, requestMoneyService, getUserTransactions } from "../services/transactionService.js";
import mongoose from "mongoose";
import Transaction from "../models/transaction.js";
import User from "../models/user.js"; 
import Wallet from "../models/wallet.js"; 

// ✅ Handle Money Transfers
export const transferFunds = async (req, res) => {
  try {
    const { recipientId, amount } = req.body;
    const senderId = req.user._id; 

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

/**
 * Fetch All Money Requests
 */
export const fetchAllMoneyRequests = async (req, res) => {
  try {
    const userId = req.user._id; // Authenticated user ID

    // Fetch money requests where the user is the recipient
    const transactions = await Transaction.find({ 
      transactionType: "request",  
      recipient: userId  
    }).populate("sender", "name email"); // Populate sender details

    if (!transactions.length) {
      return res.status(404).json({ message: "No money requests found" });
    }

    return res.status(200).json({ message: "Money requests retrieved", transactions });
  } catch (error) {
    console.error("🚨 Error fetching money requests:", error);
    return res.status(500).json({ message: "Failed to fetch money requests" });
  }
};


/**
 * Approve Money Request
 */
export const approveMoneyRequest = async (req, res) => {
  try {
    const { transactionId } = req.params; // Assuming transaction ID is passed as a URL parameter
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Check if the requester has enough balance
    const user = await User.findById(transaction.sender);
    const wallet = await Wallet.findOne({ user: user.id });

    if (!wallet || wallet.balance < transaction.amount) {
      return res.status(400).json({ message: "Insufficient funds for this transaction" });
    }

    // Update the transaction status to approved
    transaction.status = "approved";
    await transaction.save();

    return res.status(200).json({ message: "Transaction approved successfully", transaction });
  } catch (error) {
    console.error("Error approving money request:", error);
    return res.status(500).json({ message: "Failed to approve money request" });
  }
};

// Existing functions...
