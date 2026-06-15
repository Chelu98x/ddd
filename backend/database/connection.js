// DB Connection code goes here
const mongoose = require("mongoose");


const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://chelsoncdy_db_user:4aXL6C0pjRkUlBaK@cluster0ccc.wajocaz.mongodb.net/?appName=Cluster0ccc")
        console.log("DB Connected")
    } catch (error) {
        console.error("DB Connection Failed", error)
    }
}

module.exports = connectDB