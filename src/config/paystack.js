import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = "https://api.paystack.co";

// Function to initialize a payment
export const initializePayment = async (email, amount, callbackUrl) => {
  try {
    console.log("Initializing payment for amount:", amount);
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: amount * 100, // Convert amount to kobo (Paystack requires smallest currency unit)
        callback_url: callbackUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Payment initialized successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Paystack error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Payment initialization failed");
  }
};

export const verifyPayment = async (reference) => {
  try {
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("📌 Paystack Verification Response:", response.data); // Log full response

    return response.data; // Ensure this returns data correctly
  } catch (error) {
    console.error("🚨 Paystack Verification Error:", error.response?.data || error.message);
    throw new Error("Payment verification failed");
  }
};

//Initiate Deposit
export const initiateDeposit = async (user, amount) => {
  if (!user || !user.email) throw new Error("User email is required for payment");

  console.log("User Email:", user.email);
  return initializePayment(user.email, amount, "http://localhost:3000/payment-success");
};

// Function to process withdrawals
export const processWithdrawal = async (recipientCode, amount) => {
  try {
    const response = await axios.post(
      `${process.env.PAYSTACK_BASE_URL}/transfer`,
      {
        source: "balance",
        reason: "Withdrawal",
        amount: amount * 100, // Convert to kobo
        recipient: recipientCode,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Paystack Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Paystack Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Withdrawal failed");
  }
};
