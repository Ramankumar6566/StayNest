const express = require("express");

const {
    createReview,
    getPropertyReviews,
    deleteReview,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get reviews for a property
router.get("/:propertyId", getPropertyReviews);

// Create review
router.post("/", protect, createReview);

// Delete review
router.delete("/:id", protect, deleteReview);

module.exports = router;