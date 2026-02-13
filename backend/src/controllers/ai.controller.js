const {GoogleGenAI } = require("@google/genai");
const {conceptExplainPrompt, questionAnswerPrompt } = require("../utils/prompts");


const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


// Generate interview questions and answers using Gemini
const generateInterviewQuestions = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, numberOfQuestions } = req.body;

        if (
          !role ||
          experience === undefined ||
          experience === null ||
          !topicsToFocus ||
          !numberOfQuestions
        ) {
          return res.status(400).json({
            message: "Missing required fields!",
          });
        }

        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);

        const response = await ai.models.generateContent({
          model: process.env.GEMINI_MODEL,
          contents: prompt,
        });

        const rawText = response.text;

        // clean it: Remove ```json and ``` from beginning and end
        const cleanedText = rawText
        .replace(/^```json\s*/, "") // remove starting ```json
        .replace(/```$/,"") // remove ending ```
        .trim(); // remove extra spaces


        // now safe to parse
        const data = JSON.parse(cleanedText);

        res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({
            message: "Failed to generate questions",
            error: error.message,
        });
    }
};


// Generate explaination for a interview question
const generateConceptExplaination =async (req, res) => {
    try {
        const { question } = req.body;

        if(!question) {
            return res.status(400).json({
                message: "Missing required fields!"
            });
        }

        const prompt = conceptExplainPrompt(question);

        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL,
            contents: prompt,
        });


        const rawText = response.text;

        // clean it: Remove ```json and ``` from beginning and end
        const cleanedText = rawText
        .replace(/^```json\s*/, "") // remove starting ```json
        .replace(/```$/, "") // remove ending ```
        .trim(); // remove extra spaces


        // now safe to parse
        const data = JSON.parse(cleanedText);

        res.status(200).json(data);

    } catch (error) {
      res.status(500).json({
        message: "Failed to generate concept explaination",
        error: error.message,
      });
    }
};


module.exports = {
    generateInterviewQuestions,
    generateConceptExplaination,
};