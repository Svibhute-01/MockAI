import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";

// ─── Analyze Resume ───────────────────────────────────────────────────────────
export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload resume." });
    }

    // File is in memory buffer — no disk I/O needed
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(req.file.buffer) }).promise;

    let resumeText = "";
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      resumeText += content.items.map((item) => item.str).join(" ") + "\n";
    }
    resumeText = resumeText.replace(/\s+/g, " ").trim();

    const messages = [
      {
        role: "system",
        content: `Extract structured data from the resume. Return ONLY valid JSON:
{
  "role": "string",
  "experience": "string",
  "skills": ["skill1", "skill2"],
  "projects": ["project1", "project2"]
}
Do not add markdown. Do not explain anything.`,
      },
      { role: "user", content: resumeText },
    ];

    const aiResponse = await askAi(messages);
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      throw new Error("AI returned invalid JSON");
    }

    return res.json({
      role: parsed.role || "",
      experience: parsed.experience || "",
      skills: parsed.skills || [],
      projects: parsed.projects || [],
      resumeText,
    });
  } catch (error) {
    console.error("Resume Analysis Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ─── Start Interview (generate questions + create session) ────────────────────
export const startInterview = async (req, res) => {
  try {
    const { role, experience, mode, resumeText, skills, projects } = req.body;

    if (!role || !experience || !mode) {
      return res.status(400).json({ message: "role, experience, and mode are required." });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    if (user.credits < 50) {
      return res.status(403).json({ message: "Insufficient credits. You need at least 50 credits." });
    }

    const skillsText = Array.isArray(skills) && skills.length ? skills.join(", ") : "Not specified";
    const projectsText = Array.isArray(projects) && projects.length ? projects.join(", ") : "Not specified";
    const safeResume = resumeText?.trim() || "Not provided";

    // Determine question mix based on mode
    let questionInstruction = "";
    if (mode === "HR") {
      questionInstruction = "Generate 10 HR and behavioral interview questions.";
    } else if (mode === "Technical") {
      questionInstruction = "Generate 10 technical interview questions focusing on skills and problem-solving.";
    } else {
      questionInstruction = "Generate 10 mixed interview questions: 4 technical, 3 HR/behavioral, 3 project-based.";
    }

    const messages = [
      {
        role: "system",
        content: `You are an expert technical interviewer. ${questionInstruction}
Tailor questions to the candidate's role, experience, skills, and projects.
Return ONLY valid JSON:
{
  "questions": [
    {
      "question": "string",
      "type": "technical|hr|project",
      "difficulty": "easy|medium|hard",
      "timelimit": 120
    }
  ]
}
No markdown, no explanations.`,
      },
      {
        role: "user",
        content: `Role: ${role}
Experience: ${experience}
Skills: ${skillsText}
Projects: ${projectsText}
Resume Summary: ${safeResume.slice(0, 1500)}`,
      },
    ];

    const aiResponse = await askAi(messages);
    let parsed;
    try {
      parsed = JSON.parse(aiResponse);
    } catch {
      throw new Error("AI returned invalid questions JSON");
    }

    if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
      throw new Error("AI returned no questions");
    }

    // Create interview session
    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      skills: skills || [],
      projects: projects || [],
      questions: parsed.questions.map((q) => ({
        question: q.question,
        type: q.type || "technical",
        difficulty: q.difficulty || "medium",
        timelimit: q.timelimit || 120,
      })),
      status: "in-progress",
    });

    // Deduct credits
    user.credits -= 50;
    await user.save();

    return res.status(201).json({
      message: "Interview session created.",
      interviewId: interview._id,
      questions: interview.questions,
      creditsRemaining: user.credits,
    });
  } catch (error) {
    console.error("Start Interview Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ─── Submit & Evaluate Answer ─────────────────────────────────────────────────
export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionId, answer } = req.body;

    if (!interviewId || !questionId || !answer?.trim()) {
      return res.status(400).json({ message: "interviewId, questionId, and answer are required." });
    }

    const interview = await Interview.findOne({ _id: interviewId, userId: req.user.id });
    if (!interview) return res.status(404).json({ message: "Interview not found." });
    if (interview.status === "completed") {
      return res.status(400).json({ message: "Interview is already completed." });
    }

    const questionDoc = interview.questions.id(questionId);
    if (!questionDoc) return res.status(404).json({ message: "Question not found." });

    // AI evaluation
    const messages = [
      {
        role: "system",
        content: `You are an expert interview evaluator. Evaluate the candidate's answer to the interview question.
Score each dimension from 0 to 100.
Return ONLY valid JSON:
{
  "feedback": "string (2-3 sentences of constructive feedback)",
  "score": number,
  "communication": number,
  "confidence": number,
  "correctness": number
}
No markdown, no explanations.`,
      },
      {
        role: "user",
        content: `Role: ${interview.role}
Question: ${questionDoc.question}
Question Type: ${questionDoc.type}
Candidate Answer: ${answer.trim()}`,
      },
    ];

    const aiResponse = await askAi(messages);
    let evaluation;
    try {
      evaluation = JSON.parse(aiResponse);
    } catch {
      throw new Error("AI returned invalid evaluation JSON");
    }

    // Update question
    questionDoc.answer = answer.trim();
    questionDoc.feedback = evaluation.feedback || "";
    questionDoc.score = Math.min(100, Math.max(0, evaluation.score || 0));
    questionDoc.communication = Math.min(100, Math.max(0, evaluation.communication || 0));
    questionDoc.confidence = Math.min(100, Math.max(0, evaluation.confidence || 0));
    questionDoc.correctness = Math.min(100, Math.max(0, evaluation.correctness || 0));
    questionDoc.answered = true;

    await interview.save();

    return res.json({
      message: "Answer submitted and evaluated.",
      evaluation: {
        feedback: questionDoc.feedback,
        score: questionDoc.score,
        communication: questionDoc.communication,
        confidence: questionDoc.confidence,
        correctness: questionDoc.correctness,
      },
    });
  } catch (error) {
    console.error("Submit Answer Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ─── End Interview (generate final report) ────────────────────────────────────
export const endInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;
    if (!interviewId) return res.status(400).json({ message: "interviewId is required." });

    const interview = await Interview.findOne({ _id: interviewId, userId: req.user.id });
    if (!interview) return res.status(404).json({ message: "Interview not found." });

    const answeredQuestions = interview.questions.filter((q) => q.answered);

    // Calculate final score (average of all answered question scores)
    const finalScore =
      answeredQuestions.length > 0
        ? Math.round(
            answeredQuestions.reduce((sum, q) => sum + q.score, 0) / answeredQuestions.length
          )
        : 0;

    // Ask AI to generate strengths, weaknesses, and recommendation
    const qaSummary = answeredQuestions
      .map((q, i) => `Q${i + 1}: ${q.question}\nAnswer: ${q.answer}\nScore: ${q.score}`)
      .join("\n\n");

    const messages = [
      {
        role: "system",
        content: `You are an expert HR analyst. Based on the interview performance, generate a comprehensive summary.
Return ONLY valid JSON:
{
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendation": "string (2-3 sentences overall recommendation: Hire / Consider / Not Recommended)"
}
No markdown, no explanations.`,
      },
      {
        role: "user",
        content: `Role: ${interview.role}
Experience: ${interview.experience}
Mode: ${interview.mode}
Final Score: ${finalScore}/100

Interview Q&A:
${qaSummary || "No answers provided."}`,
      },
    ];

    const aiResponse = await askAi(messages);
    let summary;
    try {
      summary = JSON.parse(aiResponse);
    } catch {
      summary = { strengths: [], weaknesses: [], recommendation: "Unable to generate summary." };
    }

    interview.finalScore = finalScore;
    interview.strengths = summary.strengths || [];
    interview.weaknesses = summary.weaknesses || [];
    interview.recommendation = summary.recommendation || "";
    interview.status = "completed";

    await interview.save();

    return res.json({
      message: "Interview completed.",
      interview,
    });
  } catch (error) {
    console.error("End Interview Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ─── Get Interview ─────────────────────────────────────────────────────────────
export const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user.id });
    if (!interview) return res.status(404).json({ message: "Interview not found." });
    return res.json({ interview });
  } catch (error) {
    console.error("Get Interview Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ─── Get All Interviews for User ───────────────────────────────────────────────
export const getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("role experience mode finalScore status createdAt questions skills");
    return res.json({ interviews });
  } catch (error) {
    console.error("Get User Interviews Error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};
