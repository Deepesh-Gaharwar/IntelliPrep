const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/db");

const app = express();

dotenv.config();

// middlewares to handle CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middlewares
app.use(express.json());

// Routes

// Server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

const PORT = process.env.PORT || 5000;

// DB connection
connectDB();

app.listen(PORT, () =>
  console.log(`Server running on ${PORT} successfully...`),
);
