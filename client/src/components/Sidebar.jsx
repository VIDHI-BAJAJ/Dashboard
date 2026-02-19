import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../images/logo.png";


const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Leads", path: "/leads" },
  { label: "Conversations", path: "/conversations" },
  // { label: "Listing", path: "/listing" },
  { label: "Segmentation", path: "/segmentation" },
  // { label: "Ai Insights", path: "/ai-insights" },
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
      case 5: // insights- lightbulb
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightbulb" viewBox="0 0 16 16">
        <path d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13a.5.5 0 0 1 0 1 .5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1 .5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m6-5a5 5 0 0 0-3.479 8.592c.263.254.514.564.676.941L5.83 12h4.342l.632-1.467c.162-.377.413-.687.676-.941A5 5 0 0 0 8 1"/>
      </svg>
      );
    default:
      return null;
  }
}

export function Sidebar({ collapsed }) {
  return (
    <aside
      className={`hidden lg:flex fixed inset-y-0 left-0 bg-white text-black border-r border-white/10 transition-[width] duration-300 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      <div className="flex flex-col w-full h-full px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 overflow-hidden">
          
            {!collapsed && (
              <div className="flex flex-row ml-4">
               <img src={logo} alt="Harbour AI Logo" className="h-8 w-auto object-contain"/>
              {/* <span className="text-sm font-semibold tracking-tight">Harbour AI</span> */}
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
                    ? "bg-[#004f98] text-white"
                    : "text-black hover:bg-[#004f98] hover:text-white"
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
