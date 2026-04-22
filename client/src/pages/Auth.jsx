import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { HiSparkles } from "react-icons/hi";
import { GiBrain } from "react-icons/gi";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {auth,provider} from '../utils/firebase.js'



export default function Auth() {
    const handleGoogleAuth=async()=>{
        try {
            const response=await signInWithPopup(auth,provider);
            console.log(response);
            
        } catch (error) {
            console.log(error);
        }
    }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
      {/* Ambient Gradient Glow */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-400/20 blur-3xl rounded-full top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/20 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative backdrop-blur-2xl bg-white/10 border border-white/20 shadow-[0_20px_80px_rgba(0,0,0,0.5)] rounded-3xl p-8 w-[380px] text-center text-white"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-6 pl-[2px]">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
            <GiBrain className="text-white text-base" />
          </div>
          <span className="font-semibold text-lg tracking-tight">
            InterviewIQ.AI
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-semibold mb-3 text-white/90">
          Continue with
        </h2>

        {/* Badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 text-emerald-300 font-medium px-4 py-1.5 rounded-full mb-6 border border-emerald-300/20"
        >
          <HiSparkles />
          AI Smart Interview
        </motion.div>

        {/* Description */}
        <p className="text-white/60 text-sm mb-6 leading-relaxed">
          Start AI-powered mock interviews, track your progress, and unlock
          deep performance insights with real-time feedback.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/40">Sign in</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google Button */}
        <motion.button
        onClick={handleGoogleAuth}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-full flex items-center justify-center gap-3 bg-white text-black py-3 rounded-full font-medium shadow-lg overflow-hidden"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent opacity-0 hover:opacity-100 transition duration-700 translate-x-[-100%] hover:translate-x-[100%]" />

          <FcGoogle className="text-xl" />
          Continue with Google
        </motion.button>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-white/40 mt-6"
        >
          Secure authentication powered by Google
        </motion.p>
      </motion.div>
    </div>
  );
}