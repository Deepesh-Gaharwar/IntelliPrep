const multer = require("multer");
const path = require("path");

// configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});


// file filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if(allowedTypes.includes(file.mimetype))  {
        cb(null, true);
    } else{
        cb(new Error("Only .jpeg, .jpg and .png formats are allowed"));
    }
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = {
    upload,
};