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

      const leads = response.data;

      let hotArr = [];
      let warmArr = [];
      let coldArr = [];

      let s1 = 0;
      let s2 = 0;
      let s3 = 0;
      let s4 = 0;

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

      hotArr.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
      warmArr.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));
      coldArr.sort((a, b) => new Date(b.createdTime) - new Date(a.createdTime));

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

      {/* GRAPH */}
      {/* GRAPH */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
  <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">
    Lead Segmentation
  </h2>

  {/* Responsive Height */}
  <div className="w-full h-[300px] sm:h-[400px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 50
        }}
      >
        <CartesianGrid vertical={false} stroke="#e5e7eb" />

        {/* X Axis */}
<XAxis
  dataKey="label"
  tick={({ x, y, payload }) => (
    <text
      x={x}
      y={y + 10}
      textAnchor="middle"
      className="fill-gray-700 text-[10px] sm:text-[14px] md:text-[16px]"
    >
      {payload.value}
    </text>
  )}
  label={{
    value: "Lead Segmentation",
    position: "insideBottom",
    offset: -40,
    style: { fontSize: 14 }
  }}
/>

        < YAxis
  tick={({ x, y, payload }) => (
    <text
      x={x - 10}
      y={y}
      textAnchor="middle"
      className="fill-gray-700  text-[10px] sm:text-[14px] md:text-[14px]"
    >
      {payload.value}
    </text>
  )}
  label={{
    value: "Leads",
    angle: -90,
    position: "insideLeft",
    style: { fontSize: 14 }
  }}
/>

        <Tooltip />

        {/* Responsive Bar Size */}
        <Bar
          dataKey="value"
          radius={[6, 6, 0, 0]}
          barSize={35}
        >
          {chartData.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>


      {/* 3 CARDS */}
      {/* <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">

        <div
          onClick={() => navigate("/segmentation/hot")}
          className="w-full md:w-1/3 border rounded-xl shadow-md cursor-pointer hover:shadow-lg transition"
        >
          <div className="bg-blue-900 text-white text-center py-3 font-semibold rounded-t-xl">
            Hot ({hotLeads.length})
          </div>

          <div className="p-4">
            {hotLeads.slice(0, 10).map((lead, index) => (
              <div key={lead.id} className="border-b py-1  text-gray-700 text-xs sm:text-sm uppercase">
                {index + 1}. {lead.fields?.["Full Name"]}
              </div>
            ))}

            {hotLeads.length > 10 && (
              <div className="text-blue-600 text-sm mt-2">
                + {hotLeads.length - 10} more...
              </div>
            )}
          </div>
        </div>


        <div
          onClick={() => navigate("/segmentation/warm")}
          className="w-full md:w-1/3 border rounded-xl shadow-md cursor-pointer hover:shadow-lg transition"
        >
          <div className="bg-blue-700 text-white text-center py-3 font-semibold rounded-t-xl">
            Warm ({warmLeads.length})
          </div>

          <div className="p-4">
            {warmLeads.slice(0, 10).map((lead, index) => (
              <div key={lead.id} className="border-b py-1 text-gray-700 text-xs sm:text-sm uppercase">
                {index + 1}. {lead.fields?.["Full Name"]}
              </div>
            ))}

            {warmLeads.length > 10 && (
              <div className="text-blue-600 text-sm mt-2">
                + {warmLeads.length - 10} more...
              </div>
            )}
          </div>
        </div>

        
        <div
          onClick={() => navigate("/segmentation/cold")}
          className="w-full md:w-1/3 border rounded-xl shadow-md cursor-pointer hover:shadow-lg transition"
        >
          <div className="bg-blue-400 text-white text-center py-3 font-semibold rounded-t-xl">
            Cold ({coldLeads.length})
          </div>

          <div className="p-4">
            {coldLeads.slice(0, 10).map((lead, index) => (
              <div key={lead.id} className="border-b py-1 text-gray-700 text-xs sm:text-sm uppercase">
                {index + 1}. {lead.fields?.["Full Name"]}
              </div>
            ))}

            {coldLeads.length > 10 && (
              <div className="text-blue-600 text-sm mt-2">
                + {coldLeads.length - 10} more...
              </div>
            )}
          </div>
        </div>

      </div> */}


<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

{/* CARD COMPONENT */}
{[
  { title: "Hot", count: hotLeads.length, data: hotLeads, color: "bg-blue-900" },
  { title: "Warm", count: warmLeads.length, data: warmLeads, color: "bg-blue-700" },
  { title: "Cold", count: coldLeads.length, data: coldLeads, color: "bg-blue-500" }
].map((segment, idx) => (

  <div
    key={idx}
    onClick={() => navigate(`/segmentation/${segment.title.toLowerCase()}`)}
    className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
  >

    {/* Header */}
    <div className={`${segment.color} text-white px-12 py-6 rounded-t-2xl`}>
      <h3 className="text-sm font-semibold tracking-wide">
        {segment.title} ({segment.count})
      </h3>
    </div>

    {/* Body */}
    <div >

      {segment.data.slice(0, 10).map((lead, index) => (
        <div
          key={index}
          className="flex items-center justify-between py-2 border-b border-gray-200 last:border-none pl-4"
        >
          <span className="text-xs text-gray-400 w-6">
            {index + 1}.
          </span>

          <span className="flex-1 text-sm text-gray-700 font-medium truncate">
            {lead.fields?.["Full Name"]}
          </span>
        </div>
      ))}

      {segment.count > 10 && (
        <div className="mt-3 text-sm text-blue-600 font-medium pl-4 pb-5">
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
