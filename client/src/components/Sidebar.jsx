// import React, { useState } from "react";
// import { IconBolt, IconRefresh, IconSearch, IconBell, IconUsers, IconChat, IconCheck, IconSpark, IconMenu, IconX, IconSun, IconMoon } from "./UIComponents";

// export default function Sidebar({ updatedAgoLabel, loading, refreshing, fetchAll, activePage, setActivePage, isLightMode, setIsLightMode, children }) {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
//   // Get time-based greeting and user name
//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return "Good Morning";
//     if (hour < 18) return "Good Afternoon";
//     return "Good Evening";
//   };
  
//   // Mock user name - in a real app, this would come from auth context or props
//   const userName = "User"; // You can replace this with actual user data
  
//   // Check if device is mobile
//   const isMobile = window.innerWidth < 768;
  
//   const menuItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: <IconBolt /> },
//     { id: 'leads', label: 'Leads', icon: <IconUsers /> },
//     { id: 'conversations', label: 'Conversations', icon: <IconChat /> },
//     { id: 'tasks', label: 'Tasks', icon: <IconCheck /> },
//     { id: 'deals', label: 'Deals', icon: <IconSpark /> },
//   ];

//   return (
//     <>
//       {/* Mobile Hamburger Button */}
//       {isMobile && (
//         <button
//           type="button"
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="fixed top-4 left-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-black hover:bg-gray-200 transition-all duration-300 shadow-sm lg:hidden"
//           aria-label="Toggle menu"
//         >
//           {isMobileMenuOpen ? <IconX /> : <IconMenu />}
//         </button>
//       )}

//       {/* Sidebar Overlay for Mobile */}
//       {isMobile && isMobileMenuOpen && (
//         <div 
//           className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
//           onClick={() => setIsMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside 
//         className={`fixed left-0 top-0 z-50 h-full transition-all duration-300 ease-in-out ${
//           isMobile 
//             ? isMobileMenuOpen 
//               ? 'w-64 translate-x-0' 
//               : '-translate-x-full w-64'
//             : isExpanded 
//               ? 'w-60' 
//               : 'w-16'
//         } lg:translate-x-0`}
//         {...(!isMobile && {
//           onMouseEnter: () => setIsExpanded(true),
//           onMouseLeave: () => setIsExpanded(false)
//         })}
//       >
//         <div className="h-full bg-white/10 backdrop-blur-[24px] backdrop-saturate-150 border-r border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)] flex flex-col">
//           {/* Logo/Header */}
//           <div className="flex items-center gap-3 p-4 border-b border-white/10">
//             <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/15 backdrop-blur-[20px] border border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4)] flex-shrink-0">
//               <IconBolt />
//             </div>
//             {(isExpanded || isMobile) && (
//               <div className="overflow-hidden">
//                 {/* <div className={`text-sm font-semibold ${isLightMode ? 'text-black' : 'text-gray-100'} whitespace-nowrap`}>FinCRM</div> */}
//                 <div className={`text-xs ${isLightMode ? 'text-gray-600' : 'text-gray-400/80'} whitespace-nowrap`}>Dashboard</div>
//               </div>
//             )}
//           </div>

//           {/* Menu Items */}
//           <nav className="flex-1 py-2 overflow-hidden">
//             <ul className="space-y-1 px-2">
//               {menuItems.map((item) => (
//                 <li key={item.id}>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setActivePage(item.id);
//                       if (isMobile) setIsMobileMenuOpen(false);
//                     }}
//                     className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group ${
//                       activePage === item.id
//                         ? 'shadow-[0_2px_8px_rgba(59,130,246,0.2)]'
//                         : isLightMode ? 'text-black hover:bg-gray-100 border border-gray-200' : 'text-gray-300 hover:bg-white/10 hover:text-gray-100 border border-transparent hover:border-white/10'
//                     }`}
//                   >
//                     <span className="flex-shrink-0 text-lg">{item.icon}</span>
//                     {(isExpanded || isMobile) && (
//                       <span className="whitespace-nowrap transition-opacity duration-200">
//                         {item.label}
//                       </span>
//                     )}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </nav>

//           {/* Bottom Actions */}
//           <div className="p-3 border-t border-white/10 space-y-2">
//             <div className="flex items-center justify-center">
//               <button
//                 type="button"
//                 onClick={() => fetchAll({ isRefresh: true })}
//                 disabled={loading || refreshing}
//                 className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 border border-gray-300 text-black hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                 aria-label="Refresh"
//               >
//                 <IconRefresh className={`${(loading || refreshing) ? 'animate-spin' : ''}`} />
//               </button>
//             </div>
            
//             {(isExpanded || isMobile) && (
//               <div className="px-2">
//                 <div className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-gray-100 px-3 py-1.5 text-xs text-black w-full justify-center">
//                   <span className="h-2 w-2 rounded-full bg-green-600 shadow-[0_0_8px_rgba(34,197,94,0.6)] flex-shrink-0" />
//                   <span className="truncate">{updatedAgoLabel}</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </aside>

