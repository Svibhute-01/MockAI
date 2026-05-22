import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import {
  analyzeResume,
  startInterview,
  submitAnswer,
  endInterview,
  getInterview,
} from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

// Analyze uploaded resume PDF and extract structured data
interviewRouter.post("/analyze-resume", isAuth, upload.single("resume"), analyzeResume);

// Create a new interview session with AI-generated questions
interviewRouter.post("/start", isAuth, startInterview);

// Submit and evaluate a candidate's answer to a question
interviewRouter.post("/submit-answer", isAuth, submitAnswer);

// End the interview and generate final report/scores
interviewRouter.post("/end", isAuth, endInterview);

// Get a specific interview session by ID
interviewRouter.get("/:id", isAuth, getInterview);

export default interviewRouter;
