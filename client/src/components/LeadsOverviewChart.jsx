import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const LeadsOverviewChart = ({
  data = [],
  timeRange = "this-month",
  onTimeRangeChange = () => {},
}) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-md">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const timeRangeOptions = [
    { value: "this-week", label: "This Week" },
    { value: "this-month", label: "This Month" },
    { value: "this-year", label: "This Year" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 h-96">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Leads Overview
        </h3>

        <select
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
          className="text-xs border border-gray-300 rounded-md px-3 py-1 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-400"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <CartesianGrid
            vertical={false}
            stroke="#e5e7eb"
            strokeDasharray="2 2"
          />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="totalLeads"
            stroke="#004f98"
            fill="#004f98"
            fillOpacity={0.15}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LeadsOverviewChart;
