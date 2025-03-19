import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: { 
        type: String, 
        enum: ["credit card", "momo wallet", "paystack"], 
        required: true
     },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
        required: false,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    reference: { 
        type: String,
         unique: true, 
         required: true 
    },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
