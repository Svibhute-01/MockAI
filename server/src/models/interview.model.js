import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  type: { type: String, enum: ["technical", "hr", "project"], default: "technical" },
  difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
  timelimit: { type: Number, default: 120 },
  answer: { type: String, default: "" },
  feedback: { type: String, default: "" },
  score: { type: Number, default: 0 },
  confidence: { type: Number, default: 0 },
  communication: { type: Number, default: 0 },
  correctness: { type: Number, default: 0 },
  answered: { type: Boolean, default: false },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: { type: String, required: true },
    experience: { type: String, required: true },
    mode: { type: String, enum: ["HR", "Technical", "Mixed"], required: true },
    resumeText: { type: String, default: "" },
    skills: [String],
    projects: [String],
    questions: [questionSchema],
    finalScore: { type: Number, default: 0 },
    strengths: [String],
    weaknesses: [String],
    recommendation: { type: String, default: "" },
    status: {
      type: String,
      enum: ["in-progress", "completed"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);
export default Interview;
