const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/db");
const {authRouter} = require("./routes/auth.route");

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
app.use(cookieParser()); // to read the cokkies 



// Routes
app.use("/api/auth", authRouter);
// app.use("/api/sessions", sessionRouter);
// app.use("/api/questions", questionRouter);

// app.use("/api/ai/generate-questions", protect, generateInterviewQuestionsRouter);
// app.use("/api/ai/generate-explaination", protect, generateConceptExplainationRouter);




// Server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "src/uploads"), {}));

const PORT = process.env.PORT || 5000;


connectDB()
  .then(() => {
    console.log("Databse connection established successfully !!!");

    app.listen(PORT, () => {
      console.log(`Server is successfully listening on port ${PORT} ...`);
    });
  })
  .catch((err) => {
    console.log("Databse cannot be connected !!!", err.message);
  });
