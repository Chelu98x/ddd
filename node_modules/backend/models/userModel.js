const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    userPhoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true
    },
    userPassword: {
        type: String,
        required: true
    },
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        default: []
    }],
    userRole: {
        type: String,
        enum: [ 'customer', 'seller'],
        default: 'customer'
    },
    otp: {
        type: Number,
        default: null
    },
    isOtpVerified: {
        type: Boolean,
        default: false
    },
    isOtpVerifed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

const User = mongoose.model('user', userSchema);

module.exports = User;