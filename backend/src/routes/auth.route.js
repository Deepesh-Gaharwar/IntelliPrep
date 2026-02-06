const express = require("express");

const { registerUser, loginUser, getUserProfile } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");
const { upload } = require("../middlewares/upload.middleware");


const authRouter = express.Router();


// register user
authRouter.post("/register", registerUser);


// Login user
authRouter.post("/login", loginUser);


// get user profile
authRouter.get("/profile", protect, getUserProfile);


// upload image
authRouter.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded!",
    });
  }

  const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  
  res.status(200).json({ imageUrl });
});



module.exports = {
    authRouter,
};