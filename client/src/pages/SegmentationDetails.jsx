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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
            >
              ← Back
            </button>

            <h2 className="text-lg sm:text-xl font-semibold capitalize">
              {segment} Leads
            </h2>
          </div>

          <div className="text-sm text-gray-500">
            Total: {leads.length}
          </div>

        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-[900px] w-full text-sm">
            <thead className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Serial</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Area</th>
                <th className="px-4 py-3 text-left">Intent</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {leads.map((lead, index) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{lead.fields?.["Full Name"]}</td>
                  <td className="px-4 py-3">{lead.fields?.Phone}</td>
                  <td className="px-4 py-3">{lead.fields?.Email}</td>
                  <td className="px-4 py-3">{lead.fields?.Status}</td>
                  <td className="px-4 py-3">{lead.fields?.Areas}</td>
                  <td className="px-4 py-3">{lead.fields?.Intent}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {leads.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No leads found.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
