import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  BsDownload, BsArrowCounterclockwise, BsStarFill, BsCheckCircleFill,
  BsXCircleFill, BsQuote, BsRobot, BsTrophyFill, BsBarChartFill,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";

/* ── Score ring ──────────────────────────────────────────────────────────── */
function ScoreRing({ score }) {
  const color = score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444";
  const label = score >= 80 ? "Excellent" : score >= 60 ? "Good" : "Needs Work";
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#1f2937" strokeWidth="9" />
        <circle
          cx="55" cy="55" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 55 55)"
        />
        <text x="55" y="55" textAnchor="middle" dy="7" fontSize="22" fontWeight="800" fill={color}>
          {score}
        </text>
      </svg>
      <span className="text-xs font-semibold" style={{ color }}>{label}</span>
    </div>
  );
}

/* ── Stat bar ────────────────────────────────────────────────────────────── */
function StatBar({ label, value }) {
  const color = value >= 80 ? "from-emerald-500 to-teal-500" : value >= 60 ? "from-amber-400 to-orange-400" : "from-red-500 to-rose-500";
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-bold text-gray-800">{value}<span className="text-gray-400 text-xs font-normal">/100</span></span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`bg-gradient-to-r ${color} h-2 rounded-full`}
        />
      </div>
    </div>
  );
}

const typeColors = {
  technical: "bg-blue-50 text-blue-700 border border-blue-100",
  hr: "bg-purple-50 text-purple-700 border border-purple-100",
  project: "bg-amber-50 text-amber-700 border border-amber-100",
};
const diffColors = {
  easy: "text-emerald-600 bg-emerald-50",
  medium: "text-amber-600 bg-amber-50",
  hard: "text-red-600 bg-red-50",
};
const scoreTextColor = (s) => s >= 80 ? "text-emerald-600" : s >= 60 ? "text-amber-600" : "text-red-500";

