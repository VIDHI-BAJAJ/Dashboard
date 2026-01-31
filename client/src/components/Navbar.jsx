import React from "react";
import { NavItem, IconButton, IconBolt, IconSearch, IconBell, IconRefresh } from "./UIComponents";

export default function Navbar({ updatedAgoLabel, loading, refreshing, fetchAll }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-white/10 backdrop-blur-[28px] backdrop-saturate-150">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="grid h-10 w-10 place-items-center rounded-3xl bg-white/15 backdrop-blur-[24px] border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)]">
              <IconBolt />
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-1">
            <NavItem active>Dashboard</NavItem>
            <NavItem>Leads</NavItem>
            <NavItem>Conversations</NavItem>
            <NavItem>Tasks</NavItem>
            <NavItem>Deals</NavItem>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 backdrop-blur-[24px] px-3 py-1.5 text-xs text-gray-300/95 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
              <span className="h-2 w-2 rounded-full bg-green-500/90 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              <span className="hidden md:inline">Live · </span>
            </span>
            <button
              type="button"
              onClick={() => fetchAll({ isRefresh: true })}
              disabled={loading || refreshing}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300 ${
                (loading || refreshing)
                  ? "cursor-not-allowed border-white/15 bg-white/10 backdrop-blur-[24px] text-gray-400/80"
                  : "border-white/20 bg-white/12 backdrop-blur-[24px] text-gray-300 hover:bg-white/15 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
              }`}
              aria-label="Refresh"
            >
              <IconRefresh />
              <span className="hidden sm:inline">{(loading || refreshing) ? "Refreshing…" : "Refresh"}</span>
            </button>
          </div>

          <IconButton label="Search"><IconSearch /></IconButton>
          <IconButton label="Notifications"><IconBell /></IconButton>

          <div className="h-10 w-10 overflow-hidden rounded-3xl border border-white/20 bg-white/15 backdrop-blur-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)]" />
        </div>
      </div>
    </header>
  );
}