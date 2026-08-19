const mongoose = require("mongoose");
const Review = require("../models/Review");
const Property = require("../models/Property");

// ==========================================
// GET PROPERTY REVIEWS
// ==========================================

const getPropertyReviews = async (req, res) => {
    try {
        const { propertyId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(propertyId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid property ID",
            });
        }

        const reviews = await Review.find({
            property: propertyId,
        })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            reviews,
        });
    } catch (error) {
        console.error("Get Reviews Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get reviews",
            error: error.message,
        });
    }
};

// ==========================================
// CREATE REVIEW
// ==========================================

const createReview = async (req, res) => {
    try {
        const { property, rating, comment } = req.body;

        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Not authorized",
            });
        }

        if (!property || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Property, rating and comment are required",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(property)) {
            return res.status(400).json({
                success: false,
                message: "Invalid property ID",
            });
        }

        const propertyExists = await Property.findById(property);

        if (!propertyExists) {
            return res.status(404).json({
                success: false,
                message: "Property not found",
            });
        }

        const ratingNumber = Number(rating);

        if (
            !Number.isInteger(ratingNumber) ||
            ratingNumber < 1 ||
            ratingNumber > 5
        ) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5",
            });
        }

        const review = await Review.create({
            user: req.user._id,
            property,
            rating: ratingNumber,
            comment: comment.trim(),
        });

        const populatedReview = await Review.findById(review._id)
            .populate("user", "name email")
            .populate("property");

        return res.status(201).json({
            success: true,
            message: "Review created successfully",
            review: populatedReview,
        });
    } catch (error) {
        console.error("Create Review Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create review",
            error: error.message,
        });
    }
};

// ==========================================
// DELETE REVIEW
// ==========================================

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        if (
            !req.user ||
            review.user.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this review",
            });
        }

        await review.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error) {
        console.error("Delete Review Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete review",
            error: error.message,
        });
    }
};

module.exports = {
    createReview,
    getPropertyReviews,
    deleteReview,
};