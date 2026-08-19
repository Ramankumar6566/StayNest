const Property = require("../models/Property");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

// =====================================================
// CLOUDINARY UPLOAD
// =====================================================

const uploadToCloudinary = (fileBuffer, originalName = "") => {
    return new Promise((resolve, reject) => {

        if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
            return reject(
                new Error("Invalid image buffer")
            );
        }

        if (fileBuffer.length === 0) {
            return reject(
                new Error("Image buffer is empty")
            );
        }

        console.log("");
        console.log("================================");
        console.log("CLOUDINARY UPLOAD START");
        console.log("FILE:", originalName);
        console.log("BUFFER SIZE:", fileBuffer.length);
        console.log("================================");

        const uploadStream =
            cloudinary.uploader.upload_stream(
                {
                    folder: "staynest/properties",
                    resource_type: "image",
                    type: "upload",
                },
                (error, result) => {

                    if (error) {

                        console.error("");
                        console.error(
                            "================================"
                        );
                        console.error(
                            "CLOUDINARY UPLOAD FAILED"
                        );
                        console.error(
                            "MESSAGE:",
                            error.message
                        );
                        console.error(
                            "HTTP CODE:",
                            error.http_code
                        );
                        console.error(
                            "NAME:",
                            error.name
                        );
                        console.error(
                            "X-CLD-ERROR:",
                            error.http_code
                        );
                        console.error(
                            "FULL ERROR:",
                            error
                        );
                        console.error(
                            "================================"
                        );

                        return reject(error);
                    }

                    if (!result) {
                        return reject(
                            new Error(
                                "Cloudinary returned empty result"
                            )
                        );
                    }

                    console.log("");
                    console.log(
                        "================================"
                    );
                    console.log(
                        "CLOUDINARY UPLOAD SUCCESS"
                    );
                    console.log(
                        "PUBLIC ID:",
                        result.public_id
                    );
                    console.log(
                        "URL:",
                        result.secure_url
                    );
                    console.log(
                        "FORMAT:",
                        result.format
                    );
                    console.log(
                        "SIZE:",
                        result.bytes
                    );
                    console.log(
                        "================================"
                    );

                    resolve(result);
                }
            );

        uploadStream.on(
            "error",
            (error) => {
                console.error(
                    "CLOUDINARY STREAM ERROR:",
                    error.message
                );

                reject(error);
            }
        );

        streamifier
            .createReadStream(fileBuffer)
            .on("error", (error) => {
                console.error(
                    "BUFFER STREAM ERROR:",
                    error.message
                );

                reject(error);
            })
            .pipe(uploadStream);
    });
};


// =====================================================
// CREATE PROPERTY
// =====================================================

