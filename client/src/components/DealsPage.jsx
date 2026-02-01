import React, { useMemo } from "react";
import { IconSpark, IconRefresh } from "./UIComponents";

export default function DealsPage({ data, loading, refreshing, fetchAll, isLightMode = false }) {
  // Process deals data
  const dealRows = useMemo(() => {
    return (data.deals || []).map((rec) => {
      const f = rec?.fields || rec || {};
      return {
        id: rec?.id ?? f.id ?? "",
        status: safeString(f["Status"] ?? f.status),
        createdAt: safeDate(rec?.createdTime ?? f["Created At"] ?? f.createdAt ?? f.created_at ?? f.date),
        value: safeNumber(f["Deal Value"] ?? f["Value"] ?? f["Amount"] ?? f.value ?? f.amount),
        name: safeString(f["Deal Name"] ?? f["Name"] ?? f["Title"]),
        contact: safeString(f["Contact"] ?? f["Customer"] ?? f["Client"]),
      };
    });
  }, [data.deals]);

  // Calculate metrics
  const totalDeals = dealRows.length;
  const wonDeals = dealRows.filter(d => (d.status || "").toLowerCase() === "won").length;
  const lostDeals = dealRows.filter(d => (d.status || "").toLowerCase() === "lost").length;
  const openDeals = totalDeals - wonDeals - lostDeals;
  
  const totalValue = dealRows.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const wonValue = dealRows
    .filter(d => (d.status || "").toLowerCase() === "won")
    .reduce((sum, deal) => sum + (deal.value || 0), 0);

  // Group by status
  const dealsByStatus = useMemo(() => {
    const groups = {};
    dealRows.forEach((deal) => {
      const status = deal.status || "Open";
      if (!groups[status]) groups[status] = [];
      groups[status].push(deal);
    });
    return groups;
  }, [dealRows]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>Deals</h1>
          <p className={`mt-1 ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Track your sales pipeline and revenue</p>
        </div>
        <button
          type="button"
          onClick={() => fetchAll({ isRefresh: true })}
          disabled={loading || refreshing}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
            isLightMode
              ? 'border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'border border-white/20 bg-white/15 backdrop-blur-[24px] text-gray-300 hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
          }`}>
        
          <IconRefresh className={`${(loading || refreshing) ? 'animate-spin' : ''}`} />
          {(loading || refreshing) ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
          }`}>
          <div className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-300/80'}`}>Total Deals</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{totalDeals}</div>
        </div>
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
          }`}>
          <div className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-300/80'}`}>Won Deals</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-green-600' : 'text-green-400'}`}>{wonDeals}</div>
        </div>
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
          }`}>
          <div className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-300/80'}`}>Open Deals</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-yellow-600' : 'text-yellow-400'}`}>{openDeals}</div>
        </div>
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
          }`}>
          <div className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-300/80'}`}>Total Value</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>${totalValue.toLocaleString()}</div>
        </div>
      </div>

      {/* Win Rate Card */}
      <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
        isLightMode
          ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
          : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-300/80'}`}>Win Rate</div>
            <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
              {totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0}%
            </div>
          </div>
          <div className="text-right">
            <div className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-300/80'}`}>Revenue Generated</div>
            <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-green-600' : 'text-green-400'}`}>
              ${wonValue.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Deals by Status */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(dealsByStatus).map(([status, deals]) => (
          <div key={status} className={`rounded-2xl backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
            isLightMode
              ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
              : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
          }`}>
            <div className={`p-5 border-b ${isLightMode ? 'border-gray-200/40' : 'border-white/10'}`}>
              <h3 className={`font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'} capitalize`}>{status}</h3>
              <p className={`text-sm mt-1 ${isLightMode ? 'text-black' : 'text-gray-400'}`}>{deals.length} deals</p>
            </div>
            <div className="p-5 space-y-3 max-h-80 overflow-y-auto">
              {deals.slice(0, 5).map((deal) => (
                <div key={deal.id} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${isLightMode ? 'bg-gray-100/50 hover:bg-gray-200/50' : 'bg-white/5 hover:bg-white/10'}`}>
                  <div>
                    <h4 className={`font-medium text-sm ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
                      {deal.name || "Unnamed Deal"}
                    </h4>
                    {deal.contact && (
                      <p className={`text-xs mt-1 ${isLightMode ? 'text-black' : 'text-gray-400'}`}>{deal.contact}</p>
                    )}
                  </div>
                  {deal.value && (
                    <div className="text-right">
                      <div className={`font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>${deal.value.toLocaleString()}</div>
                      {deal.createdAt && (
                        <div className={`text-xs ${isLightMode ? 'text-black' : 'text-gray-400'}`}>
                          {deal.createdAt.toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {deals.length === 0 && (
                <div className={`text-center py-4 ${isLightMode ? 'text-black' : 'text-gray-400'}`}>
                  No deals in this stage
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Deals Table */}
      <div className={`rounded-2xl backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
        isLightMode
          ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
          : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
      }`}>
        <div className={`p-5 border-b ${isLightMode ? 'border-gray-200/40' : 'border-white/10'}`}>
          <h2 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>Recent Deals</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${isLightMode ? 'border-gray-200/60' : 'border-white/10'}`}>
                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Deal Name</th>
                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Contact</th>
                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Value</th>
                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Status</th>
                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Created</th>
              </tr>
            </thead>
            <tbody className={isLightMode ? 'divide-y divide-gray-200' : 'divide-y divide-white/10'}>
              {dealRows.slice(0, 8).map((deal) => (
                <tr key={deal.id} className={`transition-colors ${isLightMode ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                  <td className={`px-5 py-4 text-sm ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{deal.name || "Unnamed Deal"}</td>
                  <td className={`px-5 py-4 text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>{deal.contact || "-"}</td>
                  <td className={`px-5 py-4 text-sm ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
                    {deal.value ? `$${deal.value.toLocaleString()}` : "-"}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      deal.status?.toLowerCase() === "won" ? "bg-green-500/20 text-green-300" :
                      deal.status?.toLowerCase() === "lost" ? "bg-red-500/20 text-red-300" :
                      "bg-blue-500/20 text-blue-300"
                    }`}>
                      {deal.status || "Open"}
                    </span>
                  </td>
                  <td className={`px-5 py-4 text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>
                    {deal.createdAt ? deal.createdAt.toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {dealRows.length === 0 && (
          <div className={`p-10 text-center ${isLightMode ? 'text-black' : 'text-gray-400'}`}>
            No deals found
          </div>
        )}
      </div>
    </div>
  );
}

// Utility functions
function safeString(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function safeNumber(v) {
  if (v === null || v === undefined || v === "") return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function safeDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isFinite(d.getTime()) ? d : null;
}