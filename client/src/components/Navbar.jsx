import React, { useState } from "react";
import { IconBolt, IconRefresh, IconSearch, IconBell, IconUsers, IconChat, IconCheck, IconSpark } from "./UIComponents";

export default function Sidebar({ updatedAgoLabel, loading, refreshing, fetchAll }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <IconBolt />, active: true },
    { id: 'leads', label: 'Leads', icon: <IconUsers /> },
    { id: 'conversations', label: 'Conversations', icon: <IconChat /> },
    { id: 'tasks', label: 'Tasks', icon: <IconCheck /> },
    { id: 'deals', label: 'Deals', icon: <IconSpark /> },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 z-50 h-full transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-60' : 'w-16'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="h-full bg-white/10 backdrop-blur-[24px] backdrop-saturate-150 border-r border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)] flex flex-col">
          {/* Logo/Header */}
          <div className="flex items-center gap-3 p-4 border-b border-white/10">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15 backdrop-blur-[20px] border border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4)] flex-shrink-0">
              <IconBolt />
            </div>
            {isExpanded && (
              <div>
                <div className="text-sm font-semibold text-gray-100 whitespace-nowrap">FinCRM</div>
                <div className="text-xs text-gray-400/80 whitespace-nowrap">Dashboard</div>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-2">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group ${
                      item.active
                        ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30 shadow-[0_2px_8px_rgba(59,130,246,0.2)]'
                        : 'text-gray-300 hover:bg-white/10 hover:text-gray-100 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <span className="flex-shrink-0 text-lg">{item.icon}</span>
                    {isExpanded && (
                      <span className="whitespace-nowrap transition-opacity duration-200">
                        {item.label}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-white/10 space-y-2">
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => fetchAll({ isRefresh: true })}
                disabled={loading || refreshing}
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 backdrop-blur-[20px] border border-white/20 text-gray-300 hover:bg-white/15 hover:text-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Refresh"
              >
                <IconRefresh className={`${(loading || refreshing) ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            {isExpanded && (
              <div className="px-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-[20px] px-3 py-1.5 text-xs text-gray-300/90 w-full justify-center">
                  <span className="h-2 w-2 rounded-full bg-green-500/90 shadow-[0_0_8px_rgba(34,197,94,0.6)] flex-shrink-0" />
                  <span className="truncate">{updatedAgoLabel}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Content Wrapper - Adjusts for sidebar */}
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'ml-60' : 'ml-16'}`}>
        {/* Top Bar (minimal version) */}
        <header className="sticky top-0 z-40 border-b border-white/15 bg-white/10 backdrop-blur-[28px] backdrop-saturate-150">
          <div className="flex items-center justify-end gap-2 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/15 backdrop-blur-[24px] text-gray-300/95 transition-all duration-300 hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                aria-label="Search"
              >
                <IconSearch />
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/15 backdrop-blur-[24px] text-gray-300/95 transition-all duration-300 hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
                aria-label="Notifications"
              >
                <IconBell />
              </button>
              <div className="h-10 w-10 rounded-3xl border border-white/20 bg-white/15 backdrop-blur-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)]" />
            </div>
          </div>
        </header>
      </div>
    </>
  );
}