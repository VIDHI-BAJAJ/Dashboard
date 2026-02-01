import React, { useMemo } from "react";
import { IconChat, IconRefresh } from "./UIComponents";

export default function ConversationsPage({ data, loading, refreshing, fetchAll, timeAgo, isLightMode = false }) {
  // Process conversations data
  const convRows = useMemo(() => {
    return (data.conversations || []).map((rec) => {
      const f = rec?.fields || rec || {};
      return {
        id: rec?.id ?? f.id ?? "",
        name: safeString(f["Full Name"] ?? f["Name"] ?? f["Lead Name"]),
        phone: safeString(f["Phone"]),
        channel: safeString(f["Channel"] ?? f["Source"] ?? f["Lead Source"]),
        lastMessageAt: safeDate(f["Last Message At"] ?? f.lastMessageAt ?? f.last_message_at ?? rec?.createdTime),
        snippet: safeString(f["Last Message"] ?? f["Message"] ?? f["Snippet"]),
      };
    });
  }, [data.conversations]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>Conversations</h1>
          <p className={`mt-1 ${isLightMode ? 'text-black' : 'text-gray-400'}`}>Track all customer communications</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-300/80'}`}>Total Conversations</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{convRows.length}</div>
        </div>
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-300/80'}`}>WhatsApp</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
            {convRows.filter(c => c.channel?.toLowerCase().includes('whatsapp')).length}
          </div>
        </div>
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-300/80'}`}>Email</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
            {convRows.filter(c => c.channel?.toLowerCase().includes('email')).length}
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className={`rounded-2xl backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
        isLightMode
          ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
          : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
      }`}>
        <div className={`p-5 border-b ${isLightMode ? 'border-gray-200/40' : 'border-white/10'}`}>
          <h2 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>Recent Conversations</h2>
        </div>
        <div className={isLightMode ? 'divide-y divide-gray-200' : 'divide-y divide-white/10'}>
          {convRows.slice(0, 8).map((conv) => (
            <div key={conv.id} className={`p-5 transition-colors ${isLightMode ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      isLightMode ? 'bg-blue-100' : 'bg-blue-500/20'
                    }`}>
                      <span className={`font-medium ${isLightMode ? 'text-blue-700' : 'text-blue-300'}`}>
                        {conv.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <h3 className={`font-medium ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{conv.name || "Unknown Contact"}</h3>
                      <p className={`text-sm ${isLightMode ? 'text-black' : 'text-gray-400'}`}>{conv.phone || "-"}</p>
                    </div>
                  </div>
                  <div className="ml-13">
                    <p className={`text-sm mb-2 ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>{conv.snippet || "No message content"}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        {conv.channel || "Unknown"}
                      </span>
                      {conv.lastMessageAt && (
                        <span>{timeAgo(conv.lastMessageAt)}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {convRows.length === 0 && (
          <div className={`p-10 text-center ${isLightMode ? 'text-black' : 'text-gray-400'}`}>
            No conversations found
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