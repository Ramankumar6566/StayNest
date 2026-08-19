require("dotenv").config({ override: true });

const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

const imagePath = path.join(__dirname, "rt.jpg");

console.log("================================");
console.log("CLOUDINARY DIAGNOSTIC TEST");
console.log("================================");

console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log(
    "API Key:",
    process.env.CLOUDINARY_API_KEY
        ? `${process.env.CLOUDINARY_API_KEY.substring(0, 4)}****`
        : "MISSING"
);
console.log(
    "API Secret:",
    process.env.CLOUDINARY_API_SECRET
        ? "LOADED"
        : "MISSING"
);

console.log("Image:", imagePath);
console.log("Image exists:", fs.existsSync(imagePath));

if (fs.existsSync(imagePath)) {
    const stats = fs.statSync(imagePath);
    console.log("Image size:", stats.size, "bytes");
}

console.log("================================");

async function testCloudinary() {
    try {
        console.log("STEP 1: Testing Cloudinary ping...");

        const ping = await cloudinary.api.ping();

        console.log("PING SUCCESS ✅");
        console.log(ping);

        console.log("================================");
        console.log("STEP 2: Testing IMAGE UPLOAD...");
        console.log("================================");

        if (!fs.existsSync(imagePath)) {
            throw new Error("rt.jpg not found inside server folder");
        }

        const stats = fs.statSync(imagePath);

        if (stats.size === 0) {
            throw new Error("rt.jpg is empty");
        }

        console.log("Uploading:", imagePath);
        console.log("Size:", stats.size);

        const result = await cloudinary.uploader.upload(imagePath, {
            folder: "staynest/test",
            resource_type: "image",
            use_filename: true,
            unique_filename: true,
        });

        console.log("================================");
        console.log("UPLOAD SUCCESS ✅");
        console.log("================================");
        console.log("Secure URL:", result.secure_url);
        console.log("Public ID:", result.public_id);
        console.log("Format:", result.format);
        console.log("Bytes:", result.bytes);
        console.log("================================");

    } catch (error) {

        console.log("================================");
        console.log("CLOUDINARY TEST FAILED ❌");
        console.log("================================");

        console.log("Message:", error.message);
        console.log("HTTP Code:", error.http_code);
        console.log("Name:", error.name);

        if (error.error) {
            console.log("Nested Error:", error.error);
        }

        console.log("Full Error:");
        console.log(error);

        console.log("================================");
    }
}

testCloudinary();