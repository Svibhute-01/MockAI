import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BsArrowLeft } from "react-icons/bs";
import API from "../api/api";
import Step3Report from "../components/Step3Report";
import Navbar from "../components/Navbar";

export default function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData } = useSelector((s) => s.user);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userData) { navigate("/auth"); return; }
    const fetch = async () => {
      try {
        const res = await API.get(`/api/interview/${id}`);
        setReport(res.data.interview);
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load report.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, userData, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading report…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />
      <div className="max-w-xl mx-auto px-4 pt-16 text-center">
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <button onClick={() => navigate("/history")} className="text-sm text-green-600 font-semibold hover:underline flex items-center gap-1 mx-auto">
          <BsArrowLeft size={13} /> Back to History
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-4">
        <button
          onClick={() => navigate("/history")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition font-medium mb-2"
        >
          <BsArrowLeft size={13} /> Back to History
        </button>
      </div>
      <Step3Report report={report} onRestart={() => navigate("/interview")} />
    </div>
  );
}
