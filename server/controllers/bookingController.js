const Booking = require("../models/Booking");
const Property = require("../models/Property");

// ==========================================
// CREATE BOOKING
// ==========================================

const createBooking = async (req, res) => {
    try {
        console.log("================================");
        console.log("CREATE BOOKING");
        console.log("USER:", req.user?._id);
        console.log("BODY:", req.body);
        console.log("================================");

        const {
            property,
            propertyId,
            checkIn,
            checkOut,
            guests,
            totalPrice,
        } = req.body;

        const finalPropertyId = property || propertyId;

        // --------------------------------------
        // VALIDATION
        // --------------------------------------

        if (
            !finalPropertyId ||
            !checkIn ||
            !checkOut ||
            guests === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Property, check-in, check-out and guests are required",
            });
        }

        // --------------------------------------
        // USER CHECK
        // --------------------------------------

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. User not found",
            });
        }

        // --------------------------------------
        // DATE CHECK
        // --------------------------------------

        const start = new Date(checkIn);
        const end = new Date(checkOut);

        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid check-in or check-out date",
            });
        }

        if (end <= start) {
            return res.status(400).json({
                success: false,
                message:
                    "Check-out date must be after check-in date",
            });
        }

        // --------------------------------------
        // PROPERTY CHECK
        // --------------------------------------

        const propertyExists =
            await Property.findById(finalPropertyId);

        if (!propertyExists) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        // --------------------------------------
        // AVAILABILITY
        // --------------------------------------

        if (propertyExists.isAvailable === false) {
            return res.status(400).json({
                success: false,
                message:
                    "This property is currently unavailable",
            });
        }

        // --------------------------------------
        // GUEST CHECK
        // --------------------------------------

        const guestCount = Number(guests);

        if (
            !Number.isInteger(guestCount) ||
            guestCount < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Guests must be at least 1",
            });
        }

        if (
            propertyExists.guests &&
            guestCount > Number(propertyExists.guests)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    `Maximum ${propertyExists.guests} guests allowed`,
            });
        }

        // --------------------------------------
        // CALCULATE NIGHTS
        // --------------------------------------

        const millisecondsPerDay =
            1000 * 60 * 60 * 24;

        const nights = Math.ceil(
            (end.getTime() - start.getTime()) /
            millisecondsPerDay
        );

        if (nights < 1) {
            return res.status(400).json({
                success: false,
                message:
                    "Booking must be at least 1 night",
            });
        }

        // --------------------------------------
        // CALCULATE TOTAL PRICE
        // --------------------------------------

        const pricePerNight =
            Number(propertyExists.price || 0);

        const calculatedPrice =
            pricePerNight * nights;

        const finalTotalPrice =
            Number(totalPrice) > 0
                ? Number(totalPrice)
                : calculatedPrice;

        // --------------------------------------
        // CREATE BOOKING
        // --------------------------------------

        const booking = await Booking.create({
            user: req.user._id,
            property: propertyExists._id,
            checkIn: start,
            checkOut: end,
            guests: guestCount,
            totalPrice: finalTotalPrice,
            status: "confirmed",
        });

        console.log(
            "BOOKING CREATED:",
            booking._id
        );

        // --------------------------------------
        // POPULATE
        // --------------------------------------

        const populatedBooking =
            await Booking.findById(booking._id)
                .populate("property")
                .populate("user", "name email");

        // --------------------------------------
        // RESPONSE
        // --------------------------------------

        return res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: populatedBooking,
        });

    } catch (error) {
        console.error("================================");
        console.error("BOOKING ERROR");
        console.error(error);
        console.error("================================");

        return res.status(500).json({
            success: false,
            message: "Failed to create booking",
            error: error.message,
        });
    }
};


// ==========================================
// GET MY BOOKINGS
// ==========================================

const getMyBookings = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        const bookings = await Booking.find({
            user: req.user._id,
        })
            .populate("property")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings,
        });

    } catch (error) {
        console.error(
            "My Bookings Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
            error: error.message,
        });
    }
};


// ==========================================
// GET ALL BOOKINGS
// ==========================================

const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("property")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings,
        });

    } catch (error) {
        console.error(
            "All Bookings Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch bookings",
            error: error.message,
        });
    }
};


// ==========================================
// CANCEL BOOKING
// ==========================================

const cancelBooking = async (req, res) => {
    try {
        const booking =
            await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (
            !req.user ||
            booking.user.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message:
                    "Not authorized to cancel this booking",
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message:
                    "Booking is already cancelled",
            });
        }

        booking.status = "cancelled";

        await booking.save();

        return res.status(200).json({
            success: true,
            message:
                "Booking cancelled successfully",
            booking,
        });

    } catch (error) {
        console.error(
            "Cancel Booking Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to cancel booking",
            error: error.message,
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {
    createBooking,
    getMyBookings,
    getAllBookings,
    cancelBooking,
};