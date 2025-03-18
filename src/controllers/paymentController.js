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

export const handleWebhook = async (req, res) => {
  try {
    const event = req.body; // Get the webhook event from the request body

    // Check the event type
    if (event.event === "charge.success") {
      const payment = await Payment.findOne({ reference: event.data.reference });
      if (payment) {
        payment.status = "successful";
        await payment.save();

        // Optionally, credit the user's wallet here
        const wallet = await Wallet.findOne({ user: payment.user });
        wallet.balance += payment.amount;
        await wallet.save();
      }
    }

    res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Webhook handling error:", error);
    res.status(400).json({ message: "Invalid webhook payload" });
  }
};


export const withdrawFunds = async (req, res) => {
  try {
    const { recipientCode, amount } = req.body;
    const withdrawal = await initiateWithdrawal(req.user, recipientCode, amount);

    res.status(200).json({ message: "Withdrawal initiated", withdrawal });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
