// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import {
//   PieChart,
//   Pie,
//   Tooltip,
//   ResponsiveContainer,
//   Cell,
//   Legend
// } from "recharts";

// export default function Segmentation() {
//   const [chartData, setChartData] = useState([]);
//   const [hotLeads, setHotLeads] = useState([]);
//   const [warmLeads, setWarmLeads] = useState([]);
//   const [coldLeads, setColdLeads] = useState([]);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const fetchLeads = async () => {
//     try {
//       const response = await axios.get(
//         "https://dashboard-pura.onrender.com/api/leads"
//       );

//       const leads = Array.isArray(response.data)
//         ? response.data
//         : response.data.data;

//       if (!leads) return;

//       let hotArr = [];
//       let warmArr = [];
//       let coldArr = [];

//       let s1 = 0; // 100-80
//       let s2 = 0; // 80-60
//       let s3 = 0; // 60-30
//       let s4 = 0; // 30-0

//       leads.forEach((lead) => {
//         const score = Number(lead.fields?.["Lead Score (0–100)"]);
//         const name = lead.fields?.["Full Name"];

//         if (!name || isNaN(score)) return;

//         if (score >= 80) s1++;
//         else if (score >= 60) s2++;
//         else if (score >= 30) s3++;
//         else s4++;

//         if (score >= 81) hotArr.push(lead);
//         else if (score >= 61) warmArr.push(lead);
//         else coldArr.push(lead);
//       });

//       setHotLeads(hotArr);
//       setWarmLeads(warmArr);
//       setColdLeads(coldArr);

//       setChartData([
//         { label: "100 - 80", value: s1, color: "#1e3a8a" },
//                 { label: "80 - 60", value: s2, color: "#2563eb" },
//                 { label: "60 - 30", value: s3, color: "#60a5fa" },
//                 { label: "30 - 0", value: s4, color: "#60a5fa" }
//       ]);

//     } catch (error) {
//       console.error("Error fetching leads:", error);
//     }
//   };

//   return (
//     <div className="w-full px-8 py-6">

//       {/* PIE CHART */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full md:w-1/2">
//         <h2 className="text-xl font-semibold text-gray-800 mb-6">
//           Lead Segmentation
//         </h2>

//         <div className="w-full h-[400px]">
//           <ResponsiveContainer width="100%" height="100%">
//             <PieChart>
//               <Pie
//                 data={chartData}
//                 dataKey="value"
//                 nameKey="label"
//                 cx="40%"
//                 cy="50%"
//                 outerRadius={120}
//                 label={({ percent }) =>
//                   `${(percent * 100).toFixed(0)}%`
//                 }
//                 labelLine={false}
//               >
//                 {chartData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>

//               <Legend
//                 layout="vertical"
//                 verticalAlign="middle"
//                 align="right"
//               />

//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

      
// <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

// {/* CARD COMPONENT */}
// {[
//   { title: "Hot", count: hotLeads.length, data: hotLeads,   color: "bg-gradient-to-r from-[#0f4c8a] to-[#1e6fd9]" },
//   { title: "Warm", count: warmLeads.length, data: warmLeads, color: "bg-gradient-to-r from-[#155a9c] to-[#3b82f6]" },
//   { title: "Cold", count: coldLeads.length, data: coldLeads, color: "bg-gradient-to-r from-[#1e6fd9] to-[#60a5fa]" }
// ].map((segment, idx) => (

//   <div
//     key={idx}
//     onClick={() => navigate(`/segmentation/${segment.title.toLowerCase()}`)}
//     className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
//   >

//     {/* Header */}
//     <div className={`${segment.color} text-white px-12 py-6 rounded-t-2xl`}>
//       <h3 className="text-lg font-semibold tracking-wide text-center">
//         {segment.title}
//       </h3>
//     </div>

//  {/* Body */}
// <div className="overflow-hidden">
//   <table className="min-w-full">

//     {/* Table Header */}
//     <thead className="bg-gray-50 border-b border-gray-200">
//       <tr>
//         <th
//           scope="col"
//           className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-30"
//         >
//           Serial No
//         </th>

//         <th
//           scope="col"
//           className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
//         >
//           Name
//         </th>
//       </tr>
//     </thead>

