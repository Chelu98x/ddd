const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const sendEmail = require('../services/sendEmail')
const jwt = require ('jsonwebtoken')

const registerUser = async (req, res) => {
    const { userEmail, userPhoneNumber, userName, userPassword } = req.body;
    if (!userEmail || !userPhoneNumber || !userName || !userPassword) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    const existingUser = await User.findOne({
        userEmail
    })

    if (existingUser) {
        return res.status(400).json({
            message: "User already exists! Try login instead"
        })
    }

    await User.create({
        userEmail,
        userPhoneNumber,
        userName,
        userPassword: await bcrypt.hash(userPassword, 10)
    })

    sendEmail({
        userEmail,
        subject: "Welcome to our E-commerce Platform",
        text: `Hi ${userName},\n\nThank you for registering on our e-commerce platform. We're excited to have you on board! If you have any questions or need assistance, feel free to reach out to our support team.\n\nBest regards,\nE-commerce Team`
    })

    return res.status(201).json({
        message: "User registered successfully"
    })
}

//login
const loginUser = async (req, res) => {
    const { userEmail, userPassword } = req.body;

    const existingUser = await User.findOne({
        userEmail
    })

    if (!existingUser) {
        return res.status(404).json({
            message: "User not found"
        })
    }
    const isPasswordValid = await bcrypt.compare(userPassword, existingUser.userPassword)
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid password"
        })
    }
    const token = jwt.sign ({
        userId:existingUser._id
    }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    })
return res.status(200).json({
    message: "User logged in successfully",
    token: token
})
}


//forgot pass
const forgotPassword = async (req, res) => {
    const { userEmail } = req.body;
    if (!userEmail) {
        return res.status(400).json({
            message: "Email is required"
        })
    }
    const existingUser = await User.findOne({
        userEmail
    })
    if (!existingUser) {
        return res.status(404).json({
            message: "User not found,Register first"
        })
    }
    const otp = Math.floor(100000 + Math.random() * 900000)


    existingUser.otp = otp
    await existingUser.save()


    const option = {
        userEmail,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is ${otp}`
    }
    await sendEmail(option);

    return res.status(200).json({
        message: "OTP sent to email"
    })
}


// verify otp
const verifyOtp = async (req, res) => {
    const { userEmail, otp, newPassword } = req.body;
    if(!userEmail || !otp || !newPassword) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    const existingUser = await User.findOne({
        userEmail
    })

    if (!existingUser) {
        return res.status(404).json({
            message: "User not found"
        })
    }
        const isOtpValid = existingUser.otp === parseInt(otp)
    if (!isOtpValid) {
        return res.status(400).json({
            message: "Invalid OTP"
        })
    }

    const otpExpiryTime = 10 * 60 * 1000; // 10 minutes
    const currentTime = Date.now();
    const otpGeneratedTime = existingUser.updatedAt.getTime();
    const diff = currentTime - otpGeneratedTime;
    if (diff > otpExpiryTime) {
        return res.status(400).json({
            message: "OTP expired, please generate a new one"
        })
    }

    return res.status(200).json({
        message: "Otp verified succesfully, you can now reset your password"
    })
}


// reset password
const resetPassword = async (req, res) => {
    const { userEmail, newPassword, confirmPassword } = req.body;
    if (!userEmail || !newPassword || !confirmPassword) {
        return res.status(400).json({
            message: "Email, new password and confirm password are required"
        })
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "New password and confirm password do not match"
        })
    }
    const existingUser = await User.findOne({
        userEmail
    })
    if (!existingUser) {
        return res.status(404).json({
            message: "User not found"
        })
    }
    if (!existingUser.isOtpVerifed){
        return res.status(400).json({
            message: "OTP not verified"
        })
    }


    const optVerificationTime = 10 * 60 * 1000; // 10 minutes
    const currentTime = Date.now();
    const otpGeneratedTime = existingUser.updatedAt.getTime();
    const diff = currentTime - otpGeneratedTime;
    const passwordResetExpiryTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (diff > optVerificationTime) {
       existingUser.isOtpVerifed = false;
         await existingUser.save();



         return res.statuss (400).json({
            message: "OTP verification expired, please verify OTP again"
        })
    }
    existingUser.userPassword = await bcrypt.hash(newPassword, 10)
    existingUser.isOtpVerifed = false;
    await existingUser.save()



    return res.status(200).json({
        message: "Password reset successfully"
    })
}

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    verifyOtp,
    resetPassword
}