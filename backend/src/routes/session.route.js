const express = require("express");

const { createSession, getSessionById, getMySessions, deleteSession } = require("../controllers/session.controller");
const { protect } = require("../middlewares/auth.middleware");

const sessionRouter = express.Router();

// create session 
sessionRouter.post("/create", protect, createSession);


// my sessions
sessionRouter.get("/my-sessions", protect, getMySessions);


// get Session Id
sessionRouter.get("/:id", protect, getSessionById);


// delete Session
sessionRouter.delete("/:id", protect, deleteSession);


module.exports = {
    sessionRouter,
};