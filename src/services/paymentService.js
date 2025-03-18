import { initializePayment, verifyPayment, processWithdrawal } from "../config/paystack.js";
import Payment from "../models/payment.js";
import Wallet from "../models/wallet.js";

// Initialize Deposit Payment
export const initiateDeposit = async (user, amount) => {
  const callbackUrl = "http://localhost:3000/payment-success"; // Update this in production

  console.log("Initializing payment for amount:", amount);
console.log("User object:", user); // Log the user object
console.log("User email:", user.email); // Log the email being used
const response = await initializePayment(user.email, amount, callbackUrl);








console.log("Payment response:", response);
const newPayment = new Payment({





    user: user._id,
    amount,
    paymentMethod: "paystack",
    status: "pending",
    reference: response.data.reference,
  });

  await newPayment.save();

  return response.data.authorization_url; // Return the Paystack payment link
};

// Verify Payment and Credit User Wallet
export const confirmDeposit = async (reference) => {
console.log("Verifying payment with reference:", reference); // Log the reference being used
const response = await verifyPayment(reference);


  if (response.data.status !== "success") throw new Error("Payment verification failed");

  const payment = await Payment.findOne({ reference });
  if (!payment) throw new Error("Payment record not found");

  payment.status = "successful";
  await payment.save();

  // Credit user wallet
  const wallet = await Wallet.findOne({ user: payment.user });
  wallet.balance += payment.amount;
  await wallet.save();

  return payment;
};

// Process Withdrawals
export const initiateWithdrawal = async (user, recipientCode, amount) => {
  const wallet = await Wallet.findOne({ user: user._id });

  if (wallet.balance < amount) throw new Error("Insufficient balance");

  const response = await processWithdrawal(recipientCode, amount);

  wallet.balance -= amount;
  await wallet.save();

  return response.data;
};
