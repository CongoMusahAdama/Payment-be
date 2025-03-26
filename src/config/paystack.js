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

export const verifyWithdrawalStatus = async (transferCode) => {
  try {
    const response = await axios.get(`https://api.paystack.co/transfer/${transferCode}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Withdrawal Status Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error verifying withdrawal status:", error.response?.data || error.message);
    throw new Error("Failed to verify withdrawal status");
  }
};



export const verifyWithdrawal = async (req, res) => {
  try {
    const { transfer_code, otp } = req.body;

    if (!transfer_code || !otp) {
      return res.status(400).json({ message: "Transfer code and OTP are required." });
    }

    const response = await axios.post(
      "https://api.paystack.co/transfer/finalize_transfer",
      {
        transfer_code,
        otp
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.data.status === true) {
      return res.status(200).json({
        message: "Withdrawal successful!",
        transfer_code: response.data.data.transfer_code
      });
    } else {
      return res.status(400).json({ message: "OTP verification failed. Please try again." });
    }

  } catch (error) {
    console.error("❌ Error verifying withdrawal:", error.response?.data || error.message);
    res.status(500).json({ message: "Withdrawal verification failed", error: error.message });
  }
};



export const createPaystackRecipient = async (user) => {
    try {
        const response = await axios.post(
            "https://api.paystack.co/transferrecipient",
            {
                type: "mobile_money",
                name: user.Fullname,
                account_number: user.phone, 
                bank_code: "MTN", 
                currency: "GHS",
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.data || !response.data.data) {
            throw new Error("Failed to create Paystack recipient");
        }

        console.log("✅ Paystack recipient created:", response.data.data);

        return response.data.data.recipient_code;
    } catch (error) {
        console.error("❌ Error creating Paystack recipient:", error.response?.data || error.message);
        throw new Error("Recipient creation failed");
    }
};
