// import { useState } from "react";

// export default function Login() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6 font-sans">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
//         * { font-family: 'Sora', sans-serif; }
//         .gradient-panel {
//           background: radial-gradient(ellipse at 70% 20%, #c084fc 0%, transparent 50%),
//                       radial-gradient(ellipse at 20% 80%, #60a5fa 0%, transparent 50%),
//                       radial-gradient(ellipse at 80% 80%, #818cf8 0%, transparent 40%),
//                       linear-gradient(135deg, #3b82f6 0%, #6d28d9 50%, #7c3aed 100%);
//         }
//         .btn-glow:hover {
//           box-shadow: 0 0 24px rgba(99, 82, 235, 0.55);
//           transform: translateY(-1px);
//         }
//         .btn-glow { transition: all 0.2s ease; }
//         .input-field:focus {
//           outline: none;
//           border-color: #6366f1;
//           box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
//         }
//         .social-btn:hover { background: #f0f0f5; }
//         .social-btn { transition: background 0.15s; }
//         .asterisk { 
//           font-size: 2rem; 
//           color: #6366f1; 
//           line-height: 1;
//           font-weight: 300;
//           letter-spacing: -2px;
//         }
//         .asterisk-white {
//           font-size: 2rem;
//           color: white;
//           line-height: 1;
//           font-weight: 300;
//         }
//       `}</style>

//       <div className="bg-white rounded-3xl shadow-2xl flex w-full max-w-4xl overflow-hidden" style={{ minHeight: 540 }}>
//         {/* Left Gradient Panel */}
//         <div className="gradient-panel w-5/12 flex flex-col justify-between p-8 relative hidden md:flex">
//           <div className="asterisk-white">✳</div>
//           <div>
//             <p className="text-white/70 text-sm mb-2 font-medium">You can easily</p>
//             <h2 className="text-white text-2xl font-bold leading-tight">
//               Get access your personal<br />hub for clarity and<br />productivity
//             </h2>
//           </div>
//         </div>

//         {/* Right Form Panel */}
//         <div className="flex-1 flex flex-col justify-center px-10 py-10">
//           <div className="asterisk mb-2">✳</div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
//           <p className="text-gray-400 text-sm mb-7">
//             Sign in to access your tasks, notes, and projects — all in one place.
//           </p>

//           {/* Email */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Your email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="you@example.com"
//               className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50"
//             />
//           </div>

//           {/* Password */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••••"
//                 className="input-field w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-gray-50 pr-12"
//               />
//               <button
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//               >
//                 {showPassword ? (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                   </svg>
//                 ) : (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* CTA Button */}
//           <button className="btn-glow w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm mb-5">
//             Sign In
//           </button>

//           {/* Divider */}
//           <div className="flex items-center gap-3 mb-5">
//             <div className="flex-1 h-px bg-gray-200" />
//             <span className="text-xs text-gray-400">or continue with</span>
//             <div className="flex-1 h-px bg-gray-200" />
//           </div>

//           {/* Social Buttons */}
//           <div className="flex gap-3 mb-6">
//             {/* Google */}
//             <button className="social-btn flex-1 border border-gray-200 rounded-xl py-2.5 flex items-center justify-center bg-gray-50">
//               <svg className="h-5 w-5" viewBox="0 0 24 24">
//                 <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                 <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                 <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                 <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//               </svg>
//             </button>
//           </div>

//           <p className="text-center text-sm text-gray-500">
//             Don't have an account?{" "}
//             <a href="#" className="text-indigo-600 font-semibold hover:underline">Sign up</a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5fb] flex items-center justify-center p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        * { font-family: 'Sora', sans-serif; }
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

      <div className="bg-white rounded-3xl shadow-2xl flex w-full max-w-3xl overflow-hidden" style={{ minHeight: 520 }}>

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
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-7">Sign in to access your tasks, notes, and projects.</p>

          {error && (
            <div className="mb-4 text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2">{error}</div>
          )}

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
            {loading ? "Signing in..." : "Sign In"}
          </button>

        

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 font-semibold hover:underline">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}