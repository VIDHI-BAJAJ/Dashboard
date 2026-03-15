import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) { setError("Please enter your email."); return; }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`${apiUrl}/api/auth/forgot-password`, { email });
      setSuccess("Reset link sent! Check your inbox.");
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5fb] flex items-center justify-center p-6">
      <style>{`
        .input-field:focus {
          outline: none; border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }
      `}</style>

      <div className="bg-white rounded-3xl shadow-2xl flex w-full max-w-3xl overflow-hidden" style={{ minHeight: 420 }}>

        {/* Left Panel */}
        <div className="bg-gradient-to-r from-[#0f4c8a] to-[#1e6fd9] w-5/12 hidden md:flex flex-col justify-between p-8">
          <div>
            <p className="text-white/70 text-sm mb-2 font-medium">Never lose another enquiry.</p>
            <h2 className="text-white text-2xl font-bold leading-tight">
              Harbour AI responds instantly, follows up consistently, and keeps your CRM clean.
            </h2>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 flex flex-col justify-center px-10 py-10">
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-1">Forgot password?</h1>
          <p className="text-gray-400 text-sm mb-7">Enter your email and we'll send you a reset link.</p>

          {success && (
            <div className="mb-4 text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-2">
              ✓ {success}
            </div>
          )}

          {error && (
            <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">{error}</div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your email</label>
            <input
              type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50"
            />
          </div>

          <button
            onClick={handleSubmit} disabled={loading || !!success}
            className="w-full bg-[#004f98] hover:bg-[#003d7a] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm mb-5 transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Remembered it?{" "}
            <Link to="/login" className="text-[#004f98] font-semibold hover:underline">Back to login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}