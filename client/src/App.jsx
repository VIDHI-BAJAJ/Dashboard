// import React from "react";
// import NavbarLayout from "./components/NavbarLayout.jsx";

// export default function App() {
//   return <NavbarLayout />;
// }


import { Routes, Route, Navigate } from "react-router-dom";
import NavbarLayout from "./components/NavbarLayout.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signups.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="/login"  element={!user ? <Login />  : <Navigate to="/dashboard" replace />} />
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/login" replace />} />
      <Route path="/*" element={user ? <NavbarLayout /> : <Navigate to="/login" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}