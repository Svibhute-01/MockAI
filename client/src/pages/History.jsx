import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BsRobot, BsBarChartFill, BsClockFill, BsChevronDown, BsChevronUp,
  BsCheckCircleFill, BsTrophyFill, BsArrowLeft,
  BsLightningChargeFill, BsFileEarmarkText,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import API from "../api/api";
import Navbar from "../components/Navbar";

const modeColors = {
  Technical: "bg-blue-50 text-blue-700 border-blue-100",
  HR: "bg-purple-50 text-purple-700 border-purple-100",
  Mixed: "bg-amber-50 text-amber-700 border-amber-100",
};

const scoreColor = (s) =>
  s >= 80 ? "text-emerald-600" : s >= 60 ? "text-amber-500" : "text-red-500";

const scoreRingColor = (s) =>
  s >= 80 ? "#10b981" : s >= 60 ? "#f59e0b" : "#ef4444";

const scoreBg = (s) =>
  s >= 80 ? "bg-emerald-50 border-emerald-100" : s >= 60 ? "bg-amber-50 border-amber-100" : "bg-red-50 border-red-100";

function MiniRing({ score }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const dash = ((score ?? 0) / 100) * circ;
  const color = scoreRingColor(score ?? 0);
  return (
    <svg width="52" height="52" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r={r} fill="none" stroke="#f3f4f6" strokeWidth="5" />
      <circle
        cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 26 26)"
      />
      <text x="26" y="26" textAnchor="middle" dy="5" fontSize="11" fontWeight="800" fill={color}>
        {score ?? "—"}
      </text>
    </svg>
  );
}

function HistoryCard({ interview, index }) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const answered = interview.questions?.filter((q) => q.answered) ?? [];
  const statusDone = interview.status === "completed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
              <BsRobot size={16} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="text-sm font-bold text-gray-900 truncate">{interview.role}</h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${modeColors[interview.mode] ?? "bg-gray-50 text-gray-500 border-gray-100"}`}>
                  {interview.mode}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${statusDone ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-orange-600"}`}>
                  {statusDone ? "Completed" : "In Progress"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap">
                <span className="flex items-center gap-1">
                  <BsClockFill size={10} />
                  {new Date(interview.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <span>{interview.experience}</span>
                <span>{answered.length}/{interview.questions?.length ?? 0} answered</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            {statusDone && <MiniRing score={interview.finalScore} />}
            <button
              onClick={() => setExpanded((v) => !v)}
              className="w-8 h-8 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition"
            >
              {expanded ? <BsChevronUp size={13} /> : <BsChevronDown size={13} />}
            </button>
          </div>
        </div>

        {statusDone && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Score", value: interview.finalScore },
                { label: "Answered", value: `${answered.length}/${interview.questions?.length ?? 0}` },
                { label: "Mode", value: interview.mode },
              ].map(({ label, value }) => (
                <div key={label} className={`rounded-xl border p-2.5 text-center ${typeof value === "number" ? scoreBg(value) : "bg-gray-50 border-gray-100"}`}>
                  <p className={`text-sm font-bold ${typeof value === "number" ? scoreColor(value) : "text-gray-700"}`}>{value}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate(`/report/${interview._id}`)}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold py-2.5 rounded-xl transition"
            >
              <BsFileEarmarkText size={12} />
              View Full Report
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && statusDone && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-gray-100"
          >
            <div className="p-5 space-y-3 bg-gray-50/50">
              {interview.questions?.slice(0, 5).map((q, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-semibold capitalize ${
                        q.type === "technical" ? "bg-blue-50 text-blue-600" :
                        q.type === "hr" ? "bg-purple-50 text-purple-600" : "bg-amber-50 text-amber-600"
                      }`}>{q.type}</span>
                    </div>
                    {q.answered && <span className={`text-xs font-bold ${scoreColor(q.score)}`}>{q.score}/100</span>}
                  </div>
                  <p className="text-xs text-gray-700 font-medium leading-relaxed">{q.question}</p>
                  {q.answered && q.feedback && (
                    <p className="mt-2 text-[11px] text-gray-500 leading-relaxed bg-emerald-50 border border-emerald-100 rounded-lg p-2.5">
                      <span className="font-semibold text-emerald-700">AI: </span>{q.feedback}
                    </p>
                  )}
                  {!q.answered && <p className="mt-2 text-[11px] text-gray-400 italic">Not answered</p>}
                </div>
              ))}
              {(interview.questions?.length ?? 0) > 5 && (
                <p className="text-center text-xs text-gray-400 py-1">
                  +{interview.questions.length - 5} more questions
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function History() {
  const navigate = useNavigate();
  const { userData } = useSelector((s) => s.user);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userData) { navigate("/auth"); return; }
    const fetch = async () => {
      try {
        const res = await API.get("/api/interview/my");
        setInterviews(res.data.interviews ?? []);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userData, navigate]);

  const completed = interviews.filter((i) => i.status === "completed");
  const avgScore = completed.length
    ? Math.round(completed.reduce((s, i) => s + (i.finalScore ?? 0), 0) / completed.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 pt-8 pb-16">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition mb-5 font-medium"
          >
            <BsArrowLeft size={14} /> Back to Home
          </button>

          <div className="flex items-center gap-3 mb-1">
            <div className="inline-flex items-center gap-2 bg-white border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">
              <HiSparkles size={12} /> Interview History
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 mt-3">Your Practice Sessions</h1>
          <p className="text-sm text-gray-500 mt-1">Track your progress and revisit past interview feedback.</p>
        </motion.div>

        {!loading && interviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-3 mb-6"
          >
            {[
              { icon: <BsBarChartFill size={14} className="text-green-600" />, label: "Total Sessions", value: interviews.length },
              { icon: <BsCheckCircleFill size={14} className="text-emerald-500" />, label: "Completed", value: completed.length },
              { icon: <BsTrophyFill size={14} className="text-amber-500" />, label: "Avg Score", value: completed.length ? avgScore : "—" },
            ].map(({ icon, label, value }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                <div className="flex justify-center mb-2">{icon}</div>
                <p className="text-xl font-extrabold text-gray-900">{value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Loading your interviews…</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-2xl p-4 text-sm text-center">
            {error}
          </div>
        )}

        {!loading && !error && interviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <BsRobot size={24} className="text-gray-400" />
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-2">No interviews yet</h3>
            <p className="text-sm text-gray-400 mb-6">Start your first mock interview to see your history here.</p>
            <button
              onClick={() => navigate("/interview")}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition shadow-sm shadow-green-100"
            >
              <BsLightningChargeFill size={13} /> Start Interview
            </button>
          </motion.div>
        )}

        {!loading && !error && interviews.length > 0 && (
          <div className="space-y-3">
            {interviews.map((interview, i) => (
              <HistoryCard key={interview._id} interview={interview} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
