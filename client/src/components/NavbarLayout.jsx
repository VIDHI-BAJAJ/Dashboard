import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import BottomNav from "./BottomNav.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Leads from "../pages/Leads.jsx";
import Conversations from "../pages/Conversations.jsx";
import Listing from "../pages/Listing.jsx";
import Segmentation from "../pages/Segmentation.jsx";
import LeadDetails from "../pages/LeadDetails.jsx";
import ConversationDetails from "../pages/ConversationDetails.jsx";
import logo from "../images/logo.png";

export default function NavbarLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "New lead added: Rohan Sharma", read: false },
    { id: 2, message: "New message from Tanisha Mehta", read: false },
    { id: 3, message: "Meeting reminder at 4 PM", read: true },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} />

      <div
        className={`flex-1 flex flex-col transition-[padding] duration-300 ${
          collapsed ? "lg:pl-20" : "lg:pl-60"
        }`}
      >
        {/* 🔥 TOP NAVBAR */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 bg-white">

          {/* LEFT (Mobile Logo) */}
          <div className="flex items-center gap-2 md:hidden">
            <img
              src={logo}
              alt="Harbour AI Logo"
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* SEARCH (Desktop) */}
          <div className="hidden md:block flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search leads, conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 text-black placeholder-gray-500 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5 ml-auto">

            {/* 🔔 NOTIFICATION */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="cursor-pointer relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg
                  className="w-6 h-6 text-gray-600 hover:text-black transition-colors"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6 6 0 10-12 0v3c0 .386-.149.735-.405 1.005L4 17h5m6 0a3 3 0 11-6 0h6z"
                  />
                </svg>

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#004f98] text-white text-[10px] px-1 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            </div>

            {/* 📩 EMAIL */}
            <div className="cursor-pointer">
               <svg
                className="w-6 h-6 text-gray-600 hover:text-black transition-colors"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 8l9 6 9-6M4 6h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
                />
              </svg>

            </div>

            {/* Grey Divider */}
            <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>

            {/* USER INFO */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-black">
                Vidhi Bajaj
              </p>
              <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Online
              </p>
            </div>

            {/* AVATAR */}
            <div className="h-9 w-9 rounded-full bg-[#004f98] text-white flex items-center justify-center font-semibold cursor-pointer hover:scale-105 transition">
              VB
            </div>

            {/* ⚙️ SETTINGS */}
            <div className="h-9 w-9 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
  <circle cx="12" cy="12" r="3"/>
</svg>
            </div>

          </div>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 px-4 py-6 pb-24 lg:pb-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/leads/:leadId" element={<LeadDetails />} />
            <Route path="/conversations" element={<Conversations />} />
            <Route
              path="/conversations/:conversationId"
              element={<ConversationDetails />}
            />
            {/* <Route path="/listing" element={<Listing />} /> */}
            <Route path="/segmentation" element={<Segmentation />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
