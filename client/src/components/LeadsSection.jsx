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
} from "recharts";
import { Segment, StatusPill, ChartFrame, GlassTooltip, ThGlass, TdGlass } from "./UIComponents";

export default function LeadsSection({ 
  leadsOverviewSeries, 
  leadsByStatus, 
  leadsRows, 
  loading, 
  timeRange, 
  setTimeRange,
  percent 
}) {
  return (
    <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="lg:col-span-8 rounded-3xl border border-white/15 backdrop-blur-[22px] backdrop-saturate-150 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-base font-semibold text-gray-100">Leads overview</div>
            <div className="mt-1 text-sm text-gray-400/80">Volume trend for the selected time window</div>
          </div>
          <Segment
            value={timeRange}
            onChange={setTimeRange}
            options={[
              { id: "week", label: "This Week" },
              { id: "month", label: "This Month" },
            ]}
          />
        </div>
        <div className="mt-5 h-[260px]">
          <ChartFrame loading={loading} empty={leadsOverviewSeries.length === 0}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadsOverviewSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<GlassTooltip />} />
                <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2.5} fill="url(#leadFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>
      </div>

      <div className="lg:col-span-4 rounded-3xl border border-white/15 backdrop-blur-[22px] backdrop-saturate-150 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-gray-100">Leads by status</div>
            <div className="mt-1 text-sm text-gray-400/80">Where leads are stuck</div>
          </div>
          <span className="text-sm text-gray-400/80">{leadsRows.length} total</span>
        </div>
        <div className="mt-5 space-y-3">
          {leadsByStatus.map((row) => (
            <div key={row.name} className="flex items-center justify-between gap-3">
              <StatusPill status={row.name} />
              <div className="flex items-center gap-3">
                <div className="h-2 w-28 overflow-hidden rounded-full bg-white/12 backdrop-blur-sm">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                    style={{ width: `${percent(row.value, leadsRows.length)}%` }}
                  />
                </div>
                <div className="w-10 text-right text-sm font-semibold text-gray-100">{row.value}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 h-[180px]">
          <ChartFrame loading={loading} empty={leadsByStatus.length === 0}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsByStatus} margin={{ top: 10, right: 6, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="name" tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.7)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<GlassTooltip />} />
                <Bar dataKey="value" fill="rgba(59,130,246,0.8)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>
      </div>
    </section>
  );
}