const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const sendEmail = require('../services/sendEmail')
const jwt = require ('jsonwebtoken')

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

const normalizeUserRole = (value) => {
    const normalized = String(value ?? "customer").trim().toLowerCase();

    if (normalized === "admin" || normalized === "seller") {
        return "seller";
    }

    return "customer";
};

const registerUser = async (req, res) => {
    const payload = req.body || {};
    const userEmail = normalizeEmail(payload.userEmail || payload.email);
    const userPhoneNumber = String(payload.userPhoneNumber || payload.phoneNumber || payload.phone || "").trim();
    const userName = String(payload.userName || payload.name || payload.fullName || "").trim();
    const userPassword = payload.userPassword || payload.password;
    const userRole = normalizeUserRole(payload.userRole || payload.role);

    if (!userEmail || !userPhoneNumber || !userName || !userPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const emailExists = await User.findOne({ userEmail });
    if (emailExists) {
        return res.status(400).json({ message: "This email is already registered. Please login instead." });
    }

    const phoneExists = await User.findOne({ userPhoneNumber });
    if (phoneExists) {
        return res.status(400).json({ message: "This phone number is already registered. Please use another number." });
    }

    try {
        const newUser = await User.create({
            userEmail,
            userPhoneNumber,
            userName,
            userPassword: await bcrypt.hash(userPassword, 10),
            userRole
        });

        sendEmail({
            userEmail,
            subject: "Welcome to our E-commerce Platform",
            text: `Hi ${userName},\n\nThank you for registering on our e-commerce platform. We're excited to have you on board! If you have any questions or need assistance, feel free to reach out to our support team.\n\nBest regards,\nE-commerce Team`
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                _id: newUser._id,
                userName: newUser.userName,
                userEmail: newUser.userEmail,
                userPhoneNumber: newUser.userPhoneNumber,
                userRole: newUser.userRole
            }
        });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).json({
                message: "This email or phone number is already in use. Please choose different credentials."
            });
        }
        return res.status(500).json({ message: error.message || "Registration failed" });
    }
};

//login
const loginUser = async (req, res) => {
    const payload = req.body || {};
    const userEmail = normalizeEmail(payload.userEmail || payload.email);
    const userPassword = payload.userPassword || payload.password;

    if (!userEmail || !userPassword) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const existingUser = await User.findOne({ userEmail });
    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(userPassword, existingUser.userPassword);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({
        userId: existingUser._id,
        userRole: existingUser.userRole
    }, process.env.JWT_SECRET, {
        expiresIn: "30d"
    });

    return res.status(200).json({
        message: "User logged in successfully",
        token,
        user: {
            _id: existingUser._id,
            userName: existingUser.userName,
            userEmail: existingUser.userEmail,
            userPhoneNumber: existingUser.userPhoneNumber,
            userRole: existingUser.userRole
        }
    });
};


//forgot pass
const forgotPassword = async (req, res) => {
    const { userEmail } = req.body;
    if (!userEmail) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    const normalizedEmail = normalizeEmail(userEmail);
    const existingUser = await User.findOne({ userEmail: normalizedEmail });
    if (!existingUser) {
        return res.status(404).json({
            message: "User not found,Register first"
        });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    existingUser.otp = otp;
    existingUser.isOtpVerified = false;
    existingUser.isOtpVerifed = false;
    await existingUser.save();

    const option = {
        userEmail: normalizedEmail,
        subject: "Password Reset OTP",
        text: `Your OTP for password reset is ${otp}`
    };
    await sendEmail(option);

    return res.status(200).json({
        message: "OTP sent to email"
    });
};

// verify otp
const verifyOtp = async (req, res) => {
    const { userEmail, otp } = req.body;
    if (!userEmail || !otp) {
        return res.status(400).json({
            message: "Email and OTP are required"
        });
    }

    const normalizedEmail = normalizeEmail(userEmail);
    const existingUser = await User.findOne({ userEmail: normalizedEmail });
    if (!existingUser) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const isOtpValid = existingUser.otp === Number(otp);
    if (!isOtpValid) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }

    const otpExpiryTime = 10 * 60 * 1000;
    const otpGeneratedTime = existingUser.updatedAt ? existingUser.updatedAt.getTime() : Date.now();
    const diff = Date.now() - otpGeneratedTime;
    if (diff > otpExpiryTime) {
        existingUser.otp = null;
        existingUser.isOtpVerified = false;
        existingUser.isOtpVerifed = false;
        await existingUser.save();
        return res.status(400).json({
            message: "OTP expired, please generate a new one"
        });
    }

    existingUser.isOtpVerified = true;
    existingUser.isOtpVerifed = true;
    await existingUser.save();

    return res.status(200).json({
        message: "Otp verified succesfully, you can now reset your password"
    });
};

// reset password
const resetPassword = async (req, res) => {
    const { userEmail, newPassword, confirmPassword } = req.body;
    if (!userEmail || !newPassword || !confirmPassword) {
        return res.status(400).json({
            message: "Email, new password and confirm password are required"
        });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "New password and confirm password do not match"
        });
    }

    const normalizedEmail = normalizeEmail(userEmail);
    const existingUser = await User.findOne({ userEmail: normalizedEmail });
    if (!existingUser) {
        return res.status(404).json({
            message: "User not found"
        });
    }

    const otpVerified = existingUser.isOtpVerified || existingUser.isOtpVerifed;
    if (!otpVerified) {
        return res.status(400).json({
            message: "OTP not verified"
        });
    }

    const otpExpiryTime = 10 * 60 * 1000;
    const otpGeneratedTime = existingUser.updatedAt ? existingUser.updatedAt.getTime() : Date.now();
    const diff = Date.now() - otpGeneratedTime;
    if (diff > otpExpiryTime) {
        existingUser.isOtpVerified = false;
        existingUser.isOtpVerifed = false;
        existingUser.otp = null;
        await existingUser.save();
        return res.status(400).json({
            message: "OTP verification expired, please verify OTP again"
        });
    }

    existingUser.userPassword = await bcrypt.hash(newPassword, 10);
    existingUser.isOtpVerified = false;
    existingUser.isOtpVerifed = false;
    existingUser.otp = null;
    await existingUser.save();

    return res.status(200).json({
        message: "Password reset successfully"
    });
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword,
    verifyOtp,
    resetPassword,
    normalizeUserRole
}