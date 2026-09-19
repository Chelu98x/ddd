// DB Connection code goes here
const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require ("bcrypt")


const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined. Set it in your .env file.')
        }

        await mongoose.connect(mongoUri)
        console.log("DB Connected")
    } catch (error) {
        console.error("DB Connection Failed", error)
    }



// admin seeding
const adminPassword = process.env.ADMIN_PASSWORD
const adminEmail = process.env.ADMIN_EMAIL


const existingAdmin = await User.findOne({
    userEmail: adminEmail,
    userRole: "seller"
})



if (!existingAdmin) {
    await User.create ({
        userEmail: adminEmail,
        userPassword: await bcrypt.hash(adminPassword,10),
        userRole: "seller",
        userName: " Admin",
        userPhoneNumber: "000000000000000"
        
    })
    console.log("Admin user created")
}else{
    console.log("Admin user already exists")
}
}

module.exports = connectDB