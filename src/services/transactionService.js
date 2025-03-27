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

/**
 * Get User Transactions
 */
export const getUserTransactions = async (userId) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { recipient: userId }],
    }).sort({ createdAt: -1 }); // Sort by latest transactions

    return transactions;
  } catch (error) {
    throw new Error("Failed to fetch user transactions: " + error.message);
  }
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
 Approve Money Request
**/
export const approveMoneyRequest = async (requestId) => {
 try {
   const moneyRequest = await MoneyRequest.findById(requestId);
   if (!moneyRequest) throw new Error("Money request not found");

   // Ensure the money request is still pending
   if (moneyRequest.status !== "pending") {
     throw new Error("Money request is already processed");
   }

   // Find sender and check balance
   const senderWallet = await Wallet.findOne({ user: moneyRequest.sender });
   if (!senderWallet || senderWallet.balance < moneyRequest.amount) {
     throw new Error("Insufficient funds for this transaction");
   }

   // Deduct from sender's wallet
   senderWallet.balance -= moneyRequest.amount;
   await senderWallet.save();

   // Credit recipient's wallet
   const recipientWallet = await Wallet.findOne({ user: moneyRequest.requester });
   if (!recipientWallet) {
     throw new Error("Recipient wallet not found");
   }
   recipientWallet.balance += moneyRequest.amount;
   await recipientWallet.save();

   // Create transaction record
   const transaction = new Transaction({
     sender: moneyRequest.sender,
     recipient: moneyRequest.requester,
     amount: moneyRequest.amount,
     transactionType: "transfer",
     status: "completed",
     reference: `REQ-${requestId}`,
   });
   await transaction.save();

   // Update money request status
   moneyRequest.status = "approved";
   moneyRequest.transactionId = transaction._id; // Link transaction
   await moneyRequest.save();

   return moneyRequest;
 } catch (error) {
   throw new Error("Failed to approve money request: " + error.message);
 }
};
