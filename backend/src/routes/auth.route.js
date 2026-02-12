const express = require("express");
const User = require("../models/user.model");
const fs = require("fs");

const { registerUser, loginUser, getUserProfile } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middleware");
const cloudinary = require("../utils/cloudinary");


const authRouter = express.Router();


// register user
authRouter.post("/register", upload.single("profileImage"), registerUser);


// Login user
authRouter.post("/login", loginUser);


// get user profile
authRouter.get("/profile", protect, getUserProfile);


// upload image to Cloudinary
authRouter.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded!",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_images",
    });

    // Delete local file after upload
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      imageUrl: result.secure_url,
    });

  } catch (error) {
    res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
});



module.exports = {
    authRouter,
};