import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Leads", path: "/leads" },
  { label: "Conversations", path: "/conversations" },
  { label: "Listing", path: "/listing" },
  { label: "Segmentation", path: "/segmentation" },
];

function NavIcon({ index, active }) {
  // Simple abstract icons using basic shapes to keep things minimal
  const base = "w-5 h-5 transition-colors duration-200";
  const color = active ? "text-white" : "text-gray-400";

  switch (index) {
    case 0: // Dashboard - grid
      return (
        <svg className={`${base} ${color}`} viewBox="0 0 20 20" fill="currentColor">
          <rect x="2" y="2" width="6" height="6" rx="1" />
          <rect x="12" y="2" width="6" height="6" rx="1" />
          <rect x="2" y="12" width="6" height="6" rx="1" />
          <rect x="12" y="12" width="6" height="6" rx="1" />
        </svg>
      );
    case 1: // Leads - users
      return (
        <svg className={`${base} ${color}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6" cy="7" r="2.5" />
          <path d="M2.5 14.5C3.2 12.8 4.5 12 6 12s2.8.8 3.5 2.5" />
          <circle cx="14" cy="7" r="2.5" />
          <path d="M10.5 14.5C11.2 12.8 12.5 12 14 12s2.8.8 3.5 2.5" />
        </svg>
      );
    case 2: // Conversations - chat bubbles
      return (
        <svg className={`${base} ${color}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 4h9a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H7l-4 3V6a2 2 0 0 1 2-2z" />
          <path d="M9 9.5h5.5A1.5 1.5 0 0 1 16 11v3l3 2.5V11a4 4 0 0 0-4-4h-3" />
        </svg>
      );
    case 3: // Listing - cards
      return (
        <svg className={`${base} ${color}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="14" height="5" rx="1.5" />
          <rect x="3" y="9" width="14" height="4" rx="1.5" />
          <rect x="3" y="14" width="9" height="3" rx="1.5" />
        </svg>
      );
    case 4: // Segmentation - pie chart
      return (
        <svg className={`${base} ${color}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="10" cy="10" r="6" />
          <path d="M10 4v6l4.5 4.5" />
        </svg>
      );
    default:
      return null;
  }
}

export function Sidebar({ collapsed }) {
  return (
    <aside
      className={`hidden lg:flex fixed inset-y-0 left-0 bg-black text-white border-r border-white/10 transition-[width] duration-300 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      <div className="flex flex-col w-full h-full px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="h-8 w-8 rounded-full border border-white/40 flex items-center justify-center text-xs font-semibold tracking-tight">
              HA
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-[0.2em] text-gray-400">SaaS</span>
                <span className="text-sm font-semibold tracking-tight">Harbour AI</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <NavIcon index={index} active={isActive} />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
