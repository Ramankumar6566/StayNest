const express = require("express");

const {
    createBooking,
    getMyBookings,
    getAllBookings,
    cancelBooking,
} = require("../controllers/bookingController");

const {
    protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==========================================
// CREATE BOOKING
// ==========================================

router.post(
    "/",
    protect,
    createBooking
);

// ==========================================
// MY BOOKINGS
// ==========================================

router.get(
    "/my",
    protect,
    getMyBookings
);

// ==========================================
// ALL BOOKINGS
// ==========================================

router.get(
    "/",
    protect,
    getAllBookings
);

// ==========================================
// CANCEL BOOKING
// ==========================================

router.delete(
    "/:id",
    protect,
    cancelBooking
);

module.exports = router;