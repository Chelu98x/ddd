const express = require('express')
const { registerUser, loginUser, forgotPassword, verifyOtp } = require('../controller/userController')
const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/forgot-password').post(forgotPassword)
router.route('/verify-otp').post(verifyOtp)





























module.exports = router;