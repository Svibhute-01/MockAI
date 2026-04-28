import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { GiBrain } from "react-icons/gi";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase.js";
import axios from "axios";
import { serverUrl } from "../App.jsx";

export default function Auth() {
  const handleGoogleAuth = async () => {
  try {
    console.log("Step 1: Button clicked");

    const response = await signInWithPopup(auth, provider);
    console.log("Step 2: Firebase success");

    const user = response.user;

    const result = await axios.post(
      serverUrl + "/api/auth/google",
      {
        name: user.displayName || "User",
        email: user.email,
      },
      { withCredentials: true }
    );

    console.log("Step 3: Backend success", result.data);

  } catch (error) {
    console.log("ERROR:", error);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6]">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-[380px] rounded-2xl shadow-lg p-8 text-center"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
            <GiBrain className="text-white text-sm" />
          </div>
          <span className="font-medium text-gray-800">
            InterviewIQ.AI
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Continue with
        </h2>

        {/* Badge */}
        <div className="inline-block bg-green-100 text-green-600 text-sm font-medium px-4 py-1 rounded-full mb-5">
          ✨ AI Smart Interview
        </div>

        {/* Description */}
        <p className="text-gray-500 text-sm leading-relaxed mb-6 px-2">
          Sign in to start AI-powered mock interviews, track your progress,
          and unlock detailed performance insights.
        </p>

        {/* Button */}
        <motion.button
          onClick={handleGoogleAuth}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-black text-white py-3 rounded-full flex items-center justify-center gap-3 font-medium shadow-md hover:opacity-90 transition"
        >
          <FcGoogle className="text-lg bg-white rounded-full p-0.5" />
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  );
}