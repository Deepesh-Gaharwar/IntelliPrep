const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

dotenv.config();

const { connectDB } = require("./config/db");
const {authRouter} = require("./routes/auth.route");
const { sessionRouter} = require("./routes/session.route");
const { questionRouter } = require("./routes/question.route");
const { generateInterviewQuestions } = require("./controllers/ai.controller");
const { generateConceptExplaination } = require("./controllers/ai.controller");
const { protect } = require("./middlewares/auth.middleware");

const app = express();

// middlewares to handle CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);


// Middlewares
app.use(express.json());
app.use(cookieParser()); // to read the cokkies 



// Routes
app.use("/api/auth", authRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/questions", questionRouter);

app.use("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.use("/api/ai/generate-explaination", protect, generateConceptExplaination);


// Server uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads"), {}));

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
