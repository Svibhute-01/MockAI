import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { analyzeResume } from "../controllers/interview.controller.js";

const interviewRouter = express.Router();

// POST /api/interview/analyze-resume
interviewRouter.post(
  "/analyze-resume",
  isAuth,
  upload.single("resume"),
  analyzeResume
);

export default interviewRouter;