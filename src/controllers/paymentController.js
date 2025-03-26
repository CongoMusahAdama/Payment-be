import {
  initiateDeposit,
  confirmDeposit,
  verifyWithdrawalStatus,
  handleWebhookUpdated,
  initiateWithdrawal,
} from "../services/paymentService.js";
import { createPaystackRecipient } from "../config/paystack.js"; 
import User from "../models/user.js";
import Wallet from "../models/wallet.js"; // Import Wallet model
import Transaction from "../models/transaction.js";
import crypto from "crypto";

/**
 * Deposit Funds
 */
export const depositFunds = async (req, res) => {
  try {
    console.log("📌 Received deposit request:", req.body);

    const { amount } = req.body;
    const user = req.user;

    console.log("📌 Authenticated user:", user); // Log user object for debugging

    if (!user || !user.email) {
      console.error("🚨 Error: User email is missing in depositFunds");
      return res.status(400).json({ message: "User email is required for payment" });
    }

    const url = await initiateDeposit(user, amount);

    // Check if the user's wallet exists, if not create one
    let wallet = await Wallet.findOne({ user: user.id });
    if (!wallet) {
      wallet = new Wallet({ user: user.id, balance: Number(amount) });
      await wallet.save();
    }

    return res.status(200).json({
      message: "Deposit initiated successfully",
      authorizationUrl: url, // This is where the user should be redirected
    });
  } catch (error) {
    console.error("🚨 Error processing deposit:", error);
    return res.status(500).json({ message: "Deposit failed" });
  }
};

/**
 * Verify Deposit
 */
export const verifyDeposit = async (req, res) => {
  try {
    const { reference } = req.query;
    if (!reference) throw new Error("Reference is required");

    const payment = await confirmDeposit(reference);
    res.status(200).json({ message: "Payment verified", payment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Handle Paystack Webhook
 */
export const handleWebhookController = async (req, res) => {
  console.log("📥 Raw request body:", req.body);

  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    const paystackSignature = req.headers["x-paystack-signature"];

    if (!paystackSecretKey) {
      console.error("❌ Paystack Secret Key is missing!");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    // ✅ Compute the expected signature
    const expectedSignature = crypto
      .createHmac("sha512", paystackSecretKey)
      .update(JSON.stringify(req.body))
      .digest("hex");

    // ✅ Compare Paystack signature with the calculated one
    if (paystackSignature !== expectedSignature) {
      console.error("❌ Invalid Paystack Signature! Possible unauthorized request.");
      return res.status(401).json({ message: "Unauthorized webhook" });
    }

    console.log("✅ Webhook Verified Successfully!");
    console.log("📌 Webhook Event:", req.body.event);

    // Call the updated handleWebhook function
    await handleWebhookUpdated(req, res);

    return res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("❌ Webhook Processing Error:", error);
    return res.status(400).json({ message: "Invalid webhook payload" });
  }
};

// Function to get user balance
export const getUserBalance = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: Missing user information" });
    }

    console.log("Fetching wallet for user ID:", req.user.id);

    // Find wallet associated with the user
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      console.log("Wallet not found for user ID:", req.user.id);
      return res.status(404).json({ message: "Wallet not found" });
    }

    console.log("User balance retrieved successfully:", wallet.balance);
    return res.status(200).json({ balance: wallet.balance });
  } catch (error) {
    console.error("Error fetching user balance:", error);
    return res.status(500).json({ message: "Unable to retrieve user balance" });
  }
};

/**
 * Request OTP for withdrawal
 */
export const requestOtp = async (req, res) => {
  try {
    console.log("🔍 Received OTP request from:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found in request" });
    }

    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid withdrawal request." });
    }

    // Check if the user exists in the database
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

    // Find user's wallet
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds or wallet not found" });
    }

    // **Step 1: Initiate Withdrawal**
    const withdrawalResponse = await initiateWithdrawal(recipientCode, amount, otp);




    if (withdrawalResponse.status === "otp") {
      return res.status(202).json({
        message: "OTP required for withdrawal. Please verify your Paystack OTP.",
        reference: withdrawalResponse.reference,
        transfer_code: withdrawalResponse.transfer_code,
      });
    }

    return res.status(200).json({ message: "Withdrawal initiated successfully", withdrawalResponse });
  } catch (error) {
    console.error("❌ OTP request processing failed:", error.message);
    res.status(500).json({ message: "OTP request failed", error: error.message });
  }
};

/**
 * Verify OTP for withdrawal
 */
export const verifyOtp = async (req, res) => {
  try {
    console.log("🔍 Received OTP verification request from:", req.user);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User not found in request" });
    }

    const { amount, otp } = req.body;
    if (!amount || amount <= 0 || !otp) {
      return res.status(400).json({ message: "Invalid verification request." });
    }

    // Check if the user exists in the database
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

    // Find user's wallet
    const wallet = await Wallet.findOne({ user: req.user.id });
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds or wallet not found" });
    }

    // **Step 2: Initiate Withdrawal**
    console.log("📤 Withdrawal request payload:", {
      recipient: recipientCode,
      amount: amount * 100, // Paystack expects the amount in kobo
      currency: "NGN",
      reason: "Withdrawal request",
      otp: req.body.otp, 
    });


    

    const withdrawalResponse = await initiateWithdrawal(req.user, recipientCode, amount, otp);





    // **Step 3: Verify Withdrawal**
    const statusResponse = await verifyWithdrawalStatus(withdrawalResponse.transfer_code);
    if (statusResponse.data.status !== "success") {
      return res.status(400).json({
        message: "Withdrawal failed. Please verify your OTP and try again.",
        status: statusResponse.data.status,
      });
    }

    // **Step 4: Update Transaction & Wallet**
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

    // **Step 5: Link Transaction to User**
    await User.findByIdAndUpdate(req.user.id, { $push: { transactions: transaction._id } });

    res.status(200).json({ message: "Withdrawal successful", balance: wallet.balance, transaction });
  } catch (error) {
    console.error("❌ OTP verification processing failed:", error.message);
    res.status(500).json({ message: "OTP verification failed", error: error.message });
  }
};
