import React from "react";
import { ThGlass, TdGlass } from "./UIComponents";

export default function ActivitySection({ 
  convRows, 
  taskRows, 
  recentConversations, 
  upcomingTasks, 
  loading, 
  timeAgo, 
  fmtDate 
}) {
  return (
    <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
      <div className="lg:col-span-7 rounded-3xl border border-white/15 backdrop-blur-[22px] backdrop-saturate-150 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-gray-100">Recent conversations</div>
            <div className="mt-1 text-sm text-gray-400/80">Latest activity across channels</div>
          </div>
          <span className="text-sm text-gray-400/80">{convRows.length} total</span>
        </div>
        <div className="mt-5 overflow-x-auto -mx-5 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/12 backdrop-blur-sm">
                <tr>
                  <ThGlass>Name</ThGlass>
                  <ThGlass className="hidden sm:table-cell">Phone</ThGlass>
                  <ThGlass>Channel</ThGlass>
                  <ThGlass className="hidden md:table-cell">Last activity</ThGlass>
                  <ThGlass className="hidden lg:table-cell">Snippet</ThGlass>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400/80">Loading…</td></tr>
                ) : recentConversations.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400/80">No conversations found.</td></tr>
                ) : (
                  recentConversations.map((c) => (
                    <tr key={c.id || `${c.name}-${c.phone}`} className="hover:bg-white/10 transition-all duration-200">
                      <TdGlass>
                        <div className="font-medium text-gray-100">{c.name || "—"}</div>
                        <div className="mt-1 sm:hidden font-mono text-xs text-gray-400/80">{c.phone || "—"}</div>
                      </TdGlass>
                      <TdGlass className="hidden sm:table-cell">
                        <div className="font-mono text-sm text-gray-300/90">{c.phone || "—"}</div>
                      </TdGlass>
                      <TdGlass>
                        <span className="inline-flex items-center rounded-full border border-white/20 bg-white/12 backdrop-blur-sm px-2.5 py-1 text-xs text-gray-300/90">{c.channel || "—"}</span>
                      </TdGlass>
                      <TdGlass className="hidden md:table-cell">
                        <div className="text-sm text-gray-300/90">{c.lastMessageAt ? timeAgo(c.lastMessageAt) : "—"}</div>
                      </TdGlass>
                      <TdGlass className="hidden lg:table-cell">
                        <div className="max-w-[260px] truncate text-sm text-gray-300/90">{c.snippet || "—"}</div>
                      </TdGlass>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 rounded-3xl border border-white/15 backdrop-blur-[22px] backdrop-saturate-150 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.3)] transition-all duration-300 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-base font-semibold text-gray-100">Upcoming tasks</div>
            <div className="mt-1 text-sm text-gray-400/80">Next actions to complete</div>
          </div>
          <span className="text-sm text-gray-400/80">{taskRows.length} total</span>
        </div>
        <div className="mt-5 space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-white/20 bg-white/12 backdrop-blur-[24px] px-4 py-4 text-sm text-gray-400/80">Loading…</div>
          ) : upcomingTasks.length === 0 ? (
            <div className="rounded-2xl border border-white/20 bg-white/12 backdrop-blur-[24px] px-4 py-4 text-sm text-gray-400/80">No upcoming tasks.</div>
          ) : (
            upcomingTasks.map((t) => (
              <div
                key={t.id || `${t.title}-${t.dueAt?.toISOString?.() || ""}`}
                className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 rounded-2xl border border-white/20 bg-white/12 backdrop-blur-[24px] px-4 py-3.5 hover:bg-white/15 hover:border-white/25 transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-gray-100">{t.title || "Untitled task"}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400/80">
                    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm px-2.5 py-0.5">{t.status || "No status"}</span>
                    {t.priority ? (
                      <span className="inline-flex items-center rounded-full border border-white/20 bg-white/15 backdrop-blur-sm px-2.5 py-0.5">{t.priority}</span>
                    ) : null}
                  </div>
                </div>
                <div className="shrink-0 text-left sm:text-right">
                  <div className="text-xs text-gray-400/80">Due</div>
                  <div className="text-sm font-semibold text-gray-100">{t.dueAt ? fmtDate(t.dueAt) : "—"}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}