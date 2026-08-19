const express = require("express");

const {
    createProperty,
    getProperties,
    getPropertyById,
    getMyProperties,
    updateProperty,
    deleteProperty,
} = require("../controllers/propertyController");

const {
    protect,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// ==========================================
// PUBLIC ROUTES
// ==========================================

// GET ALL PROPERTIES
router.get(
    "/",
    getProperties
);

// ==========================================
// PROTECTED - MY PROPERTIES
// IMPORTANT: This must come BEFORE /:id
// ==========================================

router.get(
    "/host/my-properties",
    protect,
    getMyProperties
);

// ==========================================
// GET SINGLE PROPERTY
// ==========================================

router.get(
    "/:id",
    getPropertyById
);

// ==========================================
// CREATE PROPERTY
// ==========================================

router.post(
    "/",
    protect,

    upload.array(
        "images",
        10
    ),

    createProperty
);

// ==========================================
// UPDATE PROPERTY
// ==========================================

router.put(
    "/:id",
    protect,
    updateProperty
);

// ==========================================
// DELETE PROPERTY
// ==========================================

router.delete(
    "/:id",
    protect,
    deleteProperty
);

module.exports = router;