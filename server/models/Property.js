const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
    {
        // ==========================================
        // PROPERTY
        // ==========================================

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        // ==========================================
        // LOCATION
        // ==========================================

        location: {
            city: {
                type: String,
                required: true,
                trim: true,
            },

            state: {
                type: String,
                required: true,
                trim: true,
            },

            country: {
                type: String,
                default: "India",
                trim: true,
            },

            address: {
                type: String,
                default: "",
                trim: true,
            },
        },

        // ==========================================
        // PRICE
        // ==========================================

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        // ==========================================
        // CAPACITY
        // ==========================================

        guests: {
            type: Number,
            required: true,
            min: 1,
        },

        bedrooms: {
            type: Number,
            required: true,
            min: 0,
        },

        beds: {
            type: Number,
            required: true,
            min: 0,
        },

        bathrooms: {
            type: Number,
            required: true,
            min: 0,
        },

        // ==========================================
        // CATEGORY
        // ==========================================

        category: {
            type: String,
            default: "Apartment",
            trim: true,
        },

        // ==========================================
        // CLOUDINARY IMAGE URLS
        // ==========================================

        images: {
            type: [String],
            default: [],
        },

        // ==========================================
        // AMENITIES
        // ==========================================

        amenities: {
            type: [String],
            default: [],
        },

        // ==========================================
        // RATING
        // ==========================================

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        reviews: {
            type: Number,
            default: 0,
            min: 0,
        },

        // ==========================================
        // AVAILABILITY
        // ==========================================

        isAvailable: {
            type: Boolean,
            default: true,
        },

        // ==========================================
        // OWNER DETAILS
        // ==========================================

        ownerName: {
            type: String,
            required: true,
            trim: true,
        },

        contactNumber: {
            type: String,
            required: true,
            trim: true,
        },

        // ==========================================
        // LOGGED-IN USER / HOST
        // ==========================================

        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },

    {
        timestamps: true,
    }
);

module.exports =
    mongoose.model(
        "Property",
        propertySchema
    );