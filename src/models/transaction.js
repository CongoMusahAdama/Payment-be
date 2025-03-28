import mongoose from 'mongoose';
import User from './user.js';  // Import User model

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.Mixed, // ✅ Allows both ObjectId and String
        required: true,
    },
    transactionType: { 
        type: String,
        enum: ["deposit", "transfer", "withdrawal", "request"],
        required: true 
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String, 
        enum: ["pending", "completed", "failed", "otp"], 
        default: "pending" 
    },

    transfer_code: {
        type: String,
        required: true,
    },
    reference: {


        type: String,
        unique: true,
        required: true
    },
    note: {
         type: String 
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
    },
}, { timestamps: true });

// ✅ Mongoose Middleware: Update User Model on Transaction Save
transactionSchema.post('save', async function (doc, next) {
    try {
        // Update sender's transaction history
        await User.findByIdAndUpdate(doc.sender, { $push: { transactions: doc._id } });

        // Update recipient's transaction history (except for withdrawals)
        if (doc.transactionType !== 'withdrawal') {
            await User.findByIdAndUpdate(doc.recipient, { $push: { transactions: doc._id } });
        }

        next();
    } catch (error) {
        console.error('Error updating user transactions:', error);
        next(error);
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
