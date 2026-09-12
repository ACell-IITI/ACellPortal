import mongoose from 'mongoose';

const EmailQueueSchema = new mongoose.Schema({
    recipientEmail: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['mentor', 'mentee'],
    },
    channelName: {
        type: String,
    },
    inviteLink: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
    },
    retryCount: {
        type: Number,
        default: 0
    },
    nextRunAt: {
        type: Date,
        default: Date.now
    },
    lastError: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model('EmailQueue', EmailQueueSchema);
