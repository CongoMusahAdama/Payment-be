import { initializePayment, verifyPayment, createPaystackRecipient } from "../config/paystack.js";

import Payment from "../models/payment.js";
import Wallet from "../models/wallet.js";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import axios from "axios";

/**
 * Verify Withdrawal Status
 */
export const verifyWithdrawalStatus = async (transferCode) => {
  try {
    const response = await axios.get(`https://api.paystack.co/transfer/${transferCode}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    if (!response.data || response.data.status !== true) {
      throw new Error("Failed to verify withdrawal status");
    }

    return response.data.data; // Returns the withdrawal status data
  } catch (error) {
    console.error("🚨 Error verifying withdrawal:", error.message);
    throw new Error("Withdrawal verification failed");
  }
};

/**
 * Initiate Deposit via Paystack
 */
export const initiateDeposit = async (user, amount) => {
  try {
    const callbackUrl = process.env.PAYSTACK_CALLBACK_URL || "http://localhost:5173/payment-success";

    console.log("📌 Initiating payment with:", { email: user.email, amount, callbackUrl });

    const response = await initializePayment(user.email, amount, callbackUrl);

    if (!response || !response.data) {
      throw new Error("Failed to initialize payment with Paystack");
    }

    console.log("📌 Paystack API Response:", response?.data);

    // **STEP 1: Save Payment Record**
    const newPayment = new Payment({
      user: user._id,
      amount,
      paymentMethod: "paystack",
      status: "pending",
      reference: response.data.reference,
    });

    await newPayment.save();

    return response.data.authorization_url;
  } catch (error) {
    console.error("🚨 Error initiating deposit:", error);
    throw new Error("Payment initiation failed");
  }
};

/**
 * Confirm Deposit & Credit Wallet
 */
export const confirmDeposit = async (reference) => {
  try {
    console.log("🔍 Verifying payment with reference:", reference);

    const response = await verifyPayment(reference);
    console.log("📌 Full Paystack Response:", response);

    if (!response || !response.status || response.message !== "Verification successful") {
      throw new Error(`Payment verification failed: ${response?.message || "Unknown error"}`);
    }

    const payment = await Payment.findOne({ reference });
    if (!payment) throw new Error("Payment record not found");

    if (payment.status === "completed") {
      console.log("🚀 Payment already processed, skipping...");
      return payment;
    }

    // ✅ Update Payment Status
    payment.status = "completed";
    await payment.save();

    // ✅ Find Wallet
    let wallet = await Wallet.findOne({ user: payment.user });

    if (!wallet) {
      wallet = new Wallet({ user: payment.user, balance: 0 });
      await wallet.save();
    }

    // ✅ Credit Wallet
    wallet.balance += payment.amount;
    await wallet.save();

    // ✅ Create a Transaction Record
    const transaction = new Transaction({
      sender: payment.user,
      recipient: payment.user,
      amount: payment.amount,
      transactionType: "deposit",
      status: "completed",
      reference: payment.reference,
    });

    await transaction.save();

    // ✅ Link Transaction to User & Wallet
    await User.findByIdAndUpdate(payment.user, { $push: { transactions: transaction._id } });
    await Wallet.findOneAndUpdate({ user: payment.user }, { $push: { transactions: transaction._id } });

    console.log(`✅ Payment confirmed and wallet credited. New Balance: ${wallet.balance}`);
    return payment;
  } catch (error) {
    console.error("❌ Error confirming deposit:", error.message);
    throw new Error("Deposit verification failed");
  }
};

/**
 * Handle Webhook Updates
 */
export const handleWebhookUpdated = async (req, res) => {
  const webhookData = req.body;

  // Log the webhook data for debugging
  console.log("Received webhook update:", webhookData);

  // Process the webhook data (this will depend on the structure of the data)
  // Example: Update payment status based on the webhook event
  if (webhookData.event === "charge.success") {
    const payment = await Payment.findOne({ reference: webhookData.data.reference });
    if (payment) {
      payment.status = "completed";
      await payment.save();
      console.log("Payment status updated to completed for reference:", webhookData.data.reference);
    }
  }

  // Respond to the webhook
  res.status(200).send("Webhook received");
};

/**
 * Initiate Withdrawal via Paystack
 */
export const initiateWithdrawal = async (user, recipientCode, amount, otp) => {
  try {
    console.log("📤 Withdrawal request payload:", {
      recipient: recipientCode,
      amount: amount * 100, // Paystack expects the amount in kobo
      currency: "NGN",
      reason: "Withdrawal request",
      otp: otp, // Include OTP if required
    });

    const response = await axios.post("https://api.paystack.co/transfer", { 

      recipient: recipientCode,
      amount: amount * 100, // Paystack expects the amount in kobo
      currency: "NGN",
      reason: "Withdrawal request",
      otp: otp, // Include OTP if required
    }, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    if (!response.data || response.data.status !== true) {
      throw new Error("Failed to initiate withdrawal");
    }

    return response.data.data; // Returns the withdrawal response data
  } catch (error) {
    console.error("🚨 Error initiating withdrawal:", error.message);
    throw new Error("Withdrawal initiation failed");
  }
};

export const withdrawFunds = async (req, res) => {
  try {
    console.log("🔍 Received withdrawal request from:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found in request" });
    }

    const { amount, otp } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdrawal request." });
    }

    // Check if the user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found in database" });
    }

    console.log("✅ User verified:", user);

    // **Step 1: Ensure user has a Paystack recipientCode**
    let recipientCode = user.recipientCode;
    
    if (!recipientCode) {
      console.log("🔍 No recipientCode found, creating a new one...");
      recipientCode = await createPaystackRecipient(user);

      // Save the new recipientCode in the user profile
      user.recipientCode = recipientCode;
      await user.save();
    }

    console.log("✅ Using recipientCode:", recipientCode);

    // **Step 2: Find User's Wallet**
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds or wallet not found" });
    }

    // **Step 3: Initiate Withdrawal**
    const withdrawalResponse = await initiateWithdrawal(req.user, recipientCode, amount, otp);

    if (withdrawalResponse.status === "otp") {
      return res.status(202).json({
        message: "OTP required for withdrawal. Please verify your Paystack OTP.",
        reference: withdrawalResponse.reference,
        transfer_code: withdrawalResponse.transfer_code,
      });
    }

    // **Step 4: Verify Withdrawal**
    const statusResponse = await verifyWithdrawalStatus(withdrawalResponse.transfer_code);
    if (statusResponse.data.status !== "success") {
      return res.status(400).json({
        message: "Withdrawal failed. Please verify your OTP and try again.",
        status: statusResponse.data.status,
      });
    }

    // **Step 5: Update Transaction & Wallet**
    const transaction = new Transaction({
      sender: req.user.id,
      recipient: recipientCode,
      amount,
      transactionType: "withdrawal",
      status: "completed",
      reference: withdrawalResponse.reference,
    });

    await transaction.save();
    wallet.balance -= amount;
    await wallet.save();

    // **Step 6: Link Transaction to User**
    await User.findByIdAndUpdate(req.user.id, { $push: { transactions: transaction._id } });

    res.status(200).json({ message: "Withdrawal successful", balance: wallet.balance, transaction });

  } catch (error) {
    console.error("❌ Withdrawal processing failed:", error.message);
    res.status(500).json({ message: "Withdrawal failed", error: error.message });
  }
};
