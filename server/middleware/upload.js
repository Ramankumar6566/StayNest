const multer = require("multer");

// ==========================================
// MEMORY STORAGE
// ==========================================

const storage = multer.memoryStorage();

// ==========================================
// FILE FILTER
// ==========================================

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed"
            ),
            false
        );
    }
};

// ==========================================
// MULTER
// ==========================================

const upload = multer({
    storage,

    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
        files: 10,
    },

    fileFilter,
});

module.exports = upload;