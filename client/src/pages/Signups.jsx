import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      await register(name, email, password);
      navigate("/login"); // register no longer sets user, so /login renders correctly
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5fb] flex items-center justify-center p-6">
      <style>{`
        .gradient-panel {
          background: radial-gradient(ellipse at 70% 20%, #c084fc 0%, transparent 50%),
                      radial-gradient(ellipse at 20% 80%, #60a5fa 0%, transparent 50%),
                      radial-gradient(ellipse at 80% 80%, #818cf8 0%, transparent 40%),
                      linear-gradient(135deg, #3b82f6 0%, #6d28d9 50%, #7c3aed 100%);
        }
        .input-field:focus {
          outline: none; border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
        }
      `}</style>

      <div className="bg-white rounded-3xl shadow-2xl flex w-full max-w-3xl overflow-hidden" style={{ minHeight: 560 }}>

        {/* Left Gradient Panel */}
        <div className="gradient-panel w-5/12 hidden md:flex flex-col justify-between p-8">
          <span style={{ fontSize: "2rem", color: "white", fontWeight: 300 }}>✳</span>
          <div>
            <p className="text-white/70 text-sm mb-2 font-medium">You can easily</p>
            <h2 className="text-white text-2xl font-bold leading-tight">
              Get access your personal<br />hub for clarity and<br />productivity
            </h2>
          </div>
        </div>

        {/* Right Form */}
        <div className="flex-1 flex flex-col justify-center px-10 py-10">
          <span style={{ fontSize: "2rem", color: "#6366f1", lineHeight: 1 }}>✳</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-1">Create an account</h1>
          <p className="text-gray-400 text-sm mb-7">Access your tasks, notes, and projects — all in one place.</p>

          {error && (
            <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">{error}</div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
            <input
              type="text" value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Jane Doe"
              className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your email</label>
            <input
              type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••••"
                className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 pr-12"
              />
              <button onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit} disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm mb-5 transition"
          >
            {loading ? "Creating account..." : "Get Started"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}