const createProperty = async (req, res) => {

    try {

        console.log("");
        console.log(
            "========================================"
        );
        console.log(
            "CREATE PROPERTY REQUEST"
        );
        console.log(
            "========================================"
        );

        // =================================================
        // BASIC REQUEST LOG
        // =================================================

        console.log("BODY:", req.body);

        console.log(
            "FILES:",
            req.files?.length || 0
        );

        // =================================================
        // AUTH CHECK
        // =================================================

        if (!req.user?._id) {

            console.log(
                "AUTH USER: NO USER"
            );

            return res.status(401).json({
                success: false,
                message:
                    "Authentication required",
            });
        }

        console.log(
            "AUTH USER:",
            req.user._id.toString()
        );

        // =================================================
        // GET BODY
        // =================================================

        const {
            title,
            description,
            location,
            price,
            guests,
            bedrooms,
            beds,
            bathrooms,
            category,
            ownerName,
            contactNumber,
        } = req.body;

        console.log("TITLE:", title);
        console.log("DESCRIPTION:", description);
        console.log(
            "LOCATION RAW:",
            location
        );
        console.log("PRICE:", price);
        console.log("GUESTS:", guests);
        console.log("BEDROOMS:", bedrooms);
        console.log("BEDS:", beds);
        console.log(
            "BATHROOMS:",
            bathrooms
        );
        console.log(
            "CATEGORY:",
            category
        );
        console.log(
            "OWNER:",
            ownerName
        );
        console.log(
            "CONTACT:",
            contactNumber
        );

        // =================================================
        // PARSE LOCATION
        // =================================================

        let parsedLocation;

        try {

            parsedLocation =
                typeof location === "string"
                    ? JSON.parse(location)
                    : location;

        } catch (error) {

            console.error(
                "LOCATION PARSE ERROR:",
                error.message
            );

            return res.status(400).json({
                success: false,
                message:
                    "Invalid location format",
            });
        }

        console.log(
            "PARSED LOCATION:",
            parsedLocation
        );

        // =================================================
        // PARSE AMENITIES
        // =================================================

        let parsedAmenities = [];

        try {

            if (req.body.amenities) {

                parsedAmenities =
                    typeof req.body.amenities ===
                        "string"
                        ? JSON.parse(
                            req.body.amenities
                        )
                        : req.body.amenities;
            }

        } catch (error) {

            console.error(
                "AMENITIES PARSE ERROR:",
                error.message
            );

            return res.status(400).json({
                success: false,
                message:
                    "Invalid amenities format",
            });
        }

        console.log(
            "PARSED AMENITIES:",
            parsedAmenities
        );

        // =================================================
        // VALIDATION
        // =================================================

        if (!title?.trim()) {

            return res.status(400).json({
                success: false,
                message:
                    "Property title is required",
            });
        }

        if (!description?.trim()) {

            return res.status(400).json({
                success: false,
                message:
                    "Property description is required",
            });
        }

        if (
            !parsedLocation ||
            !parsedLocation.city?.trim() ||
            !parsedLocation.state?.trim()
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "City and state are required",
            });
        }

        if (
            price === undefined ||
            Number(price) <= 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Valid price is required",
            });
        }

        if (
            guests === undefined ||
            Number(guests) < 1
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Valid guest count is required",
            });
        }

        if (!ownerName?.trim()) {

            return res.status(400).json({
                success: false,
                message:
                    "Owner name is required",
            });
        }

        if (!contactNumber?.trim()) {

            return res.status(400).json({
                success: false,
                message:
                    "Contact number is required",
            });
        }

        // =================================================
        // IMAGE VALIDATION
        // =================================================

        if (
            !req.files ||
            req.files.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Please upload at least one image",
            });
        }

        console.log("");
        console.log(
            "========================================"
        );
        console.log(
            "ALL VALIDATION PASSED"
        );
        console.log(
            "IMAGE COUNT:",
            req.files.length
        );
        console.log(
            "STARTING CLOUDINARY UPLOAD"
        );
        console.log(
            "========================================"
        );

        // =================================================
        // CLOUDINARY CONFIG CHECK
        // =================================================

        const cloudName =
            process.env.CLOUDINARY_CLOUD_NAME;

        const apiKey =
            process.env.CLOUDINARY_API_KEY;

        const apiSecret =
            process.env.CLOUDINARY_API_SECRET;

        console.log(
            "Cloudinary Cloud:",
            cloudName
                ? "LOADED"
                : "MISSING"
        );

        console.log(
            "Cloudinary API Key:",
            apiKey
                ? "LOADED"
                : "MISSING"
        );

        console.log(
            "Cloudinary Secret:",
            apiSecret
                ? "LOADED"
                : "MISSING"
        );

        if (
            !cloudName ||
            !apiKey ||
            !apiSecret
        ) {

            return res.status(500).json({
                success: false,
                message:
                    "Cloudinary configuration is missing",
            });
        }

        // =================================================
        // UPLOAD IMAGES
        // =================================================

        const uploadedImages = [];

        for (const file of req.files) {

            console.log("");
            console.log(
                "================================"
            );
            console.log(
                "UPLOADING FILE"
            );
            console.log(
                "NAME:",
                file.originalname
            );
            console.log(
                "MIME:",
                file.mimetype
            );
            console.log(
                "SIZE:",
                file.size
            );
            console.log(
                "BUFFER:",
                file.buffer
                    ? "AVAILABLE"
                    : "MISSING"
            );
            console.log(
                "================================"
            );

            if (
                !file.buffer ||
                file.buffer.length === 0
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Empty image file: ${file.originalname}`,
                });
            }

            if (
                !file.mimetype?.startsWith(
                    "image/"
                )
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Invalid image type: ${file.originalname}`,
                });
            }

            const result =
                await uploadToCloudinary(
                    file.buffer,
                    file.originalname
                );

            uploadedImages.push({
                url: result.secure_url,
                public_id:
                    result.public_id,
            });
        }

        console.log("");
        console.log(
            "========================================"
        );
        console.log(
            "ALL IMAGES UPLOADED"
        );
        console.log(
            "UPLOADED IMAGES:",
            uploadedImages
        );
        console.log(
            "========================================"
        );

        // =================================================
        // CREATE MONGODB PROPERTY
        // =================================================

        console.log(
            "CREATING PROPERTY IN MONGODB..."
        );

        const property =
            await Property.create({

                title:
                    title.trim(),

                description:
                    description.trim(),

                location: {

                    city:
                        parsedLocation.city.trim(),

                    state:
                        parsedLocation.state.trim(),

                    country:
                        parsedLocation.country?.trim() ||
                        "India",

                    address:
                        parsedLocation.address?.trim() ||
                        "",
                },

                price:
                    Number(price),

                guests:
                    Number(guests),

                bedrooms:
                    Number(bedrooms || 0),

                beds:
                    Number(beds || 0),

                bathrooms:
                    Number(bathrooms || 0),

                category:
                    category?.trim() ||
                    "Apartment",

                // IMPORTANT:
                // If your Property schema expects
                // images as strings, use .map(url)
                images:
                    uploadedImages.map(
                        (image) =>
                            image.url
                    ),

                amenities:
                    Array.isArray(
                        parsedAmenities
                    )
                        ? parsedAmenities
                        : [],

                ownerName:
                    ownerName.trim(),

                contactNumber:
                    contactNumber.trim(),

                host:
                    req.user._id,
            });

        console.log("");
        console.log(
            "========================================"
        );
        console.log(
            "PROPERTY CREATED SUCCESSFULLY"
        );
        console.log(
            "PROPERTY ID:",
            property._id
        );
        console.log(
            "========================================"
        );

        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Property created successfully",

            property,
        });

    } catch (error) {

        console.error("");
        console.error(
            "========================================"
        );
        console.error(
            "CREATE PROPERTY ERROR"
        );
        console.error(
            "========================================"
        );

        console.error(
            "MESSAGE:",
            error.message
        );

        console.error(
            "HTTP CODE:",
            error.http_code
        );

        console.error(
            "NAME:",
            error.name
        );

        console.error(
            "FULL ERROR:",
            error
        );

        console.error(
            "========================================"
        );

        const statusCode =
            error.http_code &&
                Number(error.http_code) >= 400 &&
                Number(error.http_code) < 600
                ? Number(error.http_code)
                : 500;

        return res.status(statusCode).json({

            success: false,

            message:
                "Failed to create property",

            error:
                error.message ||
                "Unknown server error",
        });
    }
};


