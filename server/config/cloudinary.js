const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("================================");
console.log("CLOUDINARY CONFIG");
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "LOADED" : "MISSING");
console.log("API Key:", process.env.CLOUDINARY_API_KEY ? "LOADED" : "MISSING");
console.log("API Secret:", process.env.CLOUDINARY_API_SECRET ? "LOADED" : "MISSING");
console.log("================================");

module.exports = cloudinary;