const Session = require("../models/session.model");
const Question = require("../models/question.model");


// create a new session and linked questions
const createSession = async (req, res) => {
    try {

        const { role, experience, topicsToFocus, description, questions } = req.body;

        const userId = req.user._id; // getting from middleware

        const session = await Session.create({
            userId,
            role,
            experience,
            topicsToFocus,
            description,
        });

        const questionDocs = await Promise.all(
            questions.map( async (q) => {
                const question = await Question.create({
                    sessionId: session._id,
                    question: q.question,
                    answer: q.answer,
                });

                return question._id;
            })
        );

        session.questions = questionDocs;

        await session.save(); // save the session in DB


        res.status(201).json({
            success: true,
            session
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error while creating Session"
        });
    }
};



// get all sessions for the logged-in user
const getMySessions = async (req, res) => {

    try {
        const sessions = await Session.find({
            userId: req.user._id
        })
        .sort({ createdAt: -1})
        .populate("questions");

        res.status(200).json(sessions);


    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server Error while getting user's all Sessions",
      });
    }
};



// get a session by Id with populated questions
const getSessionById = async (req, res) => {
    try {

        const session = await Session.findById(req.params.id)
        .populate({
            path: "questions",
            options: { sort: { isPinned: -1, createdAt: 1}},
        })
        .exec();


        if(!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found"
            });
        }

        res.status(200).json({
            success: true,
            session
        });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server Error while getting Session by Id's",
      });
    }
};



// delete a session and its questions
const deleteSession = async (req, res) => {
    try {

        const session = await Session.findById(req.params.id);


        if(!session) {
            return res.status(404).json({
                success: false,
                message: "Session is not found"
            });
        }

        // check if the logged-in user owns this session
        if (session.userId.toString() !== req.user._id.toString()) {
          return res.status(401).json({
            message: "Not authorized to delete this session",
          });
        }


        // first. delete all the questions linked to this session
        await Question.deleteMany({sessionId: session._id});

        // then, delete the session
        await session.deleteOne();

        res.status(200).json({
           message: "Session deleted successfully!" 
        });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Server Error while deleting a Session and its questions",
      });
    }
};


module.exports = {
  createSession,
  getMySessions,
  getSessionById,
  deleteSession,
};