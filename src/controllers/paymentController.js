import { initiateDeposit, confirmDeposit, initiateWithdrawal } from "../services/paymentService.js";

// Initiate Deposit
export const depositFunds = async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentLink = await initiateDeposit(req.user, amount);

    res.status(200).json({ message: "Payment initiated", paymentLink });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Verify Deposit
export const verifyDeposit = async (req, res) => {
  try {
    const { reference } = req.query;
    const payment = await confirmDeposit(reference);

    res.status(200).json({ message: "Payment verified", payment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  Initiate Withdrawal
export const withdrawFunds = async (req, res) => {
  try {
    const { recipientCode, amount } = req.body;
    const withdrawal = await initiateWithdrawal(req.user, recipientCode, amount);

    res.status(200).json({ message: "Withdrawal initiated", withdrawal });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
