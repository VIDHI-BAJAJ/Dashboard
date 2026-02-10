import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import BottomNav from "./BottomNav.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Leads from "../pages/Leads.jsx";
import Conversations from "../pages/Conversations.jsx";
import Listing from "../pages/Listing.jsx";
import Segmentation from "../pages/Segmentation.jsx";

export default function NavbarLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const isAuthRoute = false; // reserved for future auth routing

  return (
    <div className="min-h-screen  flex">
      {/* Sidebar for desktop */}
      <Sidebar collapsed={collapsed} />

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col transition-[padding] duration-300 ${
          collapsed ? "lg:pl-20" : "lg:pl-60"
        }`}
      >
        {/* Top bar (for collapse toggle on desktop) */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black backdrop-blur-sm lg:pl-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setCollapsed((v) => !v)}
              className="hidden lg:inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-xs text-gray-200 hover:bg-white hover:text-black transition-colors duration-200"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <span className="sr-only">Toggle sidebar</span>
              <svg
                className="w-4 h-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                {collapsed ? (
                  <path d="M7 4l6 6-6 6" />
                ) : (
                  <path d="M13 4L7 10l6 6" />
                )}
              </svg>
            </button>

            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-[0.25em] text-gray-500">
                Harbour AI
              </span>
              <span className="text-sm font-medium text-gray-200">
                {location.pathname.replace("/", "").split("/")[0] || "Dashboard"}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 pb-24 lg:pb-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/conversations" element={<Conversations />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/segmentation" element={<Segmentation />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      {/* Bottom navigation for mobile */}
      {!isAuthRoute && <BottomNav />}
    </div>
  );
}
