import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserTie,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";
import axios from "axios";

function Step1SetUp() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Upload resume first");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/interview/analyze-resume",
        formData,
        { withCredentials: true }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 w-full max-w-5xl rounded-3xl overflow-hidden shadow-xl border border-gray-200 bg-white"
      >

        {/* LEFT SIDE */}
        <div className="bg-green-50 p-10 flex flex-col justify-center">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-semibold text-gray-900 mb-4"
          >
            Start Your AI Interview
          </motion.h2>

          <p className="text-sm text-gray-600 mb-8 leading-relaxed">
            Practice real interview scenarios powered by AI. Improve your
            communication, technical skills, and confidence.
          </p>

          <div className="space-y-4">
            {[ 
              { icon: <FaUserTie />, text: "Choose Role & Experience" },
              { icon: <FaMicrophoneAlt />, text: "Smart Voice Interview" },
              { icon: <FaChartLine />, text: "Performance Analytics" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-3 rounded-xl flex items-center gap-3 shadow-sm hover:shadow-md transition"
              >
                <div className="text-green-600">{item.icon}</div>
                <p className="text-sm text-gray-700">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-10">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Interview Setup
          </h3>

          {/* INPUTS */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter role"
              className="w-full border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none p-3 rounded-xl transition"
            />

            <input
              type="text"
              placeholder="Experience (e.g 2 years)"
              className="w-full border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none p-3 rounded-xl transition"
            />
          </div>

          {/* UPLOAD BOX */}
          <motion.label
            whileHover={{ scale: 1.02 }}
            className="mt-6 border-2 border-dashed border-green-400 p-8 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-green-50 hover:bg-green-100 transition"
          >
            <FaFileUpload className="text-3xl text-green-600 mb-2" />
            <p className="text-sm text-gray-600">
              {file ? file.name : "Upload Resume (PDF)"}
            </p>

            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </motion.label>

          {/* BUTTON */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleUpload}
            className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl font-medium shadow-md hover:bg-green-700 transition"
          >
            {loading ? "Analyzing..." : "Start Interview"}
          </motion.button>

          {/* LOADING BAR */}
          {loading && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2 }}
              className="h-1 bg-green-500 mt-4 rounded-full"
            />
          )}
        </div>

      </motion.div>
    </div>
  );
}

export default Step1SetUp;