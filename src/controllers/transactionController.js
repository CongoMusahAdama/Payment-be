import { transferFundsService, requestMoneyService, getUserTransactions } from "../services/transactionService.js";
import mongoose from "mongoose";
import Transaction from "../models/transaction.js";
import MoneyRequest from "../models/MoneyRequest.js"; // Import MoneyRequest model

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

export const fetchAllMoneyRequests = async (req, res) => {
  try {
    const recipientCode = req.user.recipientCode; // Ensure this matches the stored field

    console.log("🔍 Fetching money requests for recipientCode:", recipientCode);

    // Fetch money requests where the user is the recipient
    const moneyRequests = await MoneyRequest.find({
      recipientCode: recipientCode, // Use recipientCode instead of recipientId
    }).populate("requesterId", "name email"); // Populate requester details

    console.log("📌 Money Requests Found:", moneyRequests);

    if (!moneyRequests.length) {
      console.warn("⚠️ No money requests found for this user.");
      return res.status(404).json({ message: "No money requests found for this user" });
    }

    return res.status(200).json({ message: "Money requests retrieved", moneyRequests });
  } catch (error) {
    console.error("🚨 Error fetching money requests:", error);
    return res.status(500).json({ message: "Failed to fetch money requests", error: error.message });
  }
};


/**
 * Approve Money Request
 */
export const approveMoneyRequest = async (req, res) => {
  try {
    const { requestId } = req.params; // ✅ Get Money Request ID
    const senderId = req.user.id; // ✅ Sender (approving the request)

    // 1️⃣ Fetch the money request
    const moneyRequest = await MoneyRequest.findById(requestId);
    if (!moneyRequest || moneyRequest.status !== "pending") {
      return res.status(400).json({ message: "Invalid or already processed request" });
    }

    // 2️⃣ Ensure the sender has enough balance
    const senderWallet = await Wallet.findOne({ user: senderId });
    if (!senderWallet || senderWallet.balance < moneyRequest.amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // 3️⃣ Deduct money from sender's wallet
    senderWallet.balance -= moneyRequest.amount;
    await senderWallet.save();

    // 4️⃣ Credit recipient's wallet
    const recipientWallet = await Wallet.findOne({ user: moneyRequest.requester });
    if (!recipientWallet) {
      return res.status(400).json({ message: "Recipient wallet not found" });
    }
    recipientWallet.balance += moneyRequest.amount;
    await recipientWallet.save();

    // 5️⃣ Create a transaction after approval
    const transaction = new Transaction({
      sender: senderId,
      recipient: moneyRequest.requester,
      amount: moneyRequest.amount,
      transactionType: "transfer",
      status: "completed",
      reference: `REQ-${requestId}`, // Use requestId as reference
    });
    await transaction.save();

    // 6️⃣ Mark the money request as approved
    moneyRequest.status = "approved";
    moneyRequest.transactionId = transaction._id; // Link transaction
    await moneyRequest.save();

    return res.status(200).json({ message: "Money request approved successfully", transaction });

  } catch (error) {
    console.error("❌ Error approving money request:", error);
    return res.status(500).json({ message: "Failed to approve money request", error: error.message });
  }
};
