const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

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
            message: "User already exists"
        })
    }

    const hashed = await bcrypt.hash(userPassword, 10)

    await User.create({
        userEmail,
        userPhoneNumber,
        userName,
        userPassword: hashed
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
return res.status(200).json({
    message: "User logged in successfully",
    token: "dummy-token"
})
}


//forgot pass








module.exports = {
    registerUser,
    loginUser
}