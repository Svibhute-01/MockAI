import { useState } from "react";
import { ArrowLeft, CheckCircle, Zap, Shield, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/api";
import Navbar from "../components/Navbar";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    displayPrice: "₹0",
    credits: 100,
    description: "Perfect for beginners starting interview preparation.",
    badge: null,
    features: [
      "100 AI Interview Credits",
      "Basic Performance Report",
      "Voice Interview Access",
      "Interview History",
    ],
    buttonText: "Current Plan",
    highlighted: false,
    payable: false,
  },
  {
    id: "starter",
    name: "Starter Pack",
    price: 100,
    displayPrice: "₹100",
    credits: 150,
    description: "Great for focused practice and skill improvement.",
    badge: "Popular",
    features: [
      "150 AI Interview Credits",
      "Detailed Feedback",
      "Performance Analytics",
      "Full Interview History",
    ],
    buttonText: "Buy Now",
    highlighted: true,
    payable: true,
  },
  {
    id: "pro",
    name: "Pro Pack",
    price: 500,
    displayPrice: "₹500",
    credits: 650,
    description: "Best value for serious job preparation.",
    badge: "Best Value",
    features: [
      "650 AI Interview Credits",
      "Advanced AI Feedback",
      "Skill Trend Analysis",
      "Priority AI Processing",
    ],
    buttonText: "Buy Now",
    highlighted: false,
    payable: true,
  },
];

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((s) => s.user);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handlePay = async (plan) => {
    if (!plan.payable) return;
    if (!userData) { navigate("/auth"); return; }

    setLoadingPlan(plan.id);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const ok = await loadRazorpay();
      if (!ok) { setErrorMsg("Failed to load payment gateway. Please try again."); return; }

      const { data: order } = await API.post("/api/payment/create-order", {
        planId: plan.id,
        amount: plan.price,
        credits: plan.credits,
      });

      const options = {
        key: order.keyId || "",
        amount: order.amount,
        currency: order.currency,
        name: "MockAI",
        description: `${plan.name} — ${plan.credits} Credits`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await API.post("/api/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            if (verifyRes.data.success) {
              dispatch(setUserData({ ...userData, credits: verifyRes.data.credits }));
              setSuccessMsg(`🎉 Payment successful! ${plan.credits} credits added to your account.`);
            }
          } catch (e) {
            setErrorMsg(e?.response?.data?.message || "Payment verification failed.");
          }
        },
        prefill: {
          name: userData?.name || "",
          email: userData?.email || "",
        },
        theme: { color: "#16a34a" },
        modal: { ondismiss: () => setLoadingPlan(null) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => setErrorMsg("Payment failed. Please try again."));
      rzp.open();
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-8 pb-20">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition mb-8 font-medium"
          >
            <ArrowLeft size={14} /> Back
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white border border-green-200 text-green-700 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm mb-5">
            <Zap size={12} /> Credits & Pricing
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">Choose Your Plan</h1>
          <p className="text-gray-500 mt-3 text-sm max-w-md mx-auto">
            Each interview costs 50 credits. Buy credits once, use them anytime.
          </p>
          {userData && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm">
              <Shield size={13} className="text-green-600" />
              <span className="text-gray-600">Your balance:</span>
              <span className="font-bold text-gray-900">{userData.credits} credits</span>
            </div>
          )}
        </motion.div>

        <AnimatePresence>
          {successMsg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-5 py-4 text-sm font-medium text-center">
              {successMsg}
            </motion.div>
          )}
          {errorMsg && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-4 text-sm font-medium text-center">
              {errorMsg}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white rounded-3xl p-7 border transition-all duration-300 ${
                plan.highlighted
                  ? "border-green-400 shadow-xl shadow-green-100 scale-[1.02]"
                  : "border-gray-100 shadow-sm"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                    plan.badge === "Best Value" ? "bg-green-600 text-white" : "bg-gray-900 text-white"
                  }`}>
                    {plan.badge === "Popular" && <Star size={9} className="inline mr-1" />}
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mt-2">
                <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.displayPrice}</span>
                  {plan.price > 0 && <span className="text-gray-400 text-sm mb-1">one-time</span>}
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-sm text-green-700 font-semibold">{plan.credits} Credits</span>
                </div>
              </div>

              <p className="text-gray-400 mt-4 text-xs leading-relaxed">{plan.description}</p>

              <ul className="mt-5 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-gray-600 text-sm">
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePay(plan)}
                disabled={!plan.payable || loadingPlan === plan.id}
                className={`w-full mt-7 py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-100"
                    : plan.payable
                    ? "bg-gray-900 hover:bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                } disabled:opacity-60`}
              >
                {loadingPlan === plan.id ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing…</>
                ) : (
                  plan.buttonText
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center"
        >
          <Shield size={18} className="text-green-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-800 mb-1">Secure Payments by Razorpay</p>
          <p className="text-xs text-gray-400">All transactions are encrypted and secure. Credits are added instantly after payment.</p>
        </motion.div>
      </div>
    </div>
  );
}
