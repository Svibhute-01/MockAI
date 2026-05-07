import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUserTie,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";
import API from "../api/api";

function Step1SetUp() {
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    // Validation
    if (!role || !experience || !file) {
      return setMessage("Please fill all fields and upload resume");
    }

    // PDF validation
    if (file.type !== "application/pdf") {
      return setMessage("Only PDF files are allowed");
    }

    const formData = new FormData();

    formData.append("resume", file);
    formData.append("role", role);
    formData.append("experience", experience);

    try {
      setLoading(true);
      setMessage("");

      const response = await API.post(
        "/api/interview/analyze-resume",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      setMessage("Resume analyzed successfully ✅");

      // OPTIONAL:
      // navigate("/interview");

    } catch (err) {
      console.log(err);

      setMessage(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-10">
      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid md:grid-cols-2 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 bg-white"
      >

        {/* LEFT SECTION */}
        <div className="bg-green-50 p-10 flex flex-col justify-center">
          
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Start Your AI Interview
          </motion.h2>

          <p className="text-gray-600 leading-relaxed mb-8">
            Practice real interview scenarios powered by AI. Improve your
            communication, technical skills, and confidence.
          </p>

          <div className="space-y-4">
            {[
              {
                icon: <FaUserTie />,
                text: "Choose Role & Experience",
              },
              {
                icon: <FaMicrophoneAlt />,
                text: "Smart Voice Interview",
              },
              {
                icon: <FaChartLine />,
                text: "Performance Analytics",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-4 rounded-xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-green-600 text-xl">
                  {item.icon}
                </div>

                <p className="text-gray-700 text-sm font-medium">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="p-10 flex flex-col justify-center">
          
          <h3 className="text-2xl font-semibold text-gray-900 mb-6">
            Interview Setup
          </h3>

          {/* ROLE INPUT */}
          <div className="space-y-4">

            <input
              type="text"
              placeholder="Enter role (e.g Frontend Developer)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none p-3 rounded-xl transition"
            />

            {/* EXPERIENCE INPUT */}
            <input
              type="text"
              placeholder="Experience (e.g 2 years)"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none p-3 rounded-xl transition"
            />
          </div>

          {/* FILE UPLOAD */}
          <motion.label
            whileHover={{ scale: 1.02 }}
            className="mt-6 border-2 border-dashed border-green-400 p-8 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-green-50 hover:bg-green-100 transition"
          >
            <FaFileUpload className="text-4xl text-green-600 mb-3" />

            <p className="text-gray-700 text-sm font-medium">
              {file ? file.name : "Upload Resume (PDF)"}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Click to browse your resume
            </p>

            <input
              type="file"
              hidden
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </motion.label>

          {/* MESSAGE */}
          {message && (
            <div
              className={`mt-4 text-sm font-medium ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {message}
            </div>
          )}

          {/* BUTTON */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            onClick={handleUpload}
            disabled={loading}
            className={`w-full mt-6 py-3 rounded-xl font-semibold shadow-md transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? "Analyzing Resume..." : "Start Interview"}
          </motion.button>

          {/* LOADER */}
          {loading && (
            <div className="w-full bg-gray-200 rounded-full h-2 mt-5 overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "linear",
                }}
                className="h-full w-1/2 bg-green-500"
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Step1SetUp;