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
 */
export const confirmDeposit = async (reference) => {
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

    if (payment.status === "completed") {
      console.log("🚀 Payment already processed, skipping...");
      return payment;
    }

    // ✅ Update Payment Status
    payment.status = "completed";
    await payment.save();

    // ✅ Find or Create Wallet
    let wallet = await Wallet.findOne({ user: payment.user });
    
    if (!wallet) {
      console.log("🆕 No wallet found, creating a new one...");
      wallet = new Wallet({
        user: payment.user,
        balance: 0, // Start from zero
      });
    }

    // ✅ Credit Wallet
    wallet.balance += payment.amount;
    await wallet.save();

    console.log(`✅ Payment confirmed and wallet credited. New Balance: ${wallet.balance}`);
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
 * Get User Profile
 */
export const getUserProfile = async (user) => {
  try {
    const wallet = await Wallet.findOne({ user: user._id });
    if (!wallet) throw new Error("Wallet not found");
    return { balance: wallet.balance }; // Return the user's balance
  } catch (error) {
    throw new Error("Unable to retrieve user profile");
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

    const wallet = await Wallet.findOne({ user: user._id }).session(session);
    if (!wallet) throw new Error("Wallet not found");
    if (wallet.balance < amount) throw new Error("Insufficient balance");

    // Call external withdrawal API
    const response = await processWithdrawal(recipientCode, amount);

    if (!response || !response.data) {
      console.error("Withdrawal API response error:", response);
      throw new Error("Failed to process withdrawal");
    }

    if (response.data.status !== "success") {
      console.error("Withdrawal failed:", response.data);
      throw new Error(response.data.message || "Withdrawal processing error");
    }

    // Deduct balance only if API call was successful
    wallet.balance -= amount;
    await wallet.save({ session });

    // Commit transaction (finalize changes)
    await session.commitTransaction();
    session.endSession();

    return response.data;
  } catch (error) {
    console.error("Error initiating withdrawal:", error.message);
    
    // Abort transaction in case of failure
    await session.abortTransaction();
    session.endSession();

    throw new Error(error.message || "Withdrawal process failed");
  }
};
