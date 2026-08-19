const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// ========================================
// LOAD ENVIRONMENT VARIABLES
// ========================================

dotenv.config();

// ========================================
// DATABASE
// ========================================

const connectDB = require("./config/db");

// ========================================
// ROUTES
// ========================================

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// ========================================
// CREATE EXPRESS APP
// ========================================

const app = express();

// ========================================
// CORS
// ========================================

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5177",
    "http://localhost:5178",
    "http://localhost:5180",
    "http://localhost:5181",
    "http://localhost:5182",
];

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow Postman / server-to-server
            if (!origin) {
                return callback(null, true);
            }

            // Allow specific frontend origins
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Allow any localhost port during development
            if (
                origin.startsWith("http://localhost:") ||
                origin.startsWith("http://127.0.0.1:")
            ) {
                return callback(null, true);
            }

            return callback(
                new Error("Not allowed by CORS")
            );
        },

        credentials: true,
    })
);

// ========================================
// BODY PARSER
// ========================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

// ========================================
// REQUEST LOGGER
// ========================================

app.use((req, res, next) => {
    console.log(
        `${new Date().toISOString()} - ${req.method} ${req.originalUrl}`
    );

    next();
});

// ========================================
// HEALTH CHECK
// ========================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "StayNest API is running 🚀",
        version: "1.0.0",
    });
});

// ========================================
// API ROUTES
// ========================================

// Authentication
app.use(
    "/api/auth",
    authRoutes
);

// Properties
app.use(
    "/api/properties",
    propertyRoutes
);

// Bookings
app.use(
    "/api/bookings",
    bookingRoutes
);

// Reviews
app.use(
    "/api/reviews",
    reviewRoutes
);

// ========================================
// API STATUS
// ========================================

app.get("/api", (req, res) => {
    res.status(200).json({
        success: true,
        message: "StayNest API",

        endpoints: {
            auth: "/api/auth",
            properties: "/api/properties",
            bookings: "/api/bookings",
            reviews: "/api/reviews",
        },
    });
});

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {

    console.error("");
    console.error("================================");
    console.error("SERVER ERROR");
    console.error("================================");
    console.error(err);
    console.error("");

    // ========================================
    // CORS ERROR
    // ========================================

    if (
        err.message ===
        "Not allowed by CORS"
    ) {
        return res.status(403).json({
            success: false,
            message:
                "CORS policy blocked this request",
        });
    }

    // ========================================
    // MULTER FILE SIZE ERROR
    // ========================================

    if (
        err.code === "LIMIT_FILE_SIZE"
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Image size cannot exceed 5 MB",
        });
    }

    // ========================================
    // MULTER TOO MANY FILES
    // ========================================

    if (
        err.code === "LIMIT_FILE_COUNT"
    ) {
        return res.status(400).json({
            success: false,
            message:
                "Maximum 10 images are allowed",
        });
    }

    // ========================================
    // GENERAL ERROR
    // ========================================

    return res.status(
        err.statusCode || 500
    ).json({
        success: false,
        message:
            err.message ||
            "Internal Server Error",
    });
});

// ========================================
// PORT
// ========================================

const PORT =
    process.env.PORT || 5000;

// ========================================
// START SERVER
// ========================================

const startServer = async () => {
    try {

        // ====================================
        // CONNECT MONGODB
        // ====================================

        await connectDB();

        // ====================================
        // START EXPRESS
        // ====================================

        app.listen(
            PORT,
            () => {

                console.log("");

                console.log(
                    "===================================="
                );

                console.log(
                    "       StayNest Backend Server"
                );

                console.log(
                    "===================================="
                );

                console.log(
                    `Server:  http://localhost:${PORT}`
                );

                console.log(
                    `API:     http://localhost:${PORT}/api`
                );

                console.log(
                    `Health:  http://localhost:${PORT}/`
                );

                console.log("");

                console.log(
                    "API Routes:"
                );

                console.log(
                    `Auth:       http://localhost:${PORT}/api/auth`
                );

                console.log(
                    `Properties: http://localhost:${PORT}/api/properties`
                );

                console.log(
                    `Bookings:   http://localhost:${PORT}/api/bookings`
                );

                console.log(
                    `Reviews:    http://localhost:${PORT}/api/reviews`
                );

                console.log("");

                console.log(
                    "Property Host Routes:"
                );

                console.log(
                    `Create:     POST http://localhost:${PORT}/api/properties`
                );

                console.log(
                    `My Homes:   GET  http://localhost:${PORT}/api/properties/host/my-properties`
                );

                console.log(
                    `Update:     PUT  http://localhost:${PORT}/api/properties/:id`
                );

                console.log(
                    `Delete:     DELETE http://localhost:${PORT}/api/properties/:id`
                );

                console.log("");

                console.log(
                    "Image Upload:"
                );

                console.log(
                    "Cloudinary + Multer enabled"
                );

                console.log("");

                console.log(
                    "===================================="
                );

                console.log("");
            }
        );

    } catch (error) {

        console.error("");

        console.error(
            "===================================="
        );

        console.error(
            "DATABASE CONNECTION FAILED"
        );

        console.error(
            "===================================="
        );

        console.error(
            error.message
        );

        console.error("");

        process.exit(1);
    }
};

// ========================================
// START APPLICATION
// ========================================

startServer();