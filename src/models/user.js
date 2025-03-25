import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    Fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: { 
        type: String, 
        enum: ["user", "admin"], 
        default: "user"
     },
     phone: { 
        type: String, 
        unique: true, 
        required: true 
    },
     address: { 
        type: String, 
        unique: true, 
        required: true 
    },
    recipientCode: { 
        type: String, 
        default: null // Store Paystack recipient code
    },
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
    }],
    kycDocument: { 
        type: String 
    },
    moneyRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MoneyRequest',
    }],
    payments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
    }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