//       {/* Content Wrapper - Adjusts for sidebar */}
//       <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'lg:ml-60' : 'lg:ml-16'} ${isMobile ? 'ml-0' : ''}`}>
//         {/* Top Bar (minimal version) */}
//         <header className={`sticky top-0 z-40 border-b transition-all duration-300 ${
//           isLightMode 
//             ? 'border-gray-200 bg-white' 
//             : 'border-white/15 bg-white/10 backdrop-blur-[28px] backdrop-saturate-150'
//         }`}>
//           <div className="flex items-center justify-between px-4 py-3 sm:px-6">
//             <div className="flex items-center gap-3">
//               <div className={`font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
//                 {getGreeting()}, <span className="text-blue-500">{userName}</span>
//               </div>
//             </div>
//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
//                   isLightMode
//                     ? 'border border-gray-200 bg-gray-50 text-black hover:bg-gray-100'
//                     : 'border border-white/20 bg-white/15 backdrop-blur-[24px] text-gray-300/95 hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
//                 }`}
//                 aria-label="Search"
//               >
//                 <IconSearch />
//               </button>
//               <button
//                 type="button"
//                 className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
//                   isLightMode
//                     ? 'border border-gray-200 bg-gray-50 text-black hover:bg-gray-100'
//                     : 'border border-white/20 bg-white/15 backdrop-blur-[24px] text-gray-300/95 hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
//                 }`}
//                 aria-label="Notifications"
//               >
//                 <IconBell />
//               </button>
                    
//               {/* Theme Toggle Button */}
//               <button
//                 type="button"
//                 onClick={() => setIsLightMode(!isLightMode)}
//                 className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
//                   isLightMode
//                     ? 'border border-gray-200 bg-gray-50 text-black hover:bg-gray-100'
//                     : 'border border-white/20 bg-white/15 backdrop-blur-[24px] text-gray-300/95 hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
//                 }`}
//                 aria-label="Toggle theme"
//               >
//                 {isLightMode ? <IconMoon /> : <IconSun />}
//               </button>
                    
//               <div className={`h-10 w-10 overflow-hidden rounded-3xl transition-all duration-300 ${
//                 isLightMode
//                   ? 'border border-gray-300 bg-gray-100'
//                   : 'border border-white/20 bg-white/15 backdrop-blur-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.5)]'
//               }`} />
//             </div>
//           </div>
//         </header>
        
//         {/* Main content area */}
//         {children}
//       </div>
//     </>
//   );

// }



import React, { useState } from "react";
import {
  IconBolt,
  IconRefresh,
  IconSearch,
  IconBell,
  IconUsers,
  IconChat,
  IconCheck,
  IconSpark,
  IconMenu,
  IconX,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const userName = "User";
  const isMobile = window.innerWidth < 768;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <IconBolt /> },
    { id: "leads", label: "Leads", icon: <IconUsers /> },
    { id: "conversations", label: "Conversations", icon: <IconChat /> },
    { id: "tasks", label: "Tasks", icon: <IconCheck /> },
    { id: "deals", label: "Deals", icon: <IconSpark /> }
  ];

  return (
    <>
      {/* Mobile Toggle */}
      {isMobile && (
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed top-4 left-4 z-50 h-10 w-10 rounded-2xl liquid-glass liquid-hover lg:hidden"
        >
          {isMobileMenuOpen ? <IconX /> : <IconMenu />}
        </button>
      )}

      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full transition-all duration-300 ${
          isMobile
            ? isMobileMenuOpen
              ? "w-64 translate-x-0"
              : "-translate-x-full w-64"
            : isExpanded
            ? "w-60"
            : "w-16"
        }`}
        onMouseEnter={() => !isMobile && setIsExpanded(true)}
        onMouseLeave={() => !isMobile && setIsExpanded(false)}
      >
        <div
          className={`h-full flex flex-col ${
            isLightMode ? "liquid-glass" : "liquid-glass-dark"
          }`}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-2xl grid place-items-center liquid-glass liquid-hover">
              <IconBolt />
            </div>
            {(isExpanded || isMobile) && (
              <span className="text-sm font-semibold">Dashboard</span>
            )}
          </div>

          {/* Menu */}
          <nav className="flex-1 px-2 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id);
                  if (isMobile) setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm liquid-hover ${
                  activePage === item.id
                    ? isLightMode
                      ? "bg-white/70 backdrop-blur-xl border border-white/40"
                      : "bg-white/20 backdrop-blur-xl border border-white/20"
                    : "hover:bg-white/20"
                }`}
              >
                {item.icon}
                {(isExpanded || isMobile) && item.label}
              </button>
            ))}
          </nav>

          {/* Bottom */}
          <div className="p-3 space-y-2">
            <button
              onClick={() => fetchAll({ isRefresh: true })}
              disabled={loading || refreshing}
              className="h-10 w-10 mx-auto rounded-2xl liquid-glass liquid-hover flex items-center justify-center"
            >
              <IconRefresh
                className={`${loading || refreshing ? "animate-spin" : ""}`}
              />
            </button>

            {(isExpanded || isMobile) && (
              <div className="text-xs text-center opacity-80">
                {updatedAgoLabel}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Content Wrapper */}
      <div
        className={`transition-all duration-300 ${
          isExpanded ? "lg:ml-60" : "lg:ml-16"
        }`}
      >
        {/* Top Bar */}
        <header
          className={`sticky top-0 z-40 ${
            isLightMode ? "liquid-glass" : "liquid-glass-dark"
          }`}
        >
          <div className="flex items-center justify-between px-6 py-3">
            <div className="font-semibold">
              {getGreeting()}, <span className="text-blue-500">{userName}</span>
            </div>

       <div className="flex items-center gap-2">
  <button className="h-10 w-10 rounded-full flex items-center justify-center liquid-glass liquid-hover">
    <IconSearch className="h-5 w-5" />
  </button>

  <button className="h-10 w-10 rounded-full flex items-center justify-center liquid-glass liquid-hover">
    <IconBell className="h-5 w-5" />
  </button>

  <button
    onClick={() => setIsLightMode(!isLightMode)}
    className="h-10 w-10 rounded-full flex items-center justify-center liquid-glass liquid-hover"
  >
    {isLightMode ? (
      <IconMoon className="h-5 w-5" />
    ) : (
      <IconSun className="h-5 w-5" />
    )}
  </button>
</div>
          </div>
        </header>

        {children}
      </div>
    </>
  );
}
