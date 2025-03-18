import PDFDocument from "pdfkit";
import { Parser } from "json2csv";

// ✅ Generate PDF Report
export const generatePDFReport = (transactions, res) => {
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=transaction-report.pdf");

  doc.pipe(res);
  doc.fontSize(16).text("Transaction Report", { align: "center" });

  transactions.forEach((tx, index) => {
    doc.fontSize(12).text(`${index + 1}. ${tx.transactionType.toUpperCase()} - $${tx.amount}`, { continued: true });
    doc.text(` Status: ${tx.status}`, { align: "right" });
  });

  doc.end();
};

// ✅ Generate CSV Report
export const generateCSVReport = (transactions, res) => {
  const fields = ["sender", "recipient", "amount", "transactionType", "status", "createdAt"];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(transactions);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=transaction-report.csv");

  res.status(200).end(csv);
};
