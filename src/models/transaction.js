import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    transactionType: { 
        type: String,
        enum: ["transfer", "withdrawal"],
         required: true 
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String, 
        enum: ["Pending", "completed", "failed"], 
        default: "pending" 
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

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
