// DB Connection code goes here
const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const ADMIN_PHONE_NUMBER = process.env.ADMIN_PHONE_NUMBER || "000000000000000";

const ensureAdminUser = async () => {
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const adminEmail = process.env.ADMIN_EMAIL || "admin@ddd.com";

    let existingAdmin = await User.findOne({
        userEmail: adminEmail
    });

    if (!existingAdmin) {
        existingAdmin = await User.findOne({
            userPhoneNumber: ADMIN_PHONE_NUMBER
        });
    }

    if (existingAdmin) {
        const updates = {};

        if (existingAdmin.userRole !== "seller") {
            updates.userRole = "seller";
        }

        if (!existingAdmin.userName || String(existingAdmin.userName).trim() !== "Admin") {
            updates.userName = "Admin";
        }

        if (!existingAdmin.userPassword || existingAdmin.userPassword === adminPassword) {
            updates.userPassword = await bcrypt.hash(adminPassword, 10);
        }

        if (Object.keys(updates).length > 0) {
            const updatedAdmin = await User.findByIdAndUpdate(
                existingAdmin._id,
                { $set: updates },
                { new: true }
            );
            console.log("Admin user updated", updatedAdmin ? updatedAdmin.userEmail : existingAdmin.userEmail);
            return updatedAdmin || existingAdmin;
        }

        console.log("Admin user already exists");
        return existingAdmin;
    }

    const createdAdmin = await User.create({
        userEmail: adminEmail,
        userPassword: await bcrypt.hash(adminPassword, 10),
        userRole: "seller",
        userName: "Admin",
        userPhoneNumber: ADMIN_PHONE_NUMBER
    });

    console.log("Admin user created");
    return createdAdmin;
};

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ddd";
        await mongoose.connect(mongoUri);
        console.log("DB Connected");
    } catch (error) {
        console.error("DB Connection Failed", error);
        return null;
    }

    return ensureAdminUser();
};

module.exports = connectDB;
module.exports.ensureAdminUser = ensureAdminUser;