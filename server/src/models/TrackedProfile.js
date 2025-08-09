const mongoose = require('mongoose');

const trackedProfileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    notificationEmail: {
        type: String,
        required: true,
        trim: true
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    followingCount: {
        type: Number,
        default: 0
    },
    baselineFollowing: [{
        type: String,
        trim: true
    }],
    lastChecked: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('TrackedProfile', trackedProfileSchema); 