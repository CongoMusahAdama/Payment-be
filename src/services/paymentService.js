import { initializePayment, verifyPayment, processWithdrawal } from "../config/paystack.js";
import Payment from "../models/payment.js";
import Wallet from "../models/wallet.js";

/**
 * Initiate Deposit via Paystack
 */
export const initiateDeposit = async (user, amount) => {
  try {
    const callbackUrl = process.env.PAYSTACK_CALLBACK_URL || "http://localhost:3000/payment-success";

    console.log("📌 Initiating payment with:", {
      email: user.email,
      amount,
      callbackUrl,
    });

    const response = await initializePayment(user.email, amount, callbackUrl);

    console.log("📌 Paystack API Response:", response?.data);

    if (!response || !response.data) {
      throw new Error("Failed to initialize payment with Paystack");
    }

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
 */export const confirmDeposit = async (reference) => {
  try {
    console.log("🔍 Verifying payment with reference:", reference);

    const response = await verifyPayment(reference);

    console.log("📌 Full Paystack Response:", response); 
    
    if (!response || !response.status || response.message !== "Verification successful") {
      console.error("❌ Paystack verification failed:", response);
      throw new Error(`Payment verification failed: ${response?.message || "Unknown error"}`);
    }
    

    const payment = await Payment.findOne({ reference });
    if (!payment) throw new Error("Payment record not found");

    if (payment.status === "successful") {
      console.log("🚀 Payment already processed, skipping...");
      return payment; // Prevent double crediting
    }

    // ✅ Update Payment Status
    payment.status = "successful";
    await payment.save();

    // ✅ Credit User Wallet
    const wallet = await Wallet.findOne({ user: payment.user });
    if (wallet) {
      wallet.balance += payment.amount;
      await wallet.save();
    }

    console.log("✅ Payment confirmed and wallet credited.");
    return payment;
  } catch (error) {
    console.error("❌ Error confirming deposit:", error.message);
    throw new Error("Deposit verification failed");
  }
};


/**
 * Handle Paystack Webhooks Securely
 */
export const handleWebhook = async (event) => {
  try {
    console.log("Received Webhook Event:", event.event);

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
    console.error("Error handling webhook:", error);
  }
};

/**
 * Process Withdrawals
 */
export const initiateWithdrawal = async (user, recipientCode, amount) => {
  try {
    const wallet = await Wallet.findOne({ user: user._id });

    if (!wallet || wallet.balance < amount) throw new Error("Insufficient balance");

    const response = await processWithdrawal(recipientCode, amount);
    if (!response || !response.data) throw new Error("Failed to process withdrawal");

    wallet.balance -= amount;
    await wallet.save();

    return response.data;
  } catch (error) {
    console.error("Error initiating withdrawal:", error);
    throw new Error("Withdrawal process failed");
  }
};
