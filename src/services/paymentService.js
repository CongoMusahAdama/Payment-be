import { initializePayment, verifyPayment, processWithdrawal } from "../config/paystack.js";

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
 * Process Withdrawals
 */
export const initiateWithdrawal = async (user, recipientCode, amount) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (!amount || amount <= 0) throw new Error("Invalid withdrawal amount");

    // **Step 1: Find Wallet**
    const wallet = await Wallet.findOne({ user: user._id }).session(session);
    if (!wallet) throw new Error("Wallet not found");
    if (wallet.balance < amount) throw new Error("Insufficient balance");

    // **Step 2: Call Paystack Withdrawal API**
    const withdrawalResponse = await processWithdrawal(recipientCode, amount);

    if (!withdrawalResponse || !withdrawalResponse.data) {
      throw new Error("Failed to process withdrawal");
    }

    if (withdrawalResponse.data.status === "otp") {
      return {
        message: "OTP required for withdrawal. Please verify your Paystack OTP.",
        reference: withdrawalResponse.data.reference,
        transfer_code: withdrawalResponse.data.transfer_code,
      };
    }

    // **Step 3: Verify Withdrawal Status**
    const statusResponse = await verifyWithdrawalStatus(withdrawalResponse.data.transfer_code);

    if (statusResponse.status !== "success") {
      throw new Error("Withdrawal verification failed. Please verify your OTP and try again.");
    }

    // **Step 4: Deduct Balance from Wallet**
    wallet.balance -= amount;
    await wallet.save({ session });

    // **Step 5: Create Transaction Record**
    const transaction = new Transaction({
      sender: user._id,
      recipient: recipientCode,
      amount,
      transactionType: "withdrawal",
      status: "completed",
      reference: withdrawalResponse.data.reference,
    });

    await transaction.save({ session });

    // **Step 6: Link Transaction to User & Wallet**
    await User.findByIdAndUpdate(user._id, { $push: { transactions: transaction._id } }, { session });
    await Wallet.findOneAndUpdate({ user: user._id }, { $push: { transactions: transaction._id } }, { session });

    // **Step 7: Commit the Transaction**
    await session.commitTransaction();
    session.endSession();

    return {
      message: "Withdrawal successful",
      updatedBalance: wallet.balance,
      transaction,
    };
  } catch (error) {
    console.error("❌ Error initiating withdrawal:", error.message);

    // **Rollback Transaction on Error**
    await session.abortTransaction();
    session.endSession();

    throw new Error(error.message || "Withdrawal process failed");
  }
};

export const handleWebhookUpdated = async (event) => {
  try {
    console.log("🔔 Webhook Event Received:", event.event);

    if (event.event !== "charge.success") return;

    const payment = await Payment.findOne({ reference: event.data.reference });
    if (payment && payment.status !== "successful") {
      payment.status = "successful";
      await payment.save();

      const wallet = await Wallet.findOne({ user: payment.user });
      if (wallet) {
        wallet.balance += payment.amount;
        await wallet.save();
      }
    }
  } catch (error) {
    console.error("🚨 Error handling webhook:", error);
  }
};
