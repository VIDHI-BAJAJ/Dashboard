import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";

export default function Segmentation() {
  const [chartData, setChartData] = useState([]);
  const [hotLeads, setHotLeads] = useState([]);
  const [warmLeads, setWarmLeads] = useState([]);
  const [coldLeads, setColdLeads] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        "https://dashboard-pura.onrender.com/api/leads"
      );

      const leads = Array.isArray(response.data)
        ? response.data
        : response.data.data;

      if (!leads) return;

      let hotArr = [];
      let warmArr = [];
      let coldArr = [];

      let s1 = 0; // 100-80
      let s2 = 0; // 80-60
      let s3 = 0; // 60-30
      let s4 = 0; // 30-0

      leads.forEach((lead) => {
        const score = Number(lead.fields?.["Lead Score (0–100)"]);
        const name = lead.fields?.["Full Name"];

        if (!name || isNaN(score)) return;

        if (score >= 80) s1++;
        else if (score >= 60) s2++;
        else if (score >= 30) s3++;
        else s4++;

        if (score >= 81) hotArr.push(lead);
        else if (score >= 61) warmArr.push(lead);
        else coldArr.push(lead);
      });

      setHotLeads(hotArr);
      setWarmLeads(warmArr);
      setColdLeads(coldArr);

      setChartData([
        { label: "100 - 80", value: s1, color: "#1e3a8a" },
                { label: "80 - 60", value: s2, color: "#2563eb" },
                { label: "60 - 30", value: s3, color: "#60a5fa" },
                { label: "30 - 0", value: s4, color: "#60a5fa" }
      ]);

    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  return (
    <div className="w-full px-8 py-6">

      {/* PIE CHART */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full md:w-1/2">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Lead Segmentation
        </h2>

        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="label"
                cx="40%"
                cy="50%"
                outerRadius={120}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              <Legend
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

{/* CARD COMPONENT */}
{[
  { title: "Hot", count: hotLeads.length, data: hotLeads,   color: "bg-gradient-to-r from-[#0f4c8a] to-[#1e6fd9]" },
  { title: "Warm", count: warmLeads.length, data: warmLeads, color: "bg-gradient-to-r from-[#155a9c] to-[#3b82f6]" },
  { title: "Cold", count: coldLeads.length, data: coldLeads, color: "bg-gradient-to-r from-[#1e6fd9] to-[#60a5fa]" }
].map((segment, idx) => (

  <div
    key={idx}
    onClick={() => navigate(`/segmentation/${segment.title.toLowerCase()}`)}
    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
  >

    {/* Header */}
    <div className={`${segment.color} text-white px-12 py-6 rounded-t-2xl`}>
      <h3 className="text-lg font-semibold tracking-wide text-center">
        {segment.title}
      </h3>
    </div>

 {/* Body */}
<div className="overflow-hidden">
  <table className="min-w-full">

    {/* Table Header */}
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-30"
        >
          Serial No
        </th>

        <th
          scope="col"
          className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
        >
          Name
        </th>
      </tr>
    </thead>

    {/* Table Body */}
    <tbody className="bg-white divide-y divide-gray-100">
      {segment.data.slice(0, 10).map((lead, index) => (
        <tr
          key={index}
          className="hover:bg-gray-50 transition"
        >
          <td className="px-6 py-3 text-sm text-gray-400">
            {index + 1}.
          </td>

          <td className="px-6 py-3 text-sm text-gray-800 font-medium">
            {lead.fields?.["Full Name"]}
          </td>
        </tr>
      ))}
    </tbody>

  </table>

  {/* More Count */}
  {segment.count > 10 && (
    <div className="px-6 py-4 text-sm text-blue-600 font-medium">
      + {segment.count - 10} more...
    </div>
  )}
</div>


  </div>

))}

</div>

    </div>
  );
}