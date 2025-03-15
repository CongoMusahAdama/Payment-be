import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
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
    wallet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
    }],
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
