import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsRobot, BsCoin } from "react-icons/bs";
import { FaUserAstronaut } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuth,setShowAuth]=useState(false);

  const creditRef = useRef();
  const userRef = useRef();

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

  const handleLogout = async () => {
    try {
      await API.post("/api/auth/logout", {}, { withCredentials: true });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <div className="bg-[#f7f7f7] flex justify-center px-4 pt-6">
      
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-6xl bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200 px-8 py-3 flex justify-between items-center"
      >

        {/* LEFT */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="bg-gray-100 p-2 rounded-lg">
            <BsRobot size={18} className="text-gray-700" />
          </div>
          <h1 className="font-semibold hidden md:block text-gray-900 tracking-wide">
            MockAI
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 relative">

          {/* 💰 CREDITS */}
          <div className="relative" ref={creditRef}>
            <button
              onClick={() => {
                if(!userData){
                  setShowAuth(true)
                  return
                }
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false);
              }}
              className="flex items-center gap-2 bg-gray-100 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-200 transition"
            >
              <BsCoin size={16} className="text-gray-600" />
              {userData?.credits ?? 0}
            </button>

            <AnimatePresence>
              {showCreditPopup && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-4 w-72 bg-white border border-gray-200 rounded-2xl shadow-lg p-5 z-50"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
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

                  <p className="text-sm text-gray-600 mb-4">
                    You’re running low on credits. Upgrade to continue.
                  </p>

                  <button
                    onClick={() => navigate("/pricing")}
                    className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition"
                  >
                    Upgrade Plan
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 👤 USER */}
          <div className="relative" ref={userRef}>
            <button
              onClick={() => {
                if(!userData){
                  setShowAuth(true)
                  return;
                }
                setShowUserPopup(!showUserPopup);
                setShowCreditPopup(false);
              }}
              className="w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold hover:scale-105 transition"
            >
              {userData?.name
                ? userData.name.charAt(0).toUpperCase()
                : <FaUserAstronaut size={14} />}
            </button>

            <AnimatePresence>
              {showUserPopup && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-4 w-72 bg-white border border-gray-200 rounded-2xl shadow-lg p-4 z-50"
                >

                  {/* USER INFO */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {userData?.name?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {userData?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Free Plan
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-2" />

                  {/* MENU */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => navigate("/history")}
                      className="text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      📊 Interview History
                    </button>

                    <button
                      className="text-left px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition"
                    >
                      ⚙️ Settings
                    </button>
                  </div>

                  <div className="border-t border-gray-200 my-2" />

                  {/* LOGOUT */}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition flex items-center gap-2"
                  >
                    <HiOutlineLogout size={16} />
                    Logout
                  </button>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>

      {showAuth && <AuthModel onClose={()=>setShowAuth(false)}/>}
    </div>
  );
}

export default Navbar;