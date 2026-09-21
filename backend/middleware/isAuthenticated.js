const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const isAuthenticated = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided, authorization denied"
            });
        }

        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({
                message: "Token is not valid"
            });
        }

        const userId = decoded.userId;
        const isUserExists = await User.findById(userId);

        if (!isUserExists) {
            return res.status(401).json({
                message: "User not found, authorization denied"
            });
        }

        req.user = isUserExists;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = isAuthenticated;