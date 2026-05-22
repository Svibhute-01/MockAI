import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BsMicFill, BsMicMuteFill, BsSendFill, BsFlag, BsVolumeUpFill, BsVolumeMuteFill,
  BsChevronRight, BsLightningChargeFill, BsCheckCircleFill, BsRobot,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import API from "../api/api";

const typeColors = {
  technical: "bg-blue-950 text-blue-300 border-blue-800",
  hr: "bg-purple-950 text-purple-300 border-purple-800",
  project: "bg-amber-950 text-amber-300 border-amber-800",
};
const diffColors = {
  easy: "text-emerald-400",
  medium: "text-amber-400",
  hard: "text-red-400",
};
const scoreColor = (s) => s >= 80 ? "text-emerald-400" : s >= 60 ? "text-amber-400" : "text-red-400";
const scoreBarColor = (s) => s >= 80 ? "bg-emerald-500" : s >= 60 ? "bg-amber-500" : "bg-red-500";

function ScorePill({ label, value }) {
  return (
    <div className="flex-1 min-w-[70px] bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col items-center gap-1">
      <span className={`text-xl font-bold ${scoreColor(value)}`}>{value}</span>
      <div className="w-full bg-white/10 rounded-full h-1">
        <div className={`${scoreBarColor(value)} h-1 rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] text-gray-500 text-center leading-tight">{label}</span>
    </div>
  );
}

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, role, mode } = interviewData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timelimit || 120);
  const [timerActive, setTimerActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const answerRef = useRef(answer);
  answerRef.current = answer;

  const currentQ = questions[currentIndex];
  const isLast = currentIndex === questions.length - 1;
  const progress = ((currentIndex + (evaluation ? 1 : 0)) / questions.length) * 100;

  // Speak question
  const speakQuestion = useCallback((text) => {
    if (!speakerOn || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92; u.pitch = 1;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => setIsSpeaking(false);
    u.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [speakerOn]);

  useEffect(() => {
    if (currentQ) speakQuestion(currentQ.question);
    return () => window.speechSynthesis?.cancel();
  }, [currentIndex, speakQuestion]);

  // Timer
  useEffect(() => { setTimeLeft(currentQ?.timelimit || 120); setTimerActive(true); }, [currentIndex]);
  useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) { setTimerActive(false); if (!evaluation) handleSubmit(true); return; }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, timerActive]);

  // Voice
  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError("Voice input not supported in this browser."); return; }
    const r = new SR();
    r.continuous = true; r.interimResults = true; r.lang = "en-US";
    r.onresult = (e) => setAnswer(Array.from(e.results).map((x) => x[0].transcript).join(" "));
    r.onerror = () => setIsListening(false);
    r.onend = () => setIsListening(false);
    recognitionRef.current = r;
    r.start(); setIsListening(true);
  };
  const stopListening = () => { recognitionRef.current?.stop(); setIsListening(false); };
  const toggleMic = () => isListening ? stopListening() : startListening();

  // Submit
  const handleSubmit = async (timedOut = false) => {
    stopListening(); window.speechSynthesis?.cancel();
    setTimerActive(false); setError("");
    const submitted = answerRef.current.trim() || (timedOut ? "[No answer — time expired]" : "");
    if (!submitted && !timedOut) { setError("Please type or speak your answer."); setTimerActive(true); return; }
    setIsSubmitting(true);
    try {
      const res = await API.post("/api/interview/submit-answer", {
        interviewId, questionId: currentQ._id, answer: submitted,
      });
      setEvaluation(res.data.evaluation);
      setAnsweredCount((c) => c + 1);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to evaluate. Please try again.");
    } finally { setIsSubmitting(false); }
  };

  const handleNext = () => { setAnswer(""); setEvaluation(null); setError(""); setCurrentIndex((i) => i + 1); };

  const handleEnd = async () => {
    setIsEnding(true);
    try {
      const res = await API.post("/api/interview/end", { interviewId });
      onFinish(res.data.interview);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to end interview.");
      setIsEnding(false);
    }
  };

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  const timerColor = timeLeft <= 15 ? "text-red-400" : timeLeft <= 30 ? "text-amber-400" : "text-emerald-400";
  const timerRing = timeLeft <= 15 ? "ring-red-500/40" : timeLeft <= 30 ? "ring-amber-500/40" : "ring-emerald-500/40";

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col text-white">

      {/* ── Top bar ── */}
      <div className="border-b border-white/10 px-6 py-3 flex items-center justify-between gap-4 bg-gray-900/60 backdrop-blur sticky top-0 z-20">
        {/* Left: brand + session info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
            <BsRobot size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">{role}</p>
            <p className="text-gray-500 text-xs mt-0.5">{mode} Interview</p>
          </div>
        </div>

        {/* Center: progress */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-xs mx-auto">
          <div className="flex-1 bg-white/10 rounded-full h-1.5">
            <motion.div
              className="bg-green-500 h-1.5 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <span className="text-gray-400 text-xs whitespace-nowrap">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>

        {/* Right: speaker + end */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { window.speechSynthesis?.cancel(); setSpeakerOn((v) => !v); }}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            {speakerOn ? <BsVolumeUpFill size={14} /> : <BsVolumeMuteFill size={14} />}
          </button>
          <button
            onClick={handleEnd}
            disabled={isEnding || isSubmitting}
            className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-lg transition disabled:opacity-40"
          >
            <BsFlag size={11} />
            {isEnding ? "Finishing…" : "End"}
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col items-center px-4 py-8 max-w-2xl mx-auto w-full">

        {/* Q counter dots */}
        <div className="flex gap-1.5 mb-6">
          {questions.map((_, i) => {
            const done = i < currentIndex || (i === currentIndex && evaluation);
            const active = i === currentIndex && !evaluation;
            return (
              <div key={i} className={`rounded-full transition-all duration-300 ${
                done ? "w-5 h-2 bg-green-500" : active ? "w-5 h-2 bg-green-400 ring-2 ring-green-400/40" : "w-2 h-2 bg-white/10"
              }`} />
            );
          })}
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-gray-900 border border-white/10 rounded-2xl overflow-hidden mb-4"
          >
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border ${typeColors[currentQ.type] || "bg-gray-800 text-gray-400 border-gray-700"}`}>
                  {currentQ.type?.toUpperCase()}
                </span>
                <span className={`text-[10px] font-semibold ${diffColors[currentQ.difficulty]}`}>
                  ● {currentQ.difficulty}
                </span>
              </div>
              {/* Timer */}
              {!evaluation && (
                <div className={`flex items-center gap-1.5 font-mono font-bold text-sm ring-1 ${timerRing} rounded-lg px-2.5 py-1 ${timerColor}`}>
                  {fmt(timeLeft)}
                </div>
              )}
            </div>

            {/* Question body */}
            <div className="p-5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <HiSparkles size={14} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm leading-relaxed">{currentQ.question}</p>
                {isSpeaking && (
                  <motion.p
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="text-xs text-green-400 mt-2 flex items-center gap-1"
                  >
                    <BsVolumeUpFill size={11} /> Speaking...
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Evaluation result */}
        <AnimatePresence>
          {evaluation && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full bg-gray-900 border border-green-500/30 rounded-2xl p-5 mb-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <BsCheckCircleFill className="text-green-400" size={15} />
                <p className="text-sm font-semibold text-white">AI Evaluation</p>
              </div>
              <div className="flex gap-2 mb-4">
                <ScorePill label="Overall" value={evaluation.score} />
                <ScorePill label="Correct" value={evaluation.correctness} />
                <ScorePill label="Comm." value={evaluation.communication} />
                <ScorePill label="Confidence" value={evaluation.confidence} />
              </div>
              <p className="text-gray-400 text-xs leading-relaxed bg-white/[0.03] rounded-xl p-3 border border-white/10">
                {evaluation.feedback}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Answer input */}
        {!evaluation ? (
          <div className="w-full bg-gray-900 border border-white/10 rounded-2xl overflow-hidden">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here, or click the mic to speak…"
              rows={5}
              disabled={isSubmitting}
              className="w-full bg-transparent text-white placeholder-gray-600 outline-none resize-none text-sm leading-relaxed p-5"
            />
            {error && <p className="text-red-400 text-xs px-5 pb-2">{error}</p>}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-white/[0.02]">
              <button
                onClick={toggleMic}
                disabled={isSubmitting}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isListening
                    ? "bg-red-600 text-white"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20"
                }`}
              >
                {isListening ? <BsMicMuteFill size={13} /> : <BsMicFill size={13} />}
                {isListening ? "Stop Listening" : "Voice Input"}
                {isListening && (
                  <motion.span
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"
                  />
                )}
              </button>

              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting || !answer.trim()}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-xl text-xs font-semibold transition disabled:opacity-30"
              >
                {isSubmitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <BsSendFill size={11} />
                )}
                {isSubmitting ? "Evaluating…" : "Submit"}
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-end gap-3">
            {!isLast ? (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
              >
                Next Question <BsChevronRight size={13} />
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleEnd}
                disabled={isEnding}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-50"
              >
                {isEnding ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Generating Report…</>
                ) : (
                  <><BsLightningChargeFill size={13} /> Finish & View Report</>
                )}
              </motion.button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Step2Interview;
