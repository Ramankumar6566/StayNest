const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ==========================================
// PROTECT ROUTE
// ==========================================

const protect = async (req, res, next) => {
    try {
        // --------------------------------------
        // GET AUTHORIZATION HEADER
        // --------------------------------------

        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please login first.",
            });
        }

        // --------------------------------------
        // GET TOKEN
        // --------------------------------------

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication token is missing.",
            });
        }

        // --------------------------------------
        // VERIFY TOKEN
        // --------------------------------------

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded || !decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token.",
            });
        }

        // --------------------------------------
        // FIND USER
        // --------------------------------------

        const user = await User.findById(
            decoded.id
        ).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User associated with this token was not found.",
            });
        }

        // --------------------------------------
        // ATTACH USER TO REQUEST
        // --------------------------------------

        req.user = user;

        next();

    } catch (error) {
        console.error(
            "Auth Middleware Error:",
            error
        );

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token.",
            });
        }

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired. Please login again.",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Authentication failed.",
            error: error.message,
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    protect,
};