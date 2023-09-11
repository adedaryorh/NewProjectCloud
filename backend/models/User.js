const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
    },
    isActivated: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = User = mongoose.model('users', userSchema);