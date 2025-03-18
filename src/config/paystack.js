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

    console.log("Payment response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error initializing payment:", error.response ? error.response.data : error.message);
    throw new Error("Payment initialization failed");
  }
};

// Function to verify a payment
export const verifyPayment = async (reference) => {
  const response = await axios.get(
    `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return response.data;
};

// Function to process withdrawals
export const processWithdrawal = async (recipientCode, amount) => {
  const response = await axios.post(
    `${PAYSTACK_BASE_URL}/transfer`,
    {
      source: "balance",
      reason: "Withdrawal",
      amount: amount * 100, // Convert to kobo
      recipient: recipientCode,
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return response.data;
};
