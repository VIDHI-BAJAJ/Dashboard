// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams , useNavigate} from "react-router-dom";

// export default function SegmentationDetails() {
//   const { segment } = useParams();
//   const [leads, setLeads] = useState([]);

//   useEffect(() => {
//     fetchLeads();
//   }, [segment]);

//   const navigate = useNavigate();


//   const fetchLeads = async () => {
//     try {
//       const response = await axios.get(
//         "https://dashboard-pura.onrender.com/api/leads"
//       );

//       const allLeads = response.data;

//       const filtered = allLeads.filter((lead) => {
//         const score = lead.fields?.["Lead Score (0–100)"];
//         if (score === undefined) return false;

//         if (segment === "hot") return score >= 81;
//         if (segment === "warm") return score >= 61 && score <= 80;
//         if (segment === "cold") return score <= 60;

//         return false;
//       });

//       setLeads(filtered);

//     } catch (error) {
//       console.error(error);
//     }
//   };

//  return (
//   <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
//     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">

//       {/* Header */}
//       <h2 className="text-lg sm:text-xl font-semibold mb-6 capitalize">
//         {segment} Leads
//       </h2>

//       {/* Scroll Wrapper */}
//       <div className="w-full overflow-x-auto">
        
//         <table className="min-w-[800px] w-full text-sm border border-gray-200 rounded-lg">
          
//           <thead className="bg-gray-100 text-gray-700 text-xs sm:text-sm uppercase tracking-wide">
//             <tr>
//               <th className="px-4 py-3 text-left whitespace-nowrap">Serial No</th>
//               <th className="px-4 py-3 text-left whitespace-nowrap">Name</th>
//               <th className="px-4 py-3 text-left whitespace-nowrap">Phone</th>
//               <th className="px-4 py-3 text-left whitespace-nowrap">Email</th>
//               <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
//               <th className="px-4 py-3 text-left whitespace-nowrap">Area</th>
//               <th className="px-4 py-3 text-left whitespace-nowrap">Intent</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y divide-gray-200">
//             {leads.map((lead, index) => (
//               <tr key={lead.id} className="hover:bg-gray-50 transition">
//                 <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
//                 <td className="px-4 py-3 whitespace-nowrap">
//                   {lead.fields?.["Full Name"]}
//                 </td>
//                 <td className="px-4 py-3 whitespace-nowrap">
//                   {lead.fields?.Phone}
//                 </td>
//                 <td className="px-4 py-3 whitespace-nowrap">
//                   {lead.fields?.Email}
//                 </td>
//                 <td className="px-4 py-3 whitespace-nowrap">
//                   {lead.fields?.Status}
//                 </td>
//                 <td className="px-4 py-3 whitespace-nowrap">
//                   {lead.fields?.Areas}
//                 </td>
//                 <td className="px-4 py-3 whitespace-nowrap">
//                   {lead.fields?.Intent}
//                 </td>
//               </tr>
//             ))}
//           </tbody>

//         </table>
//       </div>

//       {leads.length === 0 && (
//         <p className="text-gray-500 mt-4 text-center">
//           No leads found.
//         </p>
//       )}

//     </div>
//   </div>
// );

// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function SegmentationDetails() {
  const { segment } = useParams();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, [segment]);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        "https://dashboard-pura.onrender.com/api/leads"
      );

      const allLeads = response.data;

      const filtered = allLeads.filter((lead) => {
        const score = Number(lead.fields?.["Lead Score (0–100)"]);
        if (isNaN(score)) return false;

        if (segment === "hot") return score >= 81;
        if (segment === "warm") return score >= 61 && score <= 80;
        if (segment === "cold") return score <= 60;

        return false;
      });

      // Sort latest first
      filtered.sort(
        (a, b) => new Date(b.createdTime) - new Date(a.createdTime)
      );

      setLeads(filtered);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
  
        {/* Header */}
        <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900 capitalize">
            {segment} Leads
          </h2>
  
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition"
          >
            Back
          </button>
        </div>
  
        {/* Table */}
        <div className="overflow-x-auto">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
  
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serial No
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                      Phone
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Area
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                      Intent
                    </th>
                  </tr>
                </thead>
  
                <tbody className="bg-white divide-y divide-gray-200">
                  {leads.map((lead, index) => {
                    const serialNo = String(index + 1).padStart(2, "0");
  
                    const getStatusColor = (status) => {
                      const s = status?.toLowerCase();
                      switch (s) {
                        case "active":
                          return "bg-green-100 text-green-800";
                        case "pending":
                          return "bg-yellow-100 text-yellow-800";
                        case "converted":
                          return "bg-blue-100 text-blue-800";
                        case "inactive":
                          return "bg-gray-100 text-gray-800";
                        default:
                          return "bg-gray-100 text-gray-800";
                      }
                    };
  
                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {serialNo}
                        </td>
  
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.fields?.["Full Name"] || "—"}
                          </div>
                        </td>
  
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                          {lead.fields?.Phone || "—"}
                        </td>
  
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden md:table-cell">
                          {lead.fields?.Email || "—"}
                        </td>
  
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                              lead.fields?.Status
                            )}`}
                          >
                            {lead.fields?.Status || "Active"}
                          </span>
                        </td>
  
                        <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 hidden lg:table-cell">
                          {Array.isArray(lead.fields?.Areas)
                            ? lead.fields.Areas.join(", ")
                            : lead.fields?.Areas || "—"}
                        </td>
  
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden xl:table-cell">
                          {lead.fields?.Intent || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
  
              </table>
            </div>
          </div>
        </div>
  
        {/* Empty State */}
        {leads.length === 0 && (
          <div className="px-6 py-10 text-center">
            <p className="text-gray-500 text-sm">
              No leads found in this segment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
  
}
