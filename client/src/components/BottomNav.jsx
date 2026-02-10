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
  const base = "w-5 h-5 mb-1 transition-colors duration-200";
  const color = active ? "text-white" : "text-gray-400";

  switch (index) {
    case 0:
      return (
        <svg className={`${base} ${color}`} viewBox="0 0 20 20" fill="currentColor">
          <rect x="2" y="2" width="6" height="6" rx="1" />
          <rect x="12" y="2" width="6" height="6" rx="1" />
          <rect x="2" y="12" width="6" height="6" rx="1" />
          <rect x="12" y="12" width="6" height="6" rx="1" />
        </svg>
      );
    case 1:
      return (
        <svg className={`${base} ${color}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6" cy="7" r="2.5" />
          <path d="M2.5 14.5C3.2 12.8 4.5 12 6 12s2.8.8 3.5 2.5" />
          <circle cx="14" cy="7" r="2.5" />
          <path d="M10.5 14.5C11.2 12.8 12.5 12 14 12s2.8.8 3.5 2.5" />
        </svg>
      );
    case 2:
      return (
        <svg className={`${base} ${color}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 4h9a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H7l-4 3V6a2 2 0 0 1 2-2z" />
          <path d="M9 9.5h5.5A1.5 1.5 0 0 1 16 11v3l3 2.5V11a4 4 0 0 0-4-4h-3" />
        </svg>
      );
    case 3:
      return (
        <svg className={`${base} ${color}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="14" height="5" rx="1.5" />
          <rect x="3" y="9" width="14" height="4" rx="1.5" />
          <rect x="3" y="14" width="9" height="3" rx="1.5" />
        </svg>
      );
    case 4:
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

export function BottomNav() {
  return (
    <nav
      className="lg:hidden fixed inset-x-0 bottom-0 h-16 bg-black border-t border-white/10 flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] z-40"
    >
      {navItems.map((item, index) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center text-[11px] font-medium tracking-wide transition-all duration-200 ${
              isActive ? "text-white" : "text-gray-400 hover:text-gray-200"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <NavIcon index={index} active={isActive} />
              <span className="leading-none">{item.label}</span>
              <span
                className={`mt-1 h-0.5 w-6 rounded-full transition-opacity duration-200 ${
                  isActive ? "bg-white opacity-100" : "opacity-0"
                }`}
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