//     {/* Table Body */}
//     <tbody className="bg-white divide-y divide-gray-100">
//       {segment.data.slice(0, 10).map((lead, index) => (
//         <tr
//           key={index}
//           className="hover:bg-gray-50 transition"
//         >
//           <td className="px-6 py-3 text-sm text-gray-400">
//             {index + 1}.
//           </td>

//           <td className="px-6 py-3 text-sm text-gray-800 font-medium">
//             {lead.fields?.["Full Name"]}
//           </td>
//         </tr>
//       ))}
//     </tbody>

//   </table>

//   {/* More Count */}
//   {segment.count > 10 && (
//     <div className="px-6 py-4 text-sm text-blue-600 font-medium">
//       + {segment.count - 10} more...
//     </div>
//   )}
// </div>


//   </div>

// ))}

// </div>

//     </div>
//   );
// }



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

      setHotLeads(hotArr);
      setWarmLeads(warmArr);
      setColdLeads(coldArr);

      setChartData([
        { label: "100 - 80", value: s1, color: "#1e3a8a" },
        { label: "80 - 60", value: s2, color: "#2563eb" },
        { label: "60 - 30", value: s3, color: "#60a5fa" },
        { label: "30 - 0",  value: s4, color: "#93c5fd" }
      ]);

    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const total = hotLeads.length + warmLeads.length + coldLeads.length;

  return (
    <div className="w-full px-8 py-6">

      {/* PIE CHART + SUMMARY */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 w-full">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Lead Segmentation</h2>

        <div className="flex flex-col md:flex-row gap-8 items-center">

          {/* Pie Chart */}
          <div className="w-full md:w-1/2 h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="label"
                  cx="40%"
                  cy="50%"
                  outerRadius={120}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Summary Panel */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">

            <h3 className="text-base font-semibold text-gray-700 mb-1">Summary</h3>

            {/* Total */}
            <div className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-200">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Total Leads</p>
              <p className="text-3xl font-bold text-gray-800">{total}</p>
            </div>

            {/* Hot / Warm / Cold Cards */}
            <div className="grid grid-cols-3 gap-3">

              <div className="rounded-xl px-4 py-4 bg-gradient-to-br from-[#0f4c8a] to-[#1e6fd9] text-white">
                <p className="text-xs uppercase tracking-wide font-semibold opacity-80 mb-1">🔥 Hot</p>
                <p className="text-2xl font-bold">{hotLeads.length}</p>
                <p className="text-xs opacity-70 mt-1">Score 81–100</p>
              </div>

              <div className="rounded-xl px-4 py-4 bg-gradient-to-br from-[#155a9c] to-[#3b82f6] text-white">
                <p className="text-xs uppercase tracking-wide font-semibold opacity-80 mb-1">☀️ Warm</p>
                <p className="text-2xl font-bold">{warmLeads.length}</p>
                <p className="text-xs opacity-70 mt-1">Score 61–80</p>
              </div>

              <div className="rounded-xl px-4 py-4 bg-gradient-to-br from-[#1e6fd9] to-[#60a5fa] text-white">
                <p className="text-xs uppercase tracking-wide font-semibold opacity-80 mb-1">❄️ Cold</p>
                <p className="text-2xl font-bold">{coldLeads.length}</p>
                <p className="text-xs opacity-70 mt-1">Score 0–60</p>
              </div>

            </div>

            {/* Progress Bar Breakdown */}
            <div className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-200 space-y-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Breakdown</p>

              {[
                { label: "Hot",  count: hotLeads.length,  color: "bg-[#0f4c8a]" },
                { label: "Warm", count: warmLeads.length, color: "bg-[#3b82f6]" },
                { label: "Cold", count: coldLeads.length, color: "bg-[#60a5fa]" },
              ].map((seg) => {
                const pct = total > 0 ? ((seg.count / total) * 100).toFixed(1) : 0;
                return (
                  <div key={seg.label}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span className="font-medium">{seg.label}</span>
                      <span>{seg.count} leads · {pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`${seg.color} h-1.5 rounded-full`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* HOT / WARM / COLD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        {[
          { title: "Hot",  count: hotLeads.length,  data: hotLeads,  color: "bg-gradient-to-r from-[#0f4c8a] to-[#1e6fd9]" },
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

                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-30">
                      Serial No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {segment.data.slice(0, 10).map((lead, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-3 text-sm text-gray-400">{index + 1}.</td>
                      <td className="px-6 py-3 text-sm text-gray-800 font-medium">
                        {lead.fields?.["Full Name"]}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>

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