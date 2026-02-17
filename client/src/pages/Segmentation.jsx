import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function Segmentation() {
  const [chartData, setChartData] = useState([]);
  const [filter, setFilter] = useState("month");

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        "https://dashboard-pura.onrender.com/api/leads"
      );

      let leads = response.data;
      const now = new Date();

      // 🔹 Time Filtering
      leads = leads.filter((lead) => {
        const createdDate = new Date(lead.createdTime);

        if (filter === "week") {
          const diffDays =
            (now - createdDate) / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        }

        if (filter === "month") {
          return (
            createdDate.getMonth() === now.getMonth() &&
            createdDate.getFullYear() === now.getFullYear()
          );
        }

        if (filter === "year") {
          return createdDate.getFullYear() === now.getFullYear();
        }

        return true;
      });

      // 🔹 Segmentation
      let hot = 0;
      let warm = 0;
      let cold1 = 0;
      let cold2 = 0;

      leads.forEach((lead) => {
        const score = lead.fields?.["Lead Score (0–100)"];
        if (score === undefined) return;

        if (score >= 81) hot++;
        else if (score >= 61) warm++;
        else if (score >= 31) cold1++;
        else cold2++;
      });

      setChartData([
        { label: "Hot", value: hot, color: "#004f98" },   // Dark Blue
        { label: "Warm", value: warm, color: "#2b6cb0" }, // Medium Blue
        { label: "Cold", value: cold1, color: "#63a4ff" },// Light Blue
        { label: "Cold", value: cold2, color: "#63a4ff" } // Same Light Blue
      ]);

    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  return (
  <div className="w-full px-0 lg:px-8 py-6">
    
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
          Lead Segmentation
        </h2>
      </div>

      {/* Chart */}
      <div className="w-full h-[280px] sm:h-[320px] md:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              vertical={false}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={35}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 text-center">
        <div
          className="rounded-xl py-2 sm:py-3 text-white font-medium text-sm sm:text-base"
          style={{ backgroundColor: "#004f98" }}
        >
          Hot
        </div>

        <div
          className="rounded-xl py-2 sm:py-3 text-white font-medium text-sm sm:text-base"
          style={{ backgroundColor: "#2b6cb0" }}
        >
          Warm
        </div>

        <div
          className="rounded-xl py-2 sm:py-3 text-white font-medium text-sm sm:text-base"
          style={{ backgroundColor: "#63a4ff" }}
        >
          Cold
        </div>
      </div>

    </div>
  </div>
);
}
