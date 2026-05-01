import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsRobot, BsCoin } from "react-icons/bs";
import { FaUserAstronaut } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { setUserData } from "../redux/userSlice";

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);

  const creditRef = useRef();
  const userRef = useRef();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (creditRef.current && !creditRef.current.contains(e.target)) {
        setShowCreditPopup(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUserPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout (NO navigation)
  const handleLogout = async () => {
    try {
      await API.post("/api/auth/logout", {}, { withCredentials: true });

      dispatch(setUserData(null));

      setShowCreditPopup(false);
      setShowUserPopup(false);

      // ❌ no navigation (as you requested)
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <div className="bg-[#f3f3f3] flex justify-center px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-6xl bg-white rounded-2xl shadow-md border border-gray-200 px-8 py-4 flex justify-between items-center"
      >
        {/* LEFT */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-gradient-to-br from-black to-gray-800 text-white p-2 rounded-lg shadow-md">
            <BsRobot size={18} />
          </div>
          <h1 className="font-semibold hidden md:block text-lg tracking-wide">
            MockAI
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6 relative">

          {/* 💰 CREDITS */}
          <div className="relative" ref={creditRef}>
            <button
              onClick={() => {
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false);
              }}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition shadow-sm"
            >
              <BsCoin size={18} />
              {userData?.credits ?? 0}
            </button>

            <AnimatePresence>
              {showCreditPopup && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.92 }}
                  transition={{ duration: 0.25 }}
                  className="absolute right-0 mt-4 w-80 bg-gradient-to-br from-white/80 to-gray-100/70 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-6 z-50"
                >
                  {/* Glow ring */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-200/20 to-transparent pointer-events-none"></div>

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl shadow-sm">
                      <BsCoin />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Credits Balance
                      </p>
                      <p className="text-xs text-gray-500">
                        Manage your usage
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-5 leading-relaxed">
                    You’re running low on credits. Upgrade now to continue
                    uninterrupted AI interviews.
                  </p>

                  <button
                    onClick={() => navigate("/pricing")}
                    className="w-full bg-gradient-to-r from-black via-gray-800 to-black text-white py-2.5 rounded-xl text-sm font-semibold tracking-wide hover:scale-[1.02] active:scale-[0.98] transition"
                  >
                    Upgrade Plan 🚀
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 👤 USER */}
          <div className="relative" ref={userRef}>
  <button
    onClick={() => {
      setShowUserPopup(!showUserPopup);
      setShowCreditPopup(false);
    }}
    className="w-9 h-9 bg-gradient-to-br from-black to-gray-800 text-white rounded-full flex items-center justify-center font-semibold shadow-md hover:scale-105 transition"
  >
    {userData?.name
      ? userData.name.charAt(0).toUpperCase()
      : <FaUserAstronaut size={16} />}
  </button>

  <AnimatePresence>
    {showUserPopup && (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 15, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className="absolute right-0 mt-4 w-80 z-50"
      >

        {/* 🔥 Gradient Border Wrapper */}
        <div className="p-[1px] rounded-3xl bg-gradient-to-br from-gray-300/40 via-white/60 to-gray-300/40 shadow-2xl">

          {/* Glass Card */}
          <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-5">

            {/* 👤 USER HEADER */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-black to-gray-800 text-white rounded-full flex items-center justify-center text-lg font-semibold shadow-md">
                {userData?.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {userData?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  Active • Free Plan
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 mb-3" />

            {/* 📊 MENU */}
            <div className="flex flex-col gap-1">

              <button
                onClick={() => navigate("/history")}
                className="group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                <span className="flex items-center gap-2">
                  📊 Interview History
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition translate-x-1 group-hover:translate-x-0">
                  →
                </span>
              </button>

              {/* Future upgrade option */}
              <button
                className="group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-100 transition"
              >
                <span className="flex items-center gap-2">
                  ⚙️ Settings
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition translate-x-1 group-hover:translate-x-0">
                  →
                </span>
              </button>

            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-3" />

            {/* 🚨 LOGOUT */}
            <button
              onClick={handleLogout}
              className="group w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition"
            >
              <span className="flex items-center gap-2">
                <HiOutlineLogout size={16} />
                Logout
              </span>

              <span className="opacity-0 group-hover:opacity-100 transition translate-x-1 group-hover:translate-x-0">
                →
              </span>
            </button>

          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>

        </div>
      </motion.div>
    </div>
  );
}

export default Navbar;