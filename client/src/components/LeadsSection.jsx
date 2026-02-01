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
  RadialBarChart,
  PolarAngleAxis,
  LineChart,
  Line,
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
  targetRevenue = 10000000,
  achievedRevenue = 0,
}) {
  const glassBase =
    "rounded-2xl p-5 sm:p-6 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105";

  const glassLight =
    "bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50";

  const glassDark =
    "bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10";

  const getMotivationalText = (percentage) => {
    if (percentage >= 100) {
      return "🎉 Target Achieved! Amazing!";
    } else if (percentage >= 80) {
      return "🔥 80% Complete - Almost There!";
    } else if (percentage >= 60) {
      return "💪 60% Complete - Keep Pushing!";
    } else if (percentage >= 40) {
      return "👏 40% Complete - Good Progress!";
    } else if (percentage >= 20) {
      return "🚀 20% Complete - Good Start!";
    } else if (percentage > 0) {
      return "🌱 Let's Get Started!";
    }
    return "🎯 Begin Your Journey!";
  };

  const calculatePercentage = (achieved, target) => {
    if (target === 0) return 0;
    const percentage = (achieved / target) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };

  const percentage = calculatePercentage(achievedRevenue, targetRevenue);

  return (
    <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-15">
      {/* Revenue/Profit Card */}
      <div
        className={`lg:col-span-4 ${glassBase} ${
          isLightMode ? glassLight : glassDark
        }`}
      >
        <div className="flex flex-col gap-2">
          <div className="text-base font-semibold">Revenue Progress</div>
          <div className="text-sm text-center mb-2 font-medium text-white dark:text-gray-200">
            {getMotivationalText(percentage)}
          </div>
        </div>

        <div className="flex items-center justify-center py-6">
          <div className="relative w-64">
            {/* SVG Gauge */}
            <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              
              {/* Background arc (gray) */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke={isLightMode ? "#e5e7eb" : "#374151"}
                strokeWidth="50"
                strokeLinecap="round"
              />
              
              {/* Progress arc (gradient) */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="url(#revenueGradient)"
                strokeWidth="50"
                strokeLinecap="round"
                strokeDasharray={`${(percentage / 100) * 251.2} 251.2`}
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: 'drop-shadow(0 4px 12px rgba(59, 130, 246, 0.5))'
                }}
              />
            </svg>
            
            {/* Center value */}
            <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-2">
              <div className="text-xl font-bold mt-12">
                {new Intl.NumberFormat('en-IN', { 
                  style: 'currency', 
                  currency: 'INR', 
                  minimumFractionDigits: 0, 
                  maximumFractionDigits: 0 
                }).format(achievedRevenue)}
              </div>
            </div>
          </div>
        </div>
        
        {/* Target info */}
        <div className="text-center pt-2 space-y-1">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Target: {new Intl.NumberFormat('en-IN', { 
              style: 'currency', 
              currency: 'INR', 
              minimumFractionDigits: 0, 
              maximumFractionDigits: 0 
            }).format(targetRevenue)}
          </div>
          <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Avg. Budget from {leadsRows.length} leads
          </div>
        </div>
      </div>

      {/* Leads Overview */}
      <div
        className={`lg:col-span-7 ${glassBase} ${
          isLightMode ? glassLight : glassDark
        }`}
      >
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
              <LineChart data={leadsOverviewSeries}>
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isLightMode ? "#3b82f6" : "#60a5fa"}
                      stopOpacity={0.15}
                    />
                    <stop
                      offset="95%"
                      stopColor={isLightMode ? "#3b82f6" : "#60a5fa"}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  horizontal={true}
                  vertical={false}
                  stroke={isLightMode ? "#e5e7eb40" : "#ffffff10"}
                  strokeDasharray="2 2"
                />

                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: isLightMode ? "#6b7280" : "#9ca3af", opacity: 0.8 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: isLightMode ? "#6b7280" : "#9ca3af", opacity: 0.8 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip content={<GlassTooltip isLightMode={isLightMode} />} />

                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke={isLightMode ? "#3b82f6" : "#60a5fa"}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  dot={{ r: 2, strokeWidth: 0, fill: isLightMode ? "#3b82f6" : "#60a5fa", opacity: 0.6 }}
                  activeDot={{ r: 5, strokeWidth: 1, fill: isLightMode ? "#ffffff" : "#111827", stroke: isLightMode ? "#3b82f6" : "#60a5fa" }}
                  fill="url(#leadsGradient)"
                />
              </LineChart>
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
                  className={`h-2 w-28 rounded-full ${
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
      </div>
    </section>
  );
}