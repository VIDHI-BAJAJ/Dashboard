import React from "react";
import { IconUsers, IconRefresh } from "./UIComponents";

export default function LeadDetails({ lead, onBack, loading, refreshing, fetchAll, isLightMode = false }) {
  if (!lead) {
    return (
      <div className={`rounded-2xl backdrop-blur-xl border rounded-2xl p-10 text-center ${
        isLightMode
          ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl'
          : 'bg-white/5 border-white/10 text-gray-100 shadow-xl'
      }`}>
        <p className={isLightMode ? 'text-gray-500' : 'text-gray-400'}>
          No lead selected
        </p>
      </div>
    );
  }

  // Extract fields from the lead
  const fields = lead.fields || {};
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
            Lead Details
          </h1>
          <p className={`mt-1 ${isLightMode ? 'text-black' : 'text-gray-400'}`}>
            View comprehensive information about this lead
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => fetchAll({ isRefresh: true })}
            disabled={loading || refreshing}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 min-w-[100px] ${
              isLightMode
                ? 'border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'border border-white/20 bg-white/15 backdrop-blur-[24px] text-gray-300 hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
            }`}
          >
            <IconRefresh className={`${(loading || refreshing) ? 'animate-spin' : ''}`} />
            {(loading || refreshing) ? "Refreshing…" : "Refresh"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 min-w-[120px] ${
              isLightMode
                ? 'border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'border border-white/20 bg-white/15 backdrop-blur-[24px] text-gray-300 hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
            }`}
          >
            ← Back to Leads
          </button>
        </div>
      </div>

      {/* Lead Info Card */}
      <div className={`rounded-2xl backdrop-blur-xl border rounded-2xl transition-all duration-300 ${
        isLightMode
          ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl'
          : 'bg-white/5 border-white/10 text-gray-100 shadow-xl'
      }`}>
        <div className={`p-5 border-b ${isLightMode ? 'border-gray-200/40' : 'border-white/10'}`}>
          <h2 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
            Lead Information
          </h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Full Name
              </label>
              <div className={`mt-1 text-base ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
                {fields["Full Name"] || "-"}
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Phone
              </label>
              <div className={`mt-1 text-base ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
                {fields["Phone"] || "-"}
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Email
              </label>
              <div className={`mt-1 text-base ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
                {fields["Email"] || "-"}
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Status
              </label>
              <div className={`mt-1`}>
                <span className={`inline-flex px-2 py-1 text-sm rounded-full ${
                  isLightMode
                    ? (fields["Status"] === "New" ? "bg-blue-100 text-blue-700" :
                       fields["Status"] === "Engaged" ? "bg-yellow-100 text-yellow-700" :
                       fields["Status"] === "Won" ? "bg-green-100 text-green-700" :
                       fields["Status"] === "Lost" ? "bg-red-100 text-red-700" :
                       "bg-gray-100 text-gray-700")
                    : (fields["Status"] === "New" ? "bg-blue-500/20 text-blue-300" :
                       fields["Status"] === "Engaged" ? "bg-yellow-500/20 text-yellow-300" :
                       fields["Status"] === "Won" ? "bg-green-500/20 text-green-300" :
                       fields["Status"] === "Lost" ? "bg-red-500/20 text-red-300" :
                       "bg-gray-500/20 text-gray-300")
                }`}>
                  {fields["Status"] || "New"}
                </span>
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Intent
              </label>
              <div className={`mt-1 text-base ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
                {fields["Intent"] || "-"}
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Lead Source
              </label>
              <div className={`mt-1 text-base ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
                {fields["Lead Source"] || "-"}
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Budget Range
              </label>
              <div className={`mt-1 text-base ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
                {fields["Budget (Min)"] && fields["Budget (Max)"] 
                  ? `${fields["Budget (Min)"]} - ${fields["Budget (Max)"]}`
                  : fields["Budget (Min)"] 
                    ? `Min: ${fields["Budget (Min)"]}`
                    : fields["Budget (Max)"]
                      ? `Max: ${fields["Budget (Max)"]}`
                      : "-"}
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Lead Score
              </label>
              <div className={`mt-1 text-base ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
                {fields["Lead Score (0-100)"] || "-"}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className={`block text-sm font-medium ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Notes
              </label>
              <div className={`mt-1 text-base ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
                {fields["Notes"] || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Card */}
      <div className={`rounded-2xl backdrop-blur-xl border rounded-2xl transition-all duration-300 ${
        isLightMode
          ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl'
          : 'bg-white/5 border-white/10 text-gray-100 shadow-xl'
      }`}>
        <div className={`p-5 border-b ${isLightMode ? 'border-gray-200/40' : 'border-white/10'}`}>
          <h2 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
            Additional Information
          </h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Created At
              </label>
              <div className={`mt-1 text-base ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
                {lead.createdTime 
                  ? new Date(lead.createdTime).toLocaleString() 
                  : "-"}
              </div>
            </div>
            <div>
              <label className={`block text-sm font-medium ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                Lead ID
              </label>
              <div className={`mt-1 text-base font-mono ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
                {lead.id || "-"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}