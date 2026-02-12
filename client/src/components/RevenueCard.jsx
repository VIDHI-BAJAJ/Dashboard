import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import axios from "axios";

const RevenueCard = () => {
  const [data, setData] = useState({
    percentage: 0,
    achievedRevenue: 0,
  });

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      const res = await axios.get("/api/revenue-stats");
      setData(res.data);
    } catch (err) {
      console.error("Revenue fetch error:", err);
    }
  };

  const chartData = [
    { name: "Achieved", value: data.percentage },
    { name: "Remaining", value: 100 - data.percentage }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-600 text-sm font-medium">Profit</p>
        <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
          Today
        </span>
      </div>

      {/* Bigger Chart */}
      <div className="relative h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
            >
              <Cell fill="#000000" />
              <Cell fill="#E5E7EB" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-black">
            ₹{Number(data.achievedRevenue).toLocaleString()}
          </h2>
          <p className="text-sm text-gray-500">
            +{data.percentage}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueCard;
