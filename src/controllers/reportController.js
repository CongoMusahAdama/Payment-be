import { getUserTransactions } from "../services/transactionService.js";
import { generatePDFReport, generateCSVReport } from "../services/reportService.js";

// ✅ Download PDF or CSV Report
export const downloadTransactionReport = async (req, res) => {
  try {
    const userId = req.user._id;
    const filters = req.query;

    const transactions = await getUserTransactions(userId, filters);
    if (!transactions.length) throw new Error("No transactions found");

    const format = req.query.format || "pdf";
    if (format === "csv") {
      return generateCSVReport(transactions, res);
    }

    return generatePDFReport(transactions, res);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
