import { initializePayment, verifyPayment, PAYSTACK_BASE_URL } from "../config/paystack.js";


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




//initiate withdrawal
export const initiateWithdrawal = async (user, recipientCode, amount, otp) => {
  try {
    const validAmount = Number(amount);
    if (isNaN(validAmount) || validAmount <= 0) {
      throw new Error("Invalid withdrawal amount");
    }

    console.log("📤 Sending withdrawal request to Paystack:", {
      recipient: recipientCode,
      amount: validAmount * 100, // Convert to kobo
      currency: "NGN",
      reason: "Withdrawal request",
      ...(otp && { otp }), // Include OTP if provided
    });

    const response = await axios.post(`${PAYSTACK_BASE_URL}/transfer`, {
      recipient: recipientCode,
      amount: validAmount * 100, 
      currency: "NGN",
      reason: "Withdrawal request",
      ...(otp && { otp }),
    });

    // Log the withdrawal request payload for debugging
    console.log("📤 Withdrawal request payload:", {
      recipient: recipientCode,
      amount: validAmount * 100, 
      currency: "NGN",
      reason: "Withdrawal request",
      ...(otp && { otp }),
    });

    if (!response.data || response.data.status !== true) {
      console.error("❌ Paystack API Response Error:", response.data);
      throw new Error(response.data.message || "Failed to initiate withdrawal");
    }

    console.log("✅ Withdrawal initiated successfully:", response.data.data);
    return response.data.data;

  } catch (error) {
    console.error("🚨 Error initiating withdrawal:", error.response?.data || error.message);

    // Return specific error message from Paystack
    throw new Error(error.response?.data?.message || "Withdrawal initiation failed");
  }
};
