// import React from "react";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   BarChart,
//   Bar,
//   Cell,
// } from "recharts";
// import { Segment, StatusPill, ChartFrame, GlassTooltip, ThGlass, TdGlass } from "./UIComponents";

// export default function LeadsSection({ 
//   leadsOverviewSeries, 
//   leadsByStatus, 
//   leadsRows, 
//   loading, 
//   timeRange, 
//   setTimeRange,
//   percent,
//   isLightMode = false
// }) {
//   return (
//     <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
//       <div className={`lg:col-span-8 rounded-3xl p-5 sm:p-6 transition-all duration-500 hover:scale-[1.01] ${
//         isLightMode
//           ? 'border border-gray-200/40 bg-white/60 backdrop-blur-[36px] backdrop-saturate-150 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.4)] hover:bg-white/70 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]'
//           : 'border border-white/15 bg-white/10 backdrop-blur-[36px] backdrop-saturate-150 shadow-[0_8px_24px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/15 hover:border-white/25 hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)]'
//       }`}>
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
//           <div>
//             <div className={`text-base font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>Leads overview</div>
//             <div className={`mt-1 text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400/80'}`}>Volume trend for the selected time window</div>
//           </div>
//           <Segment
//             value={timeRange}
//             onChange={setTimeRange}
//             options={[
//               { id: "week", label: "This Week" },
//               { id: "month", label: "This Month" },
//             ]}
//             isLightMode={isLightMode}
//           />
//         </div>
//         <div className="mt-5 h-[260px]">
//           <ChartFrame loading={loading} empty={leadsOverviewSeries.length === 0} isLightMode={isLightMode}>
//             <ResponsiveContainer width="100%" height={220}>
//               <AreaChart data={leadsOverviewSeries}>
//                 <defs>
//                   <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor={isLightMode ? "#3b82f6" : "#60a5fa"} stopOpacity={0.2}/>
//                     <stop offset="95%" stopColor={isLightMode ? "#3b82f6" : "#60a5fa"} stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? "#e5e7eb" : "#ffffff20"} vertical={false} />
//                 <XAxis 
//                   dataKey="date" 
//                   tick={{ fontSize: 12, fill: isLightMode ? '#6b7280' : '#9ca3af' }}
//                   tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
//                   axisLine={false}
//                   tickLine={false}
//                 />
//                 <YAxis 
//                   tick={{ fontSize: 12, fill: isLightMode ? '#6b7280' : '#9ca3af' }}
//                   axisLine={false}
//                   tickLine={false}
//                 />
//                 <Tooltip content={<GlassTooltip isLightMode={isLightMode} />} />
//                 <Area type="monotone" dataKey="leads" stroke={isLightMode ? "#3b82f6" : "#60a5fa"} fill="url(#colorUv)" strokeWidth={2} />
//               </AreaChart>
//             </ResponsiveContainer>
//           </ChartFrame>
//         </div>
//       </div>

//       <div className={`lg:col-span-4 rounded-3xl p-5 sm:p-6 transition-all duration-500 hover:scale-[1.01] ${
//         isLightMode
//           ? 'border border-gray-200/40 bg-white/60 backdrop-blur-[36px] backdrop-saturate-150 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.4)] hover:bg-white/70 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]'
//           : 'border border-white/15 bg-white/10 backdrop-blur-[36px] backdrop-saturate-150 shadow-[0_8px_24px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/15 hover:border-white/25 hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)]'
//       }`}>
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <div className={`text-base font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>Leads by status</div>
//             <div className={`mt-1 text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400/80'}`}>Where leads are stuck</div>
//           </div>
//           <span className={`text-sm ${isLightMode ? 'text-gray-500' : 'text-gray-400/80'}`}>{leadsRows.length} total</span>
//         </div>
//         <div className="mt-5 space-y-3">
//           {leadsByStatus.map((row) => (
//             <div key={row.name} className="flex items-center justify-between gap-3">
//               <StatusPill status={row.name} isLightMode={isLightMode} />
//               <div className="flex items-center gap-3">
//                 <div className="h-2 w-28 overflow-hidden rounded-full bg-gray-200">
//                   <div
//                     className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
//                     style={{ width: `${percent(row.value, leadsRows.length)}%` }}
//                   />
//                 </div>
//                 <div className={`w-10 text-right text-sm font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{row.value}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//         <div className="mt-6 h-[180px]">
//           <ChartFrame loading={loading} empty={leadsByStatus.length === 0} isLightMode={isLightMode}>
//             <ResponsiveContainer width="100%" height={140}>
//               <BarChart data={leadsByStatus}>
//                 <CartesianGrid strokeDasharray="3 3" stroke={isLightMode ? "#e5e7eb" : "#ffffff20"} vertical={false} />
//                 <XAxis 
//                   dataKey="name" 
//                   tick={{ fontSize: 12, fill: isLightMode ? '#6b7280' : '#9ca3af' }}
//                   axisLine={false}
//                   tickLine={false}
//                 />
//                 <YAxis 
//                   tick={{ fontSize: 12, fill: isLightMode ? '#6b7280' : '#9ca3af' }}
//                   axisLine={false}
//                   tickLine={false}
//                 />
//                 <Tooltip content={<GlassTooltip isLightMode={isLightMode} />} />
//                 <Bar dataKey="value" radius={[4, 4, 0, 0]}>
//                   <Cell fill={isLightMode ? "#10b981" : "#34d399"} />
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </ChartFrame>
//         </div>
//       </div>
//     </section>
//   );
// }

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Segment,
  StatusPill,
  ChartFrame,
  GlassTooltip,
} from "./UIComponents";

