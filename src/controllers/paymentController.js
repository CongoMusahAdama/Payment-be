import { initiateDeposit, confirmDeposit, initiateWithdrawal, handleWebhook } from "../services/paymentService.js";
import User from "../models/user.js";
import crypto from "crypto";

/**
 * Deposit Funds
 */
export const depositFunds = async (req, res) => {
  try {
      console.log("📌 Received deposit request:", req.body);
      
      const { amount } = req.body;
      const user = req.user;

      console.log("📌 Authenticated user:", user);

      if (!user || !user.email) {
          console.error("🚨 Error: User email is missing in depositFunds");
          return res.status(400).json({ message: "User email is required for payment" });
      }

      const { reference, authorizationUrl } = await initiateDeposit(user, amount);

      return res.status(200).json({
          message: "Deposit initiated successfully",
          reference,
          authorizationUrl, // This is where the user should be redirected
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

  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY; // Load secret key from env
    const paystackSignature = req.headers["x-paystack-signature"]; // Extract signature
    const requestBody = JSON.stringify(req.body); // Get raw request body

    // ✅ Compute the expected signature
    const expectedSignature = crypto
      .createHmac("sha512", paystackSecretKey)
      .update(requestBody)
      .digest("hex");

    // ✅ Compare Paystack signature with the calculated one
    if (paystackSignature !== expectedSignature) {
      console.log("❌ Invalid Paystack Signature! Possible unauthorized request.");
      return res.status(401).json({ message: "Unauthorized webhook" });
    }

    console.log("✅ Webhook Verified Successfully!");
    console.log("📌 Webhook Event:", req.body);

    // ✅ Process the webhook event (existing logic)
    await handleWebhookController(req.body);


    return res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("❌ Webhook Processing Error:", error);
    return res.status(400).json({ message: "Invalid webhook payload" });
  }
};

/**
 * Withdraw Funds
 */
export const withdrawFunds = async (req, res) => {
  try {
    const { recipientCode, amount } = req.body;
    if (!recipientCode || !amount || amount <= 0) throw new Error("Invalid withdrawal request");

    const withdrawal = await initiateWithdrawal(req.user, recipientCode, amount);
    res.status(200).json({ message: "Withdrawal initiated", withdrawal });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
