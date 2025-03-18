import User from "../models/user.js";
import Transaction from "../models/transaction.js";
import Wallet from "../models/wallet.js";
import mongoose from "mongoose"; 

 


// ✅ Secure Fund Transfer
export const transferFundsService = async (senderId, recipientId, amount) => {
  if (amount <= 0) throw new Error("Transfer amount must be greater than zero");

  console.log("Sender ID:", senderId);
  console.log("Recipient ID:", recipientId);
  const senderWallet = await Wallet.findOne({ user: senderId });

  const recipientWallet = await Wallet.findOne({ user: new mongoose.Types.ObjectId(recipientId) });



  if (!senderWallet || !recipientWallet) throw new Error("Wallet not found");
  if (senderWallet.balance < amount) throw new Error("Insufficient funds");

  // Deduct amount from sender's wallet
  senderWallet.balance -= amount;
  await senderWallet.save();

  // Add amount to recipient's wallet
  recipientWallet.balance += amount;
  await recipientWallet.save();

  // Create transaction record
  const transaction = new Transaction({
    recipient: mongoose.Types.ObjectId(recipientId), // Ensure recipientId is an ObjectId

    sender: senderId,
    recipient: mongoose.Types.ObjectId(recipientId), // Ensure recipientId is an ObjectId

    transactionType: "transfer",
    amount,
    status: "completed",
    reference: `TXN-${Date.now()}`
  });

  await transaction.save();

  return transaction;
};

// ✅ Money Request Functionality
export const requestMoneyService = async (requesterId, recipientId, amount, note) => {
  if (amount <= 0) throw new Error("Requested amount must be greater than zero");

  const moneyRequest = new Transaction({
    sender: requesterId, // The person requesting the money
    recipient: recipientId, // The person being asked to send money
    transactionType: "request",
    amount,
    status: "pending",
    reference: `REQ-${Date.now()}`,
    note
  });

  await moneyRequest.save();
  return moneyRequest;
};


// ✅ Get User Transaction History with Filters
export const getUserTransactions = async (userId, filters) => {
  const query = { $or: [{ sender: userId }, { recipient: userId }] };

  // Apply filters
  if (filters.startDate && filters.endDate) {
    query.createdAt = { $gte: new Date(filters.startDate), $lte: new Date(filters.endDate) };
  }
  if (filters.transactionType) {
    query.transactionType = filters.transactionType;
  }

  const transactions = await Transaction.find(query).sort({ createdAt: -1 }); // Latest first
  return transactions;
};

