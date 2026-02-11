const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const path = require("path");


// generate JWT token
const generateToken = (userId) => {
    return jwt.sign(
        {
            id: userId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    )
};



// register new user
const registerUser = async (req, res) => {
    try {
      const { name, emailId, password } = req.body;

      // check if user already exists
      const userExists = await User.findOne({ emailId });

      if (userExists) {
        return res.status(400).json({
          message: "User already exists",
        });
      }

      // hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      let profileImageUrl = null;

      // If file exists, upload to Cloudinary
      if (req.file) {
        const localFilePath = req.file.path;

        const result = await cloudinary.uploader.upload(localFilePath, {
          folder: "profile_images",
        });

        profileImageUrl = result.secure_url;

        // Delete file from uploads folder
        fs.unlinkSync(localFilePath);
      }

      // create a new user
      const user = await User.create({
        name,
        emailId,
        password: hashedPassword,
        profileImageUrl,
      });

      // generate token
      const JWTToken = generateToken(user._id);

      // return user data with JWT
      res.status(201).json({
        _id: user._id,
        name: user.name,
        emailId: user.emailId,
        profileImageUrl: user.profileImageUrl,
        token: JWTToken,
      });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }

};


// login user
const loginUser = async (req, res) => {

    try {

        const {emailId, password} = req.body;

        const user = await User.findOne({emailId});

        if(!user) {
            return res.status(500).json({
                message: "Invalid Credentials!"
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.status(500).json({
              message: "Invalid Credentials!",
            });
        }

       // create JWT Token 
        const JWTToken = generateToken(user._id);

        // return user data with JWT
        res.status(200).json({
            _id: user._id,
            name: user.name,
            emailId: user.emailId,
            profileImageUrl: user.profileImageUrl,
            token: JWTToken,
        });
        
    } catch (error) {
        res.status(500).json({
          message: "Server error",
          error: error.message,
        });
    }

};


// get user profile
const getUserProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user._id).select("-password");

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).json({
          message: "Server error",
          error: error.message,
        });
    }
};


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    generateToken,

};
