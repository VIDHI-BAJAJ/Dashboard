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

export default function NavbarLayout() {
  const [collapsed, setCollapsed] = useState(false);

  // 🔔 Notification State
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New lead added: Rohan Sharma", read: false },
    { id: 2, message: "New message from Tanisha Mehta", read: false },
    { id: 3, message: "Meeting reminder at 4 PM", read: true },
  ]);

  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
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
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-6 py-3 border-b border-white/10 bg-black backdrop-blur-sm">

          {/* 🔍 SEARCH (Hidden on mobile) */}
          <div className="hidden md:block flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search leads, conversations..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
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
          <div className="flex items-center gap-4 md:gap-6 ml-auto">

            {/* 🔔 NOTIFICATION */}
            <div className="relative" ref={dropdownRef}>
              <div
                className="cursor-pointer"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg
                  className="w-6 h-6 text-gray-300 hover:text-white transition-colors"
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
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>

              {/* ✅ RESPONSIVE DROPDOWN (FIXED FOR MOBILE) */}
              {showNotifications && (
                <div
                  className="
                    fixed md:absolute
                    top-14 md:top-12
                    left-0 md:left-auto
                    right-0 md:right-0
                    w-full md:w-80
                    bg-white
                    md:rounded-xl
                    shadow-xl
                    border border-gray-200
                    overflow-hidden
                    z-50
                  "
                >
                  <div className="px-4 py-3 border-b font-semibold text-gray-800">
                    Notifications
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-sm text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`px-4 py-3 text-sm cursor-pointer hover:bg-gray-100 ${
                            !notif.read ? "bg-gray-50 font-medium" : ""
                          }`}
                          onClick={() => {
                            setNotifications((prev) =>
                              prev.map((n) =>
                                n.id === notif.id
                                  ? { ...n, read: true }
                                  : n
                              )
                            );
                          }}
                        >
                          {notif.message}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-2 text-center text-xs text-gray-500 border-t">
                    Click notification to mark as read
                  </div>
                </div>
              )}
            </div>

            {/* 👤 USER INFO */}
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">
                Vidhi Bajaj
              </p>
              <p className="text-xs text-gray-400">
                Admin
              </p>
            </div>

            {/* 👤 AVATAR */}
            <div className="h-9 w-9 rounded-full bg-white text-black flex items-center justify-center font-semibold cursor-pointer hover:scale-105 transition-transform duration-200">
              VB
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
            <Route path="/listing" element={<Listing />} />
            <Route path="/segmentation" element={<Segmentation />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