/* ── MAIN ────────────────────────────────────────────────────────────────── */
function Step3Report({ report, onRestart }) {
  const user = useSelector((s) => s.user.userData);

  if (!report) return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center text-gray-400">
      No report data available.
    </div>
  );

  const { role, experience, mode, finalScore, questions, strengths, weaknesses, recommendation, createdAt } = report;
  const answered = questions.filter((q) => q.answered);
  const avg = (key) => answered.length ? Math.round(answered.reduce((s, q) => s + q[key], 0) / answered.length) : 0;

  return (
    <div className="min-h-screen bg-[#fafaf9] py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* ── Header badge ── */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 bg-white border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm">
            <HiSparkles size={12} />
            Interview Complete · AI Report
          </div>
        </div>

        {/* ── Candidate + score ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Info */}
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-900 text-white font-bold text-xl flex items-center justify-center flex-shrink-0">
                {user?.name?.charAt(0).toUpperCase() ?? "?"}
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-gray-900" style={{ fontFamily: "'Sora','DM Sans',sans-serif" }}>
                  {user?.name ?? "Candidate"}
                </h1>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[
                    { label: role }, { label: experience }, { label: mode + " Mode" },
                    { label: `${answered.length}/${questions.length} answered` },
                    { label: createdAt ? new Date(createdAt).toLocaleDateString() : "" },
                  ].filter(x => x.label).map((tag, i) => (
                    <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg font-medium">{tag.label}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Score ring */}
            <div className="flex flex-col items-center">
              <ScoreRing score={finalScore} />
              <p className="text-xs text-gray-400 mt-1">Overall Score</p>
            </div>
          </div>
        </motion.div>

        {/* ── Performance breakdown ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7"
        >
          <div className="flex items-center gap-2 mb-5">
            <BsBarChartFill className="text-green-600" size={16} />
            <h2 className="font-bold text-gray-900">Performance Breakdown</h2>
          </div>
          <div className="space-y-4">
            <StatBar label="Overall Score" value={finalScore} />
            <StatBar label="Technical Correctness" value={avg("correctness")} />
            <StatBar label="Communication" value={avg("communication")} />
            <StatBar label="Confidence" value={avg("confidence")} />
          </div>
        </motion.div>

        {/* ── Strengths & Weaknesses ── */}
        <div className="grid md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <BsCheckCircleFill className="text-emerald-500" size={15} />
              <h2 className="font-bold text-gray-900">Strengths</h2>
            </div>
            {strengths?.length > 0 ? (
              <ul className="space-y-2.5">
                {strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span> {s}
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-400 text-sm">No strengths identified.</p>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <BsXCircleFill className="text-red-400" size={15} />
              <h2 className="font-bold text-gray-900">Areas to Improve</h2>
            </div>
            {weaknesses?.length > 0 ? (
              <ul className="space-y-2.5">
                {weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span> {w}
                  </li>
                ))}
              </ul>
            ) : <p className="text-gray-400 text-sm">No specific weaknesses noted.</p>}
          </motion.div>
        </div>

        {/* ── Recommendation ── */}
        {recommendation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-950 rounded-3xl p-7 relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-green-500/10 blur-3xl rounded-full" />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                <BsTrophyFill className="text-white" size={16} />
              </div>
              <div>
                <p className="text-green-400 text-xs font-semibold uppercase tracking-widest mb-2">Final Recommendation</p>
                <p className="text-white text-sm leading-relaxed">{recommendation}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Q&A Breakdown ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7"
        >
          <div className="flex items-center gap-2 mb-6">
            <BsStarFill className="text-amber-400" size={15} />
            <h2 className="font-bold text-gray-900">Detailed Q&A Review</h2>
          </div>

          <div className="space-y-5">
            {questions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + i * 0.05 }}
                className={`rounded-2xl border p-5 ${q.answered ? "border-gray-100" : "border-dashed border-gray-200 opacity-50"}`}
              >
                {/* Q header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${typeColors[q.type] ?? "bg-gray-100 text-gray-500"}`}>
                      {q.type}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${diffColors[q.difficulty] ?? "text-gray-400"}`}>
                      {q.difficulty}
                    </span>
                  </div>
                  {q.answered && (
                    <span className={`text-sm font-bold ${scoreTextColor(q.score)}`}>{q.score}<span className="text-gray-300 text-xs">/100</span></span>
                  )}
                </div>

                {/* Question text */}
                <p className="text-gray-800 text-sm font-medium mb-3 leading-relaxed">{q.question}</p>

                {q.answered ? (
                  <>
                    {/* Answer */}
                    <div className="bg-gray-50 rounded-xl p-3.5 mb-3 border border-gray-100">
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5">Your Answer</p>
                      <p className="text-gray-700 text-xs leading-relaxed">{q.answer}</p>
                    </div>

                    {/* Feedback */}
                    <div className="bg-emerald-50 rounded-xl p-3.5 mb-3 border border-emerald-100 flex items-start gap-2.5">
                      <BsRobot size={13} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wide mb-1">AI Feedback</p>
                        <p className="text-gray-700 text-xs leading-relaxed">{q.feedback}</p>
                      </div>
                    </div>

                    {/* Mini scores */}
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { l: "Score", v: q.score }, { l: "Correctness", v: q.correctness },
                        { l: "Communication", v: q.communication }, { l: "Confidence", v: q.confidence },
                      ].map(({ l, v }) => (
                        <div key={l} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-center min-w-[64px]">
                          <p className={`text-sm font-bold ${scoreTextColor(v)}`}>{v}</p>
                          <p className="text-[10px] text-gray-400">{l}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-xs italic">Not answered</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pb-4 print:hidden">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-7 py-3.5 rounded-2xl text-sm font-semibold transition shadow-md"
          >
            <BsDownload size={14} /> Download Report
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onRestart}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-7 py-3.5 rounded-2xl text-sm font-semibold transition shadow-md shadow-green-100"
          >
            <BsArrowCounterclockwise size={14} /> New Interview
          </motion.button>
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Step3Report;
