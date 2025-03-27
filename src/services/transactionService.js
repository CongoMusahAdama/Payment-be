import User from "../models/user.js";
import Transaction from "../models/transaction.js";
import MoneyRequest from "../models/MoneyRequest.js"; // Import MoneyRequest model
import Wallet from "../models/wallet.js";
import mongoose from "mongoose"; // Import mongoose for ObjectId validation

// ✅ Secure Fund Transfer
export const transferFundsService = async (senderId, recipientId, amount) => {
  if (amount <= 0) throw new Error("Transfer amount must be greater than zero");

  console.log("SENDER ID:", senderId);
  console.log("RECIPIENT ID:", recipientId);

  // Convert recipientId to a valid MongoDB ObjectId
  const recipientObjectId = new mongoose.Types.ObjectId(recipientId);

  // Find sender's wallet
  const senderWallet = await Wallet.findOne({ user: senderId });
  if (!senderWallet) throw new Error("Sender's wallet not found");

  if (senderWallet.balance < amount) throw new Error("Insufficient funds");

  // Deduct amount from sender's wallet
  senderWallet.balance -= amount;
  await senderWallet.save();

  // Create a new wallet for the recipient if it doesn't exist
  let recipientWallet = await Wallet.findOne({ user: recipientObjectId });
  if (!recipientWallet) {
    recipientWallet = new Wallet({ user: recipientObjectId, balance: 0 });
  }
  recipientWallet.balance += amount;
  await recipientWallet.save();

  // Create transaction record
  const transaction = new Transaction({
    sender: senderId,
    recipient: recipientObjectId, // Ensure this is stored as ObjectId
    transactionType: "transfer",
    amount,
    status: "completed",
    reference: `TXN-${Date.now()}`,
  });

  await transaction.save();

  return transaction;
};

// ✅ Money Request Functionality
export const requestMoneyService = async (requesterId, recipientId, amount, note) => {
  if (amount <= 0) throw new Error("Requested amount must be greater than zero");

  const moneyRequest = new MoneyRequest({
    requesterId: requesterId, // The person requesting the money
    recipientId: recipientId, // The person being asked to send money

    status: "pending",

    amount,
    transactionType: "request",

    reference: `REQ-${Date.now()}`,
    note,
  });

  await moneyRequest.save();

  // Update recipient's user model to include the money request
  await User.findByIdAndUpdate(recipientId, { $push: { moneyRequests: moneyRequest._id } });

  return moneyRequest;
};

/**
 * Fetch All Money Requests
 */
export const fetchAllMoneyRequests = async () => {
  try {
    const moneyRequests = await MoneyRequest.find();
    return moneyRequests;
  } catch (error) {
    throw new Error("Failed to fetch money requests");
  }
};

/**
 * Approve Money Request
 */
export const approveMoneyRequest = async (transactionId) => {
  try {
    const moneyRequest = await MoneyRequest.findById(transactionId);
    if (!moneyRequest) throw new Error("Money request not found");

    // Check if the requester has enough balance
    const user = await User.findById(moneyRequest.requesterId);
    const wallet = await Wallet.findOne({ user: user.id });

    if (!wallet || wallet.balance < moneyRequest.amount) {
      throw new Error("Insufficient funds for this transaction");
    }

    // Update the money request status to approved
    moneyRequest.status = "approved";
    await moneyRequest.save();

    return moneyRequest;
  } catch (error) {
    throw new Error("Failed to approve money request: " + error.message);
  }
};

// ✅ Get User Transaction History with Filters
export const getUserTransactions = async (userId, filters) => {
  const query = { $or: [{ sender: userId }, { recipient: userId }] };

  // Apply filters
  if (filters && Object.keys(filters).length > 0) {
    if (filters.startDate && filters.endDate) {
      query.createdAt = { $gte: new Date(filters.startDate), $lte: new Date(filters.endDate) };
    }

    if (filters.transactionType) {
      query.transactionType = filters.transactionType;
    }
  }

  const transactions = await Transaction.find(query).sort({ createdAt: -1 }); // Latest first
  return transactions;
};
