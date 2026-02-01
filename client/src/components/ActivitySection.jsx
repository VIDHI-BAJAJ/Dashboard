import React from "react";
import { ThGlass, TdGlass } from "./UIComponents";

export default function ActivitySection({ 
  convRows, 
  taskRows, 
  recentConversations, 
  upcomingTasks, 
  loading, 
  timeAgo, 
  fmtDate,
  isLightMode = false,
  onConversationClick
}) {
  return (
    <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className={`lg:col-span-7 rounded-2xl p-5 sm:p-6 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
      isLightMode
         ? "bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50"
         : "bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10"
  }`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className={`text-base font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>Recent conversations</div>
            <div className={`mt-1 text-sm ${isLightMode ? 'text-black' : 'text-gray-400/80'}`}>Latest activity across channels</div>
          </div>
          <span className={`text-sm ${isLightMode ? 'text-black' : 'text-gray-400/80'}`}>{convRows.length} total</span>
        </div>
        <div className="mt-5 overflow-x-auto -mx-5 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-white/10">
              <thead className={isLightMode ? "bg-gray-50" : "bg-white/12 backdrop-blur-sm"}>
                <tr>
                  <ThGlass isLightMode={isLightMode}>Name</ThGlass>
                  <ThGlass className="hidden sm:table-cell" isLightMode={isLightMode}>Phone</ThGlass>
                  <ThGlass isLightMode={isLightMode}>Channel</ThGlass>
                  <ThGlass className="hidden md:table-cell" isLightMode={isLightMode}>Last activity</ThGlass>
                  <ThGlass className="hidden lg:table-cell" isLightMode={isLightMode}>Snippet</ThGlass>
                </tr>
              </thead>
              <tbody className={isLightMode ? "divide-y divide-gray-200" : "divide-y divide-white/10"}>
                {loading ? (
                  <tr><td colSpan={5} className={`px-4 py-10 text-center text-sm ${isLightMode ? 'text-black' : 'text-gray-400/80'}`}>Loading…</td></tr>
                ) : recentConversations.length === 0 ? (
                  <tr><td colSpan={5} className={`px-4 py-10 text-center text-sm ${isLightMode ? 'text-black' : 'text-gray-400/80'}`}>No conversations found.</td></tr>
                ) : (
                  recentConversations.map((group) => (
                    <tr 
                      key={group.name || group.phone || group.conversations[0]?.id} 
                      className={`transition-all duration-200 cursor-pointer ${isLightMode ? 'hover:bg-gray-50' : 'hover:bg-white/10'}`}
                      onClick={() => onConversationClick && onConversationClick(group)}
                    >
                      <TdGlass>
                        <div className={`font-medium ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{group.name || group.phone || "—"}</div>
                        <div className={`mt-1 sm:hidden font-mono text-xs ${isLightMode ? 'text-black' : 'text-gray-400/80'}`}>{group.phone || "—"}</div>
                      </TdGlass>
                      <TdGlass className="hidden sm:table-cell">
                        <div className={`font-mono text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300/90'}`}>{group.phone || "—"}</div>
                      </TdGlass>
                      <TdGlass>
                        <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs ${
                          isLightMode 
                            ? 'border-gray-200 bg-gray-100 text-gray-700' 
                            : 'border-white/20 bg-white/12 backdrop-blur-sm text-gray-300/90'
                        }`}>{group.channel || "—"}</span>
                      </TdGlass>
                      <TdGlass className="hidden md:table-cell">
                        <div className={`text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300/90'}`}>{group.lastMessageAt ? timeAgo(group.lastMessageAt) : "—"}</div>
                      </TdGlass>
                      <TdGlass className="hidden lg:table-cell">
                        <div className={`max-w-[260px] truncate text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300/90'}`}>{group.snippet || "—"}</div>
                      </TdGlass>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={`lg:col-span-5 rounded-2xl p-5 sm:p-6 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
       isLightMode
  ? "bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50"
  : "bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10"
 }`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className={`text-base font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>Upcoming tasks</div>
            <div className={`mt-1 text-sm ${isLightMode ? 'text-black' : 'text-gray-400/80'}`}>Next actions to complete</div>
          </div>
          <span className={`text-sm ${isLightMode ? 'text-black' : 'text-gray-400/80'}`}>{taskRows.length} total</span>
        </div>
        <div className="mt-5 space-y-3">
          {loading ? (
            <div className={`rounded-2xl px-4 py-4 text-sm ${
              isLightMode 
                ? 'border border-gray-200 bg-gray-50 text-gray-500' 
                : 'border border-white/20 bg-white/12 backdrop-blur-[24px] text-gray-400/80'
            }`}>Loading…</div>
          ) : upcomingTasks.length === 0 ? (
            <div className={`rounded-2xl px-4 py-4 text-sm ${
              isLightMode 
                ? 'border border-gray-200 bg-gray-50 text-gray-500' 
                : 'border border-white/20 bg-white/12 backdrop-blur-[24px] text-gray-400/80'
            }`}>No upcoming tasks.</div>
          ) : (
            upcomingTasks.map((t) => (
              <div
                key={t.id || `${t.title}-${t.dueAt?.toISOString?.() || ""}`}
                className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 ${
                  isLightMode
                    ? 'border border-gray-200 bg-white shadow-sm hover:bg-gray-50'
                    : 'border border-white/20 bg-white/12 backdrop-blur-[24px] hover:bg-white/15 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.03)]'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className={`truncate text-sm font-medium ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{t.title || "Untitled task"}</div>
                  <div className={`mt-2 flex flex-wrap items-center gap-2 text-xs ${isLightMode ? 'text-black' : 'text-gray-400/80'}`}>
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 ${
                      isLightMode
                        ? 'border-gray-200 bg-gray-100 text-gray-700'
                        : 'border-white/20 bg-white/15 backdrop-blur-sm text-gray-300/90'
                    }`}>{t.status || "No status"}</span>
                    {t.priority ? (
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 ${
                        isLightMode
                          ? 'border-gray-200 bg-gray-100 text-gray-700'
                          : 'border-white/20 bg-white/15 backdrop-blur-sm text-gray-300/90'
                      }`}>{t.priority}</span>
                    ) : null}
                  </div>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <div className={`text-xs ${isLightMode ? 'text-black' : 'text-gray-400/80'}`}>Due</div>
                  <div className={`text-sm font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{t.dueAt ? fmtDate(t.dueAt) : "—"}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}