import mongoose from 'mongoose';

const moneyRequestSchema = new mongoose.Schema({
    requesterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    recipientId: {

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
