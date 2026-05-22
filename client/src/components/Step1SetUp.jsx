import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BsRobot, BsFileEarmarkText, BsMicFill, BsBarChart,
  BsArrowRight, BsCheckCircleFill, BsCloudUpload, BsLightningChargeFill,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { FaCode, FaUserTie, FaLayerGroup } from "react-icons/fa";
import API from "../api/api";

const MODES = [
  { value: "Technical", label: "Technical", icon: <FaCode size={14} />, desc: "Coding & system design" },
  { value: "HR", label: "HR", icon: <FaUserTie size={14} />, desc: "Behavioral & culture fit" },
  { value: "Mixed", label: "Mixed", icon: <FaLayerGroup size={14} />, desc: "Both technical & HR" },
];

const PERKS = [
  { icon: <BsRobot size={18} />, label: "AI-Tailored Questions", desc: "Adapted to your role & resume" },
  { icon: <BsMicFill size={18} />, label: "Voice & Text Input", desc: "Answer your way" },
  { icon: <BsBarChart size={18} />, label: "Deep Analytics", desc: "Score every dimension" },
  { icon: <BsFileEarmarkText size={18} />, label: "PDF Report", desc: "Download full feedback" },
];

function Step1SetUp({ onStart }) {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Mixed");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const handleStart = async () => {
    if (!role.trim() || !experience.trim() || !file)
      return setMessage("Please fill in all fields and upload your resume.");
    if (file.type !== "application/pdf")
      return setMessage("Only PDF files are accepted.");

    try {
      setLoading(true);
      setMessage("");

      setLoadingStep("Analyzing your resume...");
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("role", role.trim());
      formData.append("experience", experience.trim());

      const analyzeRes = await API.post("/api/interview/analyze-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { skills, projects, resumeText } = analyzeRes.data;

      setLoadingStep("Generating interview questions with AI...");
      const startRes = await API.post("/api/interview/start", {
        role: role.trim(), experience: experience.trim(), mode,
        resumeText, skills, projects,
      });

      const { interviewId, questions, creditsRemaining } = startRes.data;
      onStart({ interviewId, questions, role: role.trim(), experience: experience.trim(), mode, skills, projects, creditsRemaining });
    } catch (err) {
      setMessage(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
    else setMessage("Only PDF files are accepted.");
  };

  const isError = message && !message.includes("success");

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col">

      {/* ── Top badge ── */}
      <div className="flex justify-center pt-10 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-white border border-green-200 text-green-700 px-5 py-2 rounded-full text-xs font-semibold shadow-sm"
        >
          <HiSparkles size={13} className="text-green-500" />
          AI-Powered Mock Interview
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px]">50 credits</span>
        </motion.div>
      </div>

      {/* ── Headline ── */}
      <div className="text-center px-4 pt-4 pb-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900"
          style={{ fontFamily: "'Sora','DM Sans',sans-serif" }}
        >
          Set Up Your{" "}
          <span className="bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
            Interview
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-gray-500 mt-3 text-base max-w-md mx-auto"
        >
          Upload your resume and let AI craft a personalized interview session.
        </motion.p>
      </div>

      {/* ── Main card ── */}
      <div className="flex-1 flex items-start justify-center px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl grid md:grid-cols-5 rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-white"
        >

          {/* ── LEFT PANEL (dark) ── */}
          <div className="md:col-span-2 bg-gray-950 p-8 flex flex-col justify-between relative overflow-hidden">
            {/* bg glow */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/10 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-teal-500/10 blur-3xl rounded-full translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center mb-6">
                <BsRobot size={20} className="text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-white leading-snug mb-3"
                style={{ fontFamily: "'Sora','DM Sans',sans-serif" }}>
                Practice smarter.<br />
                <span className="text-green-400">Get hired faster.</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8">
                Real interview scenarios, instant AI feedback, and detailed performance reports — all in one place.
              </p>

              <div className="space-y-4">
                {PERKS.map((p, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-green-400 flex-shrink-0 mt-0.5">
                      {p.icon}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{p.label}</p>
                      <p className="text-gray-500 text-xs">{p.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* bottom stat strip */}
            <div className="relative z-10 mt-8 flex items-center gap-2 border-t border-white/10 pt-6">
              <BsCheckCircleFill className="text-green-400" size={13} />
              <span className="text-gray-400 text-xs">50,000+ interviews completed</span>
            </div>
          </div>

          {/* ── RIGHT PANEL (form) ── */}
          <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-gray-900 mb-6"
              style={{ fontFamily: "'Sora','DM Sans',sans-serif" }}>
              Interview Setup
            </h3>

            <div className="space-y-4">
              {/* Role */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Target Role</label>
                <input
                  type="text"
                  placeholder="e.g. Frontend Developer, Data Scientist"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={loading}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 transition disabled:opacity-50"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Experience Level</label>
                <input
                  type="text"
                  placeholder="e.g. 2 years, Fresher, 5+ years"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  disabled={loading}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none px-4 py-3 rounded-xl text-sm text-gray-800 placeholder-gray-400 transition disabled:opacity-50"
                />
              </div>

              {/* Mode */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Interview Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setMode(m.value)}
                      disabled={loading}
                      className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-semibold transition-all disabled:opacity-50 ${
                        mode === m.value
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-500 hover:border-green-300 bg-gray-50"
                      }`}
                    >
                      <span className={mode === m.value ? "text-green-600" : "text-gray-400"}>{m.icon}</span>
                      <span>{m.label}</span>
                      <span className="font-normal text-[10px] text-gray-400 hidden sm:block">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Resume (PDF)</label>
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl py-6 cursor-pointer transition-all ${
                    dragOver ? "border-green-500 bg-green-50" :
                    file ? "border-green-400 bg-green-50" : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                  } ${loading ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div
                        key="file"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-1"
                      >
                        <BsCheckCircleFill className="text-green-500" size={22} />
                        <p className="text-green-700 text-sm font-semibold">{file.name}</p>
                        <p className="text-green-500 text-xs">{(file.size / 1024).toFixed(0)} KB • PDF</p>
                      </motion.div>
                    ) : (
                      <motion.div key="empty" className="flex flex-col items-center gap-1">
                        <BsCloudUpload className="text-gray-400" size={24} />
                        <p className="text-sm text-gray-500 font-medium">Drop PDF here or <span className="text-green-600 font-semibold">browse</span></p>
                        <p className="text-xs text-gray-400">Max 5 MB</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <input type="file" hidden accept=".pdf" disabled={loading} onChange={(e) => setFile(e.target.files[0])} />
                </label>
              </div>
            </div>

            {/* Message */}
            <AnimatePresence>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`mt-3 text-sm font-medium flex items-center gap-2 ${isError ? "text-red-500" : "text-green-600"}`}
                >
                  {isError ? "⚠" : "✓"} {message}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading status */}
            <AnimatePresence>
              {loading && loadingStep && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 flex items-center gap-2 text-sm text-green-600 font-medium"
                >
                  <BsLightningChargeFill className="animate-pulse" />
                  {loadingStep}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              onClick={handleStart}
              disabled={loading}
              className={`mt-6 w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all duration-300 ${
                loading
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-green-200"
              }`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  Start Interview
                  <BsArrowRight />
                </>
              )}
            </motion.button>

            {/* Loading bar */}
            {loading && (
              <div className="w-full bg-gray-100 rounded-full h-1 mt-3 overflow-hidden">
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="h-full w-1/2 bg-green-500 rounded-full"
                />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Step1SetUp;
