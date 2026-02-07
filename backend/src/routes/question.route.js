const express = require("express");
const { togglePinQuestion, updateQuestionNote, addQuestionsToSession } = require("../controllers/question.controller");
const { protect } = require("../middlewares/auth.middleware");

const questionRouter = express.Router();


// add questions to session
questionRouter.post("/add", protect, addQuestionsToSession);

// toggle pin questions
questionRouter.post("/:id/pin", protect, togglePinQuestion);


// update Question note
questionRouter.post("/:id/note", protect, updateQuestionNote);



module.exports = {
    questionRouter,
};