export default function LeadsSection({
  leadsOverviewSeries,
  leadsByStatus,
  leadsRows,
  loading,
  timeRange,
  setTimeRange,
  percent,
  isLightMode = false,
}) {
  const glassBase =
    "rounded-2xl p-5 sm:p-6 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105";

  const glassLight =
    "bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50";

  const glassDark =
    "bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10";

  return (
    <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Leads Overview */}
      <div
        className={`lg:col-span-8 ${glassBase} ${
          isLightMode ? glassLight : glassDark
        }`}
      >
        {/* highlight line */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/40" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-base font-semibold">Leads overview</div>
            <div className="mt-1 text-sm opacity-70">
              Volume trend for the selected time window
            </div>
          </div>

          <Segment
            value={timeRange}
            onChange={setTimeRange}
            options={[
              { id: "week", label: "This Week" },
              { id: "month", label: "This Month" },
            ]}
            isLightMode={isLightMode}
          />
        </div>

        <div className="mt-5 h-[260px]">
          <ChartFrame
            loading={loading}
            empty={leadsOverviewSeries.length === 0}
            isLightMode={isLightMode}
          >
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={leadsOverviewSeries}>
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isLightMode ? "#3b82f6" : "#60a5fa"}
                      stopOpacity={0.25}
                    />
                    <stop offset="95%" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isLightMode ? "#e5e7eb" : "#ffffff20"}
                  vertical={false}
                />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12, fill: isLightMode ? "#6b7280" : "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: isLightMode ? "#6b7280" : "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<GlassTooltip isLightMode={isLightMode} />} />

                <Area
                  type="monotone"
                  dataKey="leads"
                  stroke={isLightMode ? "#3b82f6" : "#60a5fa"}
                  strokeWidth={2}
                  fill="url(#leadsGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>
      </div>

      {/* Leads By Status */}
      <div
        className={`lg:col-span-4 ${glassBase} ${
          isLightMode ? glassLight : glassDark
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold">Leads by status</div>
            <div className="mt-1 text-sm opacity-70">
              Where leads are stuck
            </div>
          </div>
          <span className="text-sm opacity-70">
            {leadsRows.length} total
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {leadsByStatus.map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between gap-3"
            >
              <StatusPill status={row.name} isLightMode={isLightMode} />

              <div className="flex items-center gap-3">
                <div
                  className={`h-2 w-28 overflow-hidden rounded-full ${
                    isLightMode ? "bg-gray-200" : "bg-white/20"
                  }`}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                    style={{
                      width: `${percent(row.value, leadsRows.length)}%`,
                    }}
                  />
                </div>

                <div className="w-10 text-right text-sm font-semibold">
                  {row.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 h-[180px]">
          <ChartFrame
            loading={loading}
            empty={leadsByStatus.length === 0}
            isLightMode={isLightMode}
          >
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={leadsByStatus}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isLightMode ? "#e5e7eb" : "#ffffff20"}
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 12,
                    fill: isLightMode ? "#6b7280" : "#9ca3af",
                  }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fontSize: 12,
                    fill: isLightMode ? "#6b7280" : "#9ca3af",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={<GlassTooltip isLightMode={isLightMode} />}
                />

                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  <Cell fill={isLightMode ? "#10b981" : "#34d399"} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>
      </div>
    </section>
  );
}
