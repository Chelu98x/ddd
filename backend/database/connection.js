// DB Connection code goes here
const mongoose = require("mongoose");


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
}

module.exports = connectDB