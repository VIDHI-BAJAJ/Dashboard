import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const COUNTRY_CODES = [
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+1",  country: "US", flag: "🇺🇸" },
  { code: "+44", country: "GB", flag: "🇬🇧" },
  { code: "+61", country: "AU", flag: "🇦🇺" },
  { code: "+971", country: "AE", flag: "🇦🇪" },
  { code: "+65",  country: "SG", flag: "🇸🇬" },
  { code: "+60",  country: "MY", flag: "🇲🇾" },
  { code: "+92",  country: "PK", flag: "🇵🇰" },
  { code: "+880", country: "BD", flag: "🇧🇩" },
  { code: "+94",  country: "LK", flag: "🇱🇰" },
  { code: "+977", country: "NP", flag: "🇳🇵" },
  { code: "+33",  country: "FR", flag: "🇫🇷" },
  { code: "+49",  country: "DE", flag: "🇩🇪" },
  { code: "+39",  country: "IT", flag: "🇮🇹" },
  { code: "+34",  country: "ES", flag: "🇪🇸" },
  { code: "+81",  country: "JP", flag: "🇯🇵" },
  { code: "+82",  country: "KR", flag: "🇰🇷" },
  { code: "+86",  country: "CN", flag: "🇨🇳" },
  { code: "+55",  country: "BR", flag: "🇧🇷" },
  { code: "+27",  country: "ZA", flag: "🇿🇦" },
  { code: "+234", country: "NG", flag: "🇳🇬" },
  { code: "+254", country: "KE", flag: "🇰🇪" },
  { code: "+20",  country: "EG", flag: "🇪🇬" },
  { code: "+966", country: "SA", flag: "🇸🇦" },
  { code: "+974", country: "QA", flag: "🇶🇦" },
  { code: "+64",  country: "NZ", flag: "🇳🇿" },
  { code: "+7",   country: "RU", flag: "🇷🇺" },
  { code: "+90",  country: "TR", flag: "🇹🇷" },
  { code: "+98",  country: "IR", flag: "🇮🇷" },
  { code: "+62",  country: "ID", flag: "🇮🇩" },
];

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!name || !email || !password || !phone) {
      setError("Please fill in all fields.");
      return;
    }

    if (!/^\d{6,15}$/.test(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const fullPhone = `${countryCode}${phone}`;
      await register(name, email, password, fullPhone);
      navigate("/login", { state: { message: "Your account has been successfully created. Please log in." } });
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
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

      <div className="bg-white rounded-3xl shadow-2xl flex w-full max-w-3xl overflow-hidden" style={{ minHeight: 560 }}>

        {/* Left Gradient Panel */}
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
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-1">Create an account</h1>
          <p className="text-gray-400 text-sm mb-7">Access your leads and deals all in one place.</p>

          {error && (
            <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">{error}</div>
          )}

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
            <input
              type="text" value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              placeholder="Jane Doe"
              className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Your email</label>
            <input
              type="email" value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              placeholder="you@example.com"
              className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone number</label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => { setCountryCode(e.target.value); setError(""); }}
                className="input-field border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 bg-gray-50 w-28 cursor-pointer"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code + c.country} value={c.code}>
                    {c.flag} {c.code}
                  </option>
                ))}
              </select>

              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setPhone(val);
                  setError("");
                }}
                placeholder="9876543210"
                maxLength={15}
                className="input-field flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1 ml-1">Used for WhatsApp communications</p>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••••"
                className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 pr-12"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
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

          {/* Submit */}
          <button
            onClick={handleSubmit} disabled={loading}
            className="w-full bg-[#004f98] hover:bg-[#003d7a] disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm mb-5 transition"
          >
            {loading ? "Creating account..." : "Get Started"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-[#004f98] font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}