import React, { useEffect, useMemo, useState } from "react";
import { IconUsers, IconRefresh } from "./UIComponents";

export default function LeadsPage({ data, loading, refreshing, fetchAll, timeRange, setTimeRange, percent, isLightMode = false, selectedLeadId, onLeadSelect }) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 10;

  // Filter leads data
  const leadsRows = useMemo(() => {
    return (data.leads || []).map((rec) => {
      const f = rec?.fields || {};
      return {
        id: rec?.id ?? "",
        createdAt: safeDate(rec?.createdTime ?? f["Created At"] ?? f["Created Time"]),
        fullName: safeString(f["Full Name"]),
        phone: safeString(f["Phone"]),
        intent: safeString(f["Intent"]),
        status: safeString(f["Status"]),
        source: safeString(f["Lead Source"]),
      };
    });
  }, [data.leads]);

  // Get current leads for the page
  const indexOfLastLead = currentPage * leadsPerPage;
  const indexOfFirstLead = indexOfLastLead - leadsPerPage;
  const currentLeads = leadsRows.slice(indexOfFirstLead, indexOfLastLead);
  
  // Calculate total pages
  const totalPages = Math.ceil(leadsRows.length / leadsPerPage);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Previous page
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Next page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Group by status
  const leadsByStatus = useMemo(() => {
    const groups = {};
    leadsRows.forEach((lead) => {
      const status = lead.status || "New";
      if (!groups[status]) groups[status] = [];
      groups[status].push(lead);
    });
    return groups;
  }, [leadsRows]);

  // Overview series for chart
  const leadsOverviewSeries = useMemo(() => {
    const now = new Date();
    const daysToShow = timeRange === "week" ? 7 : 30;
    const startDate = addDays(startOfDay(now), -daysToShow);
    
    const dailyCounts = {};
    leadsRows.forEach((lead) => {
      if (lead.createdAt && lead.createdAt >= startDate) {
        const dateKey = ymd(lead.createdAt);
        dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
      }
    });

    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [leadsRows, timeRange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>Leads Management</h1>
          <p className={`mt-1 ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Manage and track all your leads</p>
        </div>
        <button
          type="button"
          onClick={() => fetchAll({ isRefresh: true })}
          disabled={loading || refreshing}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
            isLightMode
              ? 'border border-gray-200 bg-gray-100 text-gray-600 hover:bg-gray-200'
              : 'border border-white/20 bg-white/15 backdrop-blur-[24px] text-gray-300 hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
          }`}
        >
          <IconRefresh className={`${(loading || refreshing) ? 'animate-spin' : ''}`} />
          {(loading || refreshing) ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-black' : 'text-gray-300/80'}`}>Total Leads</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{leadsRows.length}</div>
        </div>
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-black' : 'text-gray-300/80'}`}>New</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{leadsByStatus.New?.length || 0}</div>
        </div>
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-black' : 'text-gray-300/80'}`}>Engaged</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{leadsByStatus.Engaged?.length || 0}</div>
        </div>
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-black' : 'text-gray-300/80'}`}>Converted</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{leadsByStatus.Won?.length || 0}</div>
        </div>
      </div>

      {/* Leads Table */}
      <div className={`rounded-2xl backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
        isLightMode
          ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
          : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
      }`}>
        <div className={`p-5 border-b ${isLightMode ? 'border-gray-200/40' : 'border-white/10'}`}>
          <h2 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>All Leads</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr className={`border-b ${isLightMode ? 'border-gray-200' : 'border-white/10'}`}>
                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Name</th>
                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Phone</th>
                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Status</th>
                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Source</th>
                <th className={`px-5 py-3 text-left text-xs font-medium uppercase tracking-wider ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Created</th>
              </tr>
            </thead>
            <tbody className={isLightMode ? 'divide-y divide-gray-200' : 'divide-y divide-white/10'}>
              {currentLeads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className={`transition-colors cursor-pointer ${isLightMode ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}
                  onClick={() => onLeadSelect && onLeadSelect(lead.id)}
                >
                  <td className={`px-5 py-4 text-sm ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{lead.fullName || "Unknown"}</td>
                  <td className={`px-5 py-4 text-sm ${isLightMode ? 'text-black' : 'text-gray-300'}`}>{lead.phone || "-"}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${isLightMode
                      ? (lead.status === "New" ? "bg-blue-100 text-blue-700" :
                         lead.status === "Engaged" ? "bg-yellow-100 text-yellow-700" :
                         lead.status === "Won" ? "bg-green-100 text-green-700" :
                         "bg-gray-100 text-gray-700")
                      : (lead.status === "New" ? "bg-blue-500/20 text-blue-300" :
                         lead.status === "Engaged" ? "bg-yellow-500/20 text-yellow-300" :
                         lead.status === "Won" ? "bg-green-500/20 text-green-300" :
                         "bg-gray-500/20 text-gray-300")
                    }`}>
                      {lead.status || "New"}
                    </span>
                  </td>
                  <td className={`px-5 py-4 text-sm ${isLightMode ? 'text-black' : 'text-gray-300'}`}>{lead.source || "-"}</td>
                  <td className={`px-5 py-4 text-sm ${isLightMode ? 'text-black' : 'text-gray-300'}`}>
                    {lead.createdAt ? lead.createdAt.toLocaleDateString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {leadsRows.length === 0 && (
          <div className={`p-10 text-center ${isLightMode ? 'text-black' : 'text-gray-400'}`}>
            No leads found
          </div>
        )}
        {/* Pagination */}
        {leadsRows.length > 0 && (
          <div className={`p-4 border-t ${isLightMode ? 'border-gray-200' : 'border-white/10'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className={`text-sm ${isLightMode ? 'text-black' : 'text-gray-300'} text-center sm:text-left`}>
                Showing <span className="font-medium">{indexOfFirstLead + 1}</span> to {' '}
                <span className="font-medium">
                  {Math.min(indexOfLastLead, leadsRows.length)}
                </span> of <span className="font-medium">{leadsRows.length}</span> leads
              </div>
              <div className="flex items-center flex-wrap justify-center sm:justify-end gap-1 sm:gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'cursor-not-allowed opacity-50 '
                      : isLightMode
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <span className="sm:hidden">&lt;</span>
                  <span className="hidden sm:inline">Previous</span>
                </button>
                        
                {/* Page numbers */}
                {totalPages <= 7 ? (
                  // Show all pages if total pages is 7 or less
                  [...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                      <button
                        key={index}
                        onClick={() => paginate(pageNumber)}
                        className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                          currentPage === pageNumber
                            ? isLightMode
                              ? 'bg-blue-500 text-white'
                              : 'bg-blue-500 text-white'
                            : isLightMode
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })
                ) : (
                  // Show abbreviated version for more pages
                  <>
                    {/* First page */}
                    <button
                      onClick={() => paginate(1)}
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        currentPage === 1
                          ? isLightMode
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-500 text-white'
                          : isLightMode
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      1
                    </button>
                            
                    {/* Ellipsis after first page */}
                    {currentPage > 3 && <span className={`px-1 text-xs sm:text-sm ${isLightMode ? 'text-black' : 'text-gray-400'}`}>...</span>}
                            
                    {/* Pages around current page */}
                    {currentPage > 2 && currentPage < totalPages && (
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                          isLightMode
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {currentPage - 1}
                      </button>
                    )}
                            
                    {/* Current page */}
                    <button
                      onClick={() => paginate(currentPage)}
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        isLightMode
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {currentPage}
                    </button>
                            
                    {/* Pages around current page */}
                    {currentPage < totalPages - 1 && (
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                          isLightMode
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                      >
                        {currentPage + 1}
                      </button>
                    )}
                            
                    {/* Ellipsis before last page */}
                    {currentPage < totalPages - 2 && <span className={`px-1 text-xs sm:text-sm ${isLightMode ? 'text-black' : 'text-gray-400'}`}>...</span>}
                            
                    {/* Last page */}
                    <button
                      onClick={() => paginate(totalPages)}
                      className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        currentPage === totalPages
                          ? isLightMode
                            ? 'bg-blue-500 text-white'
                            : 'bg-blue-500 text-white'
                          : isLightMode
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                        
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                    currentPage === totalPages || totalPages === 0
                      ? 'cursor-not-allowed opacity-50 '
                      : isLightMode
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <span className="sm:hidden">&gt;</span>
                  <span className="hidden sm:inline">Next</span>
                </button>
              </div>
            </div>
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

function safeDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isFinite(d.getTime()) ? d : null;
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function ymd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}