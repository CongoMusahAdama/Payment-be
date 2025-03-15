import mongoose from 'mongoose';

const moneyRequestSchema = new mongoose.Schema({
    requester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending',
    },
    note: {
         type: String 
        },
}, { timestamps: true });

const MoneyRequest = mongoose.model('MoneyRequest', moneyRequestSchema);
export default MoneyRequest;
