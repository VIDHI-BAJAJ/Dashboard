import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function SegmentationDetails() {
  const { segment } = useParams();
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
        const score = lead.fields?.["Lead Score (0–100)"];
        if (score === undefined) return false;

        if (segment === "hot") return score >= 81;
        if (segment === "warm") return score >= 61 && score <= 80;
        if (segment === "cold") return score <= 60;

        return false;
      });

      setLeads(filtered);

    } catch (error) {
      console.error(error);
    }
  };

 return (
  <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">

      {/* Header */}
      <h2 className="text-lg sm:text-xl font-semibold mb-6 capitalize">
        {segment} Leads
      </h2>

      {/* Scroll Wrapper */}
      <div className="w-full overflow-x-auto">
        
        <table className="min-w-[800px] w-full text-sm border border-gray-200 rounded-lg">
          
          <thead className="bg-gray-100 text-gray-700 text-xs sm:text-sm uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left whitespace-nowrap">Serial No</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Name</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Phone</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Email</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Status</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Area</th>
              <th className="px-4 py-3 text-left whitespace-nowrap">Intent</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {leads.map((lead, index) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3 whitespace-nowrap">{index + 1}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {lead.fields?.["Full Name"]}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {lead.fields?.Phone}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {lead.fields?.Email}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {lead.fields?.Status}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {lead.fields?.Areas}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {lead.fields?.Intent}
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {leads.length === 0 && (
        <p className="text-gray-500 mt-4 text-center">
          No leads found.
        </p>
      )}

    </div>
  </div>
);

}