// =====================================================
// GET ALL PROPERTIES
// =====================================================

const getProperties = async (
    req,
    res
) => {

    try {

        const {
            city,
            category,
            minPrice,
            maxPrice,
            guests,
        } = req.query;

        const filter = {};

        // CITY
        if (city) {

            filter["location.city"] = {
                $regex: city,
                $options: "i",
            };
        }

        // CATEGORY
        if (category) {

            filter.category = {
                $regex: category,
                $options: "i",
            };
        }

        // PRICE
        if (
            minPrice ||
            maxPrice
        ) {

            filter.price = {};

            if (minPrice) {

                filter.price.$gte =
                    Number(minPrice);
            }

            if (maxPrice) {

                filter.price.$lte =
                    Number(maxPrice);
            }
        }

        // GUESTS
        if (guests) {

            filter.guests = {
                $gte: Number(guests),
            };
        }

        const properties =
            await Property.find(filter)
                .populate(
                    "host",
                    "name email"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({

            success: true,

            count:
                properties.length,

            properties,
        });

    } catch (error) {

        console.error(
            "Get Properties Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to get properties",

            error:
                error.message,
        });
    }
};


// =====================================================
// GET SINGLE PROPERTY
// =====================================================

const getPropertyById = async (
    req,
    res
) => {

    try {

        const property =
            await Property.findById(
                req.params.id
            )
                .populate(
                    "host",
                    "name email"
                );

        if (!property) {

            return res.status(404).json({

                success: false,

                message:
                    "Property not found",
            });
        }

        return res.status(200).json({

            success: true,

            property,
        });

    } catch (error) {

        console.error(
            "Get Property Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to get property",

            error:
                error.message,
        });
    }
};


// =====================================================
// GET MY PROPERTIES
// =====================================================

const getMyProperties = async (
    req,
    res
) => {

    try {

        const properties =
            await Property.find({

                host:
                    req.user._id,

            })
                .populate(
                    "host",
                    "name email"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({

            success: true,

            count:
                properties.length,

            properties,
        });

    } catch (error) {

        console.error(
            "Get My Properties Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to get your properties",

            error:
                error.message,
        });
    }
};


// =====================================================
// UPDATE PROPERTY
// =====================================================

const updateProperty = async (
    req,
    res
) => {

    try {

        const property =
            await Property.findById(
                req.params.id
            );

        if (!property) {

            return res.status(404).json({

                success: false,

                message:
                    "Property not found",
            });
        }

        if (
            !property.host ||
            property.host.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not allowed to update this property",
            });
        }

        const updateData = {
            ...req.body,
        };

        delete updateData.host;

        const updatedProperty =
            await Property.findByIdAndUpdate(

                req.params.id,

                updateData,

                {
                    new: true,
                    runValidators: true,
                }

            )
                .populate(
                    "host",
                    "name email"
                );

        return res.status(200).json({

            success: true,

            message:
                "Property updated successfully",

            property:
                updatedProperty,
        });

    } catch (error) {

        console.error(
            "Update Property Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to update property",

            error:
                error.message,
        });
    }
};


// =====================================================
// DELETE PROPERTY
// =====================================================

const deleteProperty = async (
    req,
    res
) => {

    try {

        const property =
            await Property.findById(
                req.params.id
            );

        if (!property) {

            return res.status(404).json({

                success: false,

                message:
                    "Property not found",
            });
        }

        if (
            !property.host ||
            property.host.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "You are not allowed to delete this property",
            });
        }

        await Property.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            message:
                "Property deleted successfully",
        });

    } catch (error) {

        console.error(
            "Delete Property Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to delete property",

            error:
                error.message,
        });
    }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

    createProperty,

    getProperties,

    getPropertyById,

    getMyProperties,

    updateProperty,

    deleteProperty,
};