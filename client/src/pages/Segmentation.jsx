import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        "https://dashboard-pura.onrender.com/api/leads"
      );

      const leads = response.data;

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
        { label: "Hot", value: hot, color: "#004f98" },
        { label: "Warm", value: warm, color: "#2b6cb0" },
        { label: "Cold", value: cold1, color: "#63a4ff" },
        { label: "Cold", value: cold2, color: "#63a4ff" }
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

        {/* Clickable Legend */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 text-center">

<div
  onClick={() => navigate("/segmentation/hot")}
  className="rounded-xl py-2 sm:py-3 text-white font-medium cursor-pointer hover:scale-105 transition"
  style={{ backgroundColor: "#004f98" }}
>
  Hot
</div>

<div
  onClick={() => navigate("/segmentation/warm")}
  className="rounded-xl py-2 sm:py-3 text-white font-medium cursor-pointer hover:scale-105 transition"
  style={{ backgroundColor: "#2b6cb0" }}
>
  Warm
</div>

<div
  onClick={() => navigate("/segmentation/cold")}
  className="rounded-xl py-2 sm:py-3 text-white font-medium cursor-pointer hover:scale-105 transition"
  style={{ backgroundColor: "#63a4ff" }}
>
  Cold
</div>



        </div>

      </div>
    </div>
  );
}
