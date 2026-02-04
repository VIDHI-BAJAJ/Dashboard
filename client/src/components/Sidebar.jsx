import React, { useState, useEffect } from "react";
import {
  IconBolt,
  IconRefresh,
  IconSearch,
  IconBell,
  IconUsers,
  IconChat,
  IconCheck,
  IconSpark,
  IconSun,
  IconMoon
} from "./UIComponents";

export default function Sidebar({
  updatedAgoLabel,
  loading,
  refreshing,
  fetchAll,
  activePage,
  setActivePage,
  isLightMode,
  setIsLightMode,
  children
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Proper mobile detection
  useEffect(() => {
    setMounted(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("orientationchange", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("orientationchange", checkMobile);
    };
  }, []);

  if (!mounted) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <IconBolt /> },
    { id: "leads", label: "Leads", icon: <IconUsers /> },
    { id: "conversations", label: "Conversations", icon: <IconChat /> },
    { id: 'listing', label: 'Listing', icon: <IconCheck /> },
  ];

  return (
    <>
      {/* ================= MOBILE BOTTOM NAV (FIXED & ALWAYS VISIBLE) ================= */}
      {isMobile && (
       <nav className="fixed inset-x-0 bottom-0 z-[99999] pointer-events-auto transform-none">
          <div className="px-2 pb-2">
            <div
              className={`flex items-center justify-around rounded-3xl px-2 py-3
                shadow-[0_-4px_24px_rgba(0,0,0,0.15)]
                ${isLightMode ? "liquid-glass" : "liquid-glass-dark"}
              `}
            >
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl min-w-[60px]
                    ${
                      activePage === item.id
                        ? isLightMode
                          ? "bg-white/70 border border-white/40"
                          : "bg-white/20 border border-white/20"
                        : "hover:bg-white/10"
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-[9px] font-medium leading-tight">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      {/* ================= DESKTOP SIDEBAR ================= */}
      {!isMobile && (
        <aside
          className={`fixed left-0 top-0 z-50 h-full transition-all duration-300 ${
            isExpanded ? "w-60" : "w-16"
          }`}
          onMouseEnter={() => setIsExpanded(true)}
          onMouseLeave={() => setIsExpanded(false)}
        >
          <div className={`h-full flex flex-col ${isLightMode ? "liquid-glass" : "liquid-glass-dark"}`}>
            <div className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 rounded-2xl grid place-items-center liquid-glass liquid-hover">
                <IconBolt />
              </div>
              {isExpanded && (
                <span className="text-sm font-semibold">Harbour AI</span>
              )}
            </div>

            <nav className="flex-1 px-2 space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm liquid-hover ${
                    activePage === item.id
                      ? isLightMode
                        ? "bg-white/70 border border-white/40 text-black"
                        : "bg-white/20 border border-white/20 "
                      : "hover:bg-white/10"
                  }`}
                >
                  {item.icon}
                  {isExpanded && item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>
      )}

      {/* ================= CONTENT ================= */}
      <div
        className={`transition-all duration-300 ${
          isMobile ? "ml-0" : isExpanded ? "ml-60" : "ml-16"
        }`}
      >
        {/* Top Bar */}
        <header
          className={`sticky top-0 z-40 ${
            isLightMode ? "liquid-glass" : "liquid-glass-dark"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-3">
            <div className="font-bold text-lg">{getGreeting()}</div>

            <div className="flex items-center gap-2">
              <button className="h-10 w-10 rounded-full liquid-glass liquid-hover flex items-center justify-center">
                <IconSearch className="h-5 w-5" />
              </button>
              <button className="h-10 w-10 rounded-full liquid-glass liquid-hover flex items-center justify-center">
                <IconBell className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsLightMode(!isLightMode)}
                className="h-10 w-10 rounded-full liquid-glass liquid-hover flex items-center justify-center"
              >
                {isLightMode ? <IconMoon className="h-5 w-5" /> : <IconSun className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* 🔥 FIX IS HERE: enough space for navbar */}
        <main className={isMobile ? "pb-40 px-4 pt-4" : "p-6"}>
          {children}
        </main>
      </div>
    </>
  );
}
