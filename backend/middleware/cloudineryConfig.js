const cloudinary = require("cloudinary").v2;

// Configure Cloudinary

cloudinary.config({
  cloud_name: "deextaxnt",
  api_key: "558887579376456",
  api_secret: "VKm7Q1YRqTROv13eR8mvIQ-B2V4",
});

module.exports = cloudinary;
