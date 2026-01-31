import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function CryptoGlassDashboard() {
  const [data, setData] = useState({
    leads: [],
    conversations: [],
    tasks: [],
    deals: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const inFlightRef = useRef(false);
  const refreshIntervalRef = useRef(null);
  const agoIntervalRef = useRef(null);

  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [updatedAgoLabel, setUpdatedAgoLabel] = useState("Updated never");
  const [timeRange, setTimeRange] = useState("month");

  const fetchAll = async ({ isRefresh } = { isRefresh: false }) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");

      const [leadsRes, convRes, tasksRes, dealsRes] = await Promise.all([
        fetch(`${API_URL}/api/leads`),
        fetch(`${API_URL}/api/conversations`),
        fetch(`${API_URL}/api/tasks`),
        fetch(`${API_URL}/api/deals`),
      ]);

      const bad = [leadsRes, convRes, tasksRes, dealsRes].find((r) => !r.ok);
      if (bad) throw new Error(`Request failed: ${bad.status} ${bad.statusText}`);

      const [leads, conversations, tasks, deals] = await Promise.all([
        leadsRes.json(),
        convRes.json(),
        tasksRes.json(),
        dealsRes.json(),
      ]);

      setData({
        leads: Array.isArray(leads) ? leads : [],
        conversations: Array.isArray(conversations) ? conversations : [],
        tasks: Array.isArray(tasks) ? tasks : [],
        deals: Array.isArray(deals) ? deals : [],
      });

      const now = Date.now();
      setLastUpdatedAt(now);
      setUpdatedAgoLabel("Updated just now");
    } catch (e) {
      setError(e?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
      inFlightRef.current = false;
    }
  };

  useEffect(() => {
    fetchAll({ isRefresh: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const start = () => {
      if (refreshIntervalRef.current) return;
      refreshIntervalRef.current = setInterval(() => {
        if (document.visibilityState !== "visible") return;
        fetchAll({ isRefresh: true });
      }, 20_000);
    };
    const stop = () => {
      if (!refreshIntervalRef.current) return;
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    };
    const onVis = () => {
      if (document.visibilityState === "visible") start();
      else stop();
    };
    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tick = () => {
      if (!lastUpdatedAt) {
        setUpdatedAgoLabel("Updated never");
        return;
      }
      const s = Math.floor((Date.now() - lastUpdatedAt) / 1000);
      setUpdatedAgoLabel(s <= 1 ? "Updated just now" : `Updated ${s} seconds ago`);
    };
    tick();
    agoIntervalRef.current = setInterval(tick, 1000);
    return () => {
      if (agoIntervalRef.current) clearInterval(agoIntervalRef.current);
      agoIntervalRef.current = null;
    };
  }, [lastUpdatedAt]);

  const leadsRows = useMemo(() => {
    return data.leads.map((rec) => {
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

  const convRows = useMemo(() => {
    return data.conversations.map((rec) => {
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

  const taskRows = useMemo(() => {
    return data.tasks.map((rec) => {
      const f = rec?.fields || rec || {};
      return {
        id: rec?.id ?? f.id ?? "",
        title: safeString(f["Title"] ?? f["Task"] ?? f["Name"]),
        status: safeString(f["Status"] ?? f.status),
        dueAt: safeDate(f["Due Date"] ?? f["Due"] ?? f.dueDate ?? f.due_at),
        priority: safeString(f["Priority"] ?? f.priority),
      };
    });
  }, [data.tasks]);

  const dealRows = useMemo(() => {
    return data.deals.map((rec) => {
      const f = rec?.fields || rec || {};
      return {
        id: rec?.id ?? f.id ?? "",
        status: safeString(f["Status"] ?? f.status),
        createdAt: safeDate(rec?.createdTime ?? f["Created At"] ?? f.createdAt ?? f.created_at ?? f.date),
        value: safeNumber(f["Deal Value"] ?? f["Value"] ?? f["Amount"] ?? f.value ?? f.amount),
      };
    });
  }, [data.deals]);

  const metrics = useMemo(() => {
    const totalLeads = leadsRows.length;
    const activeConversations = convRows.length;
    const today = startOfDay(new Date());
    const tomorrow = addDays(today, 1);
    const tasksDueToday = taskRows.filter((t) => t.dueAt && t.dueAt >= today && t.dueAt < tomorrow).length;
    const dealsWon = dealRows.filter((d) => (d.status || "").toLowerCase() === "won").length;
    return { totalLeads, activeConversations, tasksDueToday, dealsWon };
  }, [leadsRows, convRows, taskRows, dealRows]);

  const trends = useMemo(() => {
    const now = new Date();
    const windowDays = timeRange === "week" ? 7 : 30;
    const prevStart = addDays(startOfDay(now), -2 * windowDays);
    const mid = addDays(startOfDay(now), -windowDays);
    const curStart = mid;
    const curEnd = now;
    const leadsPrev = leadsRows.filter((l) => l.createdAt && l.createdAt >= prevStart && l.createdAt < mid).length;
    const leadsCur = leadsRows.filter((l) => l.createdAt && l.createdAt >= curStart && l.createdAt <= curEnd).length;
    const tasksPrev = taskRows.filter((t) => t.dueAt && t.dueAt >= prevStart && t.dueAt < mid).length;
    const tasksCur = taskRows.filter((t) => t.dueAt && t.dueAt >= curStart && t.dueAt <= curEnd).length;
    const dealsPrev = dealRows.filter((d) => d.createdAt && d.createdAt >= prevStart && d.createdAt < mid).length;
    const dealsCur = dealRows.filter((d) => d.createdAt && d.createdAt >= curStart && d.createdAt <= curEnd).length;
    const convPrev = convRows.filter((c) => c.lastMessageAt && c.lastMessageAt >= prevStart && c.lastMessageAt < mid).length;
    const convCur = convRows.filter((c) => c.lastMessageAt && c.lastMessageAt >= curStart && c.lastMessageAt <= curEnd).length;
    return {
      leads: pctDelta(leadsPrev, leadsCur),
      tasks: pctDelta(tasksPrev, tasksCur),
      deals: pctDelta(dealsPrev, dealsCur),
      conv: pctDelta(convPrev, convCur),
    };
  }, [leadsRows, taskRows, dealRows, convRows, timeRange]);

  const leadsOverviewSeries = useMemo(() => {
    const days = timeRange === "week" ? 7 : 30;
    const start = addDays(startOfDay(new Date()), -(days - 1));
    const buckets = new Map();
    for (let i = 0; i < days; i++) buckets.set(ymd(addDays(start, i)), 0);
    for (const l of leadsRows) {
      if (!l.createdAt) continue;
      const key = ymd(startOfDay(l.createdAt));
      if (buckets.has(key)) buckets.set(key, (buckets.get(key) || 0) + 1);
    }
    return Array.from(buckets.entries()).map(([date, leads]) => ({ date: shortMD(date), leads }));
  }, [leadsRows, timeRange]);

  const leadsByStatus = useMemo(() => {
    const order = ["New", "Engaged", "Follow-up", "Won", "Lost"];
    const m = new Map();
    for (const s of order) m.set(s, 0);
    for (const l of leadsRows) {
      const s = normalizeStatus(l.status);
      m.set(s, (m.get(s) || 0) + 1);
    }
    return order.map((name) => ({ name, value: m.get(name) || 0 }));
  }, [leadsRows]);

  const recentConversations = useMemo(() => {
    return [...convRows]
      .sort((a, b) => (b.lastMessageAt?.getTime?.() || 0) - (a.lastMessageAt?.getTime?.() || 0))
      .slice(0, 6);
  }, [convRows]);

  const upcomingTasks = useMemo(() => {
    const now = new Date();
    return [...taskRows]
      .filter((t) => t.dueAt && t.dueAt.getTime() >= now.getTime())
      .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
      .slice(0, 6);
  }, [taskRows]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#0D1235] to-[#0A0E27] text-slate-100">
      {/* Crypto-style ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[30%] -left-[15%] h-[70vh] w-[70vw] rounded-[50%] bg-blue-500/25 blur-[140px] animate-pulse" />
        <div className="absolute top-[40%] -right-[25%] h-[65vh] w-[65vw] rounded-[50%] bg-violet-500/20 blur-[130px]" />
        <div className="absolute -bottom-[25%] left-[20%] h-[60vh] w-[60vw] rounded-[50%] bg-cyan-500/15 blur-[120px]" />
        <div className="absolute top-[15%] right-[15%] h-[45vh] w-[45vh] rounded-[50%] bg-emerald-500/12 blur-[100px]" />
      </div>

      <Navbar
        loading={loading || refreshing}
        updatedAgoLabel={updatedAgoLabel}
        onRefresh={() => fetchAll({ isRefresh: true })}
      />

      <main className="mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        {error ? (
          <div className="mb-6 rounded-[20px] border border-red-400/20 bg-red-500/10 backdrop-blur-xl px-5 py-4 text-sm text-red-200 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)]">
            <div className="font-semibold text-red-100">Failed to load</div>
            <div className="mt-1 font-mono text-xs text-red-200/90">{error}</div>
          </div>
        ) : null}

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Total Leads" value={metrics.totalLeads} trend={trends.leads} accent="blue" icon={<IconUsers />} />
          <MetricCard title="Active Conversations" value={metrics.activeConversations} trend={trends.conv} accent="cyan" icon={<IconChat />} />
          <MetricCard title="Tasks Due Today" value={metrics.tasksDueToday} trend={trends.tasks} accent="violet" icon={<IconCheck />} />
          <MetricCard title="Deals Won" value={metrics.dealsWon} trend={trends.deals} accent="emerald" icon={<IconSpark />} />
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <GlassCard className="lg:col-span-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-base font-semibold text-slate-100">Leads overview</div>
                <div className="mt-1 text-sm text-slate-300/80">Volume trend for the selected time window</div>
              </div>
              <Segment
                value={timeRange}
                onChange={setTimeRange}
                options={[
                  { id: "week", label: "This Week" },
                  { id: "month", label: "This Month" },
                ]}
              />
            </div>
            <div className="mt-5 h-[260px]">
              <ChartFrame loading={loading} empty={leadsOverviewSeries.length === 0}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={leadsOverviewSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                        <stop offset="50%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="date" tick={{ fill: "rgba(226,232,240,0.7)", fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(226,232,240,0.7)", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<GlassTooltip />} />
                    <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={2.5} fill="url(#leadFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartFrame>
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-slate-100">Leads by status</div>
                <div className="mt-1 text-sm text-slate-300/80">Where leads are stuck</div>
              </div>
              <span className="text-sm text-slate-300/70">{leadsRows.length} total</span>
            </div>
            <div className="mt-5 space-y-3">
              {leadsByStatus.map((row) => (
                <div key={row.name} className="flex items-center justify-between gap-3">
                  <StatusPill status={row.name} />
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-28 overflow-hidden rounded-full bg-white/5 backdrop-blur-sm">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500"
                        style={{ width: `${percent(row.value, leadsRows.length)}%` }}
                      />
                    </div>
                    <div className="w-10 text-right text-sm font-semibold text-slate-100">{row.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 h-[180px]">
              <ChartFrame loading={loading} empty={leadsByStatus.length === 0}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leadsByStatus} margin={{ top: 10, right: 6, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: "rgba(226,232,240,0.7)", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "rgba(226,232,240,0.7)", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip content={<GlassTooltip />} />
                    <Bar dataKey="value" fill="rgba(59,130,246,0.8)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartFrame>
            </div>
          </GlassCard>
        </section>

        <section className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-12">
          <GlassCard className="lg:col-span-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-slate-100">Recent conversations</div>
                <div className="mt-1 text-sm text-slate-300/80">Latest activity across channels</div>
              </div>
              <span className="text-sm text-slate-300/70">{convRows.length} total</span>
            </div>
            <div className="mt-5 overflow-x-auto -mx-5 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full divide-y divide-white/5">
                  <thead className="bg-white/5 backdrop-blur-sm">
                    <tr>
                      <ThGlass>Name</ThGlass>
                      <ThGlass className="hidden sm:table-cell">Phone</ThGlass>
                      <ThGlass>Channel</ThGlass>
                      <ThGlass className="hidden md:table-cell">Last activity</ThGlass>
                      <ThGlass className="hidden lg:table-cell">Snippet</ThGlass>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loading ? (
                      <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-300/70">Loading…</td></tr>
                    ) : recentConversations.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-300/70">No conversations found.</td></tr>
                    ) : (
                      recentConversations.map((c) => (
                        <tr key={c.id || `${c.name}-${c.phone}`} className="hover:bg-white/5 transition-colors">
                          <TdGlass>
                            <div className="font-medium text-slate-100">{c.name || "—"}</div>
                            <div className="mt-1 sm:hidden font-mono text-xs text-slate-300/70">{c.phone || "—"}</div>
                          </TdGlass>
                          <TdGlass className="hidden sm:table-cell">
                            <div className="font-mono text-sm text-slate-200/90">{c.phone || "—"}</div>
                          </TdGlass>
                          <TdGlass>
                            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-2.5 py-1 text-xs text-slate-200">{c.channel || "—"}</span>
                          </TdGlass>
                          <TdGlass className="hidden md:table-cell">
                            <div className="text-sm text-slate-300/90">{c.lastMessageAt ? timeAgo(c.lastMessageAt) : "—"}</div>
                          </TdGlass>
                          <TdGlass className="hidden lg:table-cell">
                            <div className="max-w-[260px] truncate text-sm text-slate-300/90">{c.snippet || "—"}</div>
                          </TdGlass>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-base font-semibold text-slate-100">Upcoming tasks</div>
                <div className="mt-1 text-sm text-slate-300/80">Next actions to complete</div>
              </div>
              <span className="text-sm text-slate-300/70">{taskRows.length} total</span>
            </div>
            <div className="mt-5 space-y-3">
              {loading ? (
                <div className="rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-4 text-sm text-slate-300/80">Loading…</div>
              ) : upcomingTasks.length === 0 ? (
                <div className="rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-4 text-sm text-slate-300/80">No upcoming tasks.</div>
              ) : (
                upcomingTasks.map((t) => (
                  <div
                    key={t.id || `${t.title}-${t.dueAt?.toISOString?.() || ""}`}
                    className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3.5 hover:bg-white/8 hover:border-white/15 transition-all duration-200"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-slate-100">{t.title || "Untitled task"}</div>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300/80">
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-2.5 py-0.5">{t.status || "No status"}</span>
                        {t.priority ? (
                          <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-2.5 py-0.5">{t.priority}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="shrink-0 text-left sm:text-right">
                      <div className="text-xs text-slate-400">Due</div>
                      <div className="text-sm font-semibold text-slate-100">{t.dueAt ? fmtDate(t.dueAt) : "—"}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </section>
      </main>
    </div>
  );
}

function Navbar({ loading, updatedAgoLabel, onRefresh }) {
  const disabled = !!loading;

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[rgba(10,14,39,0.7)] backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="grid h-10 w-10 place-items-center rounded-[18px] bg-gradient-to-br from-blue-500/20 to-violet-500/15 text-blue-300 ring-1 ring-white/10 backdrop-blur-sm shadow-[0_4px_16px_rgba(59,130,246,0.2)]">
              <IconBolt />
            </div>
            <div className="leading-tight hidden sm:block">
              <div className="text-sm font-semibold text-slate-100">FinCRM</div>
              <div className="text-xs text-slate-300/70">Dashboard</div>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-1">
            <NavItem active>Dashboard</NavItem>
            <NavItem>Leads</NavItem>
            <NavItem>Conversations</NavItem>
            <NavItem>Tasks</NavItem>
            <NavItem>Deals</NavItem>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-3 py-1.5 text-xs text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
              <span className="hidden md:inline">Live · </span>
              <span className="truncate max-w-[120px] sm:max-w-none">{updatedAgoLabel}</span>
            </span>
            <button
              type="button"
              onClick={onRefresh}
              disabled={disabled}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                disabled
                  ? "cursor-not-allowed border-white/10 bg-white/5 backdrop-blur-sm text-slate-400"
                  : "border-white/10 bg-gradient-to-r from-blue-500/15 to-violet-500/10 backdrop-blur-sm text-slate-200 hover:from-blue-500/25 hover:to-violet-500/20 hover:border-white/15"
              }`}
              aria-label="Refresh"
            >
              <IconRefresh />
              <span className="hidden sm:inline">{disabled ? "Refreshing…" : "Refresh"}</span>
            </button>
          </div>

          <IconButton label="Search"><IconSearch /></IconButton>
          <IconButton label="Notifications"><IconBell /></IconButton>

          <div className="h-10 w-10 overflow-hidden rounded-[18px] border border-white/10 bg-gradient-to-br from-blue-500/30 via-violet-500/20 to-pink-500/20 backdrop-blur-sm" />
        </div>
      </div>
    </header>
  );
}

function NavItem({ children, active }) {
  return (
    <button
      type="button"
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
        active
          ? "bg-white/10 backdrop-blur-sm text-slate-100 border border-white/10"
          : "text-slate-300 hover:bg-white/5 hover:text-slate-100"
      }`}
    >
      {children}
    </button>
  );
}

function IconButton({ children, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-[18px] border border-white/10 bg-white/5 backdrop-blur-sm text-slate-200 transition-all duration-200 hover:bg-white/10 hover:border-white/15"
    >
      {children}
    </button>
  );
}

function GlassCard({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-[20px] border border-white/10 bg-[rgba(255,255,255,0.05)] backdrop-blur-xl p-5 sm:p-6",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]",
        "transition-all duration-300 hover:bg-[rgba(255,255,255,0.08)] hover:border-white/15",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function MetricCard({ title, value, trend, accent, icon }) {
  const accentGradient =
    accent === "emerald"
      ? "from-emerald-500/25 to-teal-500/15"
      : accent === "violet"
        ? "from-violet-500/25 to-purple-500/15"
        : accent === "cyan"
          ? "from-cyan-500/25 to-blue-500/15"
          : "from-blue-500/25 to-violet-500/15";

  return (
    <GlassCard>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium uppercase tracking-wide text-slate-300/70">{title}</div>
          <div className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-slate-100">
            {Number.isFinite(value) ? value : 0}
          </div>
          <div className="mt-2">
            <TrendPill trend={trend} />
          </div>
        </div>
        <div className={`shrink-0 rounded-[18px] p-3 bg-gradient-to-br ${accentGradient} border border-white/10 backdrop-blur-sm`}>
          {icon}
        </div>
      </div>
    </GlassCard>
  );
}

function TrendPill({ trend }) {
  const dir = trend?.direction || "flat";
  const pct = typeof trend?.pct === "number" ? trend.pct : null;
  const cls =
    dir === "up"
      ? "from-emerald-400/25 to-emerald-500/10 border-emerald-400/20 text-emerald-200"
      : dir === "down"
        ? "from-rose-400/25 to-rose-500/10 border-rose-400/20 text-rose-200"
        : "from-white/10 to-white/5 border-white/10 text-slate-300";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border bg-gradient-to-r backdrop-blur-sm px-3 py-1 text-xs font-medium ${cls}`}>
      {dir === "up" ? <IconArrowUp /> : dir === "down" ? <IconArrowDown /> : <IconMinus />}
      <span className="font-semibold">{pct === null ? "—" : `${pct > 0 ? "+" : ""}${pct}%`}</span>
      <span className="text-slate-300/70">vs prev</span>
    </span>
  );
}

function Segment({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-white/5 backdrop-blur-sm p-1">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-200 ${
              active
                ? "bg-gradient-to-r from-blue-500/30 to-violet-500/20 backdrop-blur-sm text-slate-100 border border-white/10"
                : "text-slate-300 hover:bg-white/5"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function StatusPill({ status }) {
  const s = (status || "").toLowerCase();
  const cls =
    s === "won"
      ? "from-emerald-400/25 to-emerald-500/10 border-emerald-400/25 text-emerald-200"
      : s === "lost"
        ? "from-rose-400/25 to-rose-500/10 border-rose-400/25 text-rose-200"
        : s === "engaged"
          ? "from-blue-400/25 to-violet-500/10 border-blue-400/25 text-blue-200"
          : s === "follow-up" || s === "follow up"
            ? "from-amber-400/25 to-orange-400/10 border-amber-400/25 text-amber-200"
            : "from-white/10 to-white/5 border-white/10 text-slate-200";

  return (
    <span className={`inline-flex items-center rounded-full border bg-gradient-to-r backdrop-blur-sm px-3 py-1 text-xs font-medium ${cls}`}>
      {status || "Unknown"}
    </span>
  );
}

function ThGlass({ children, className = "" }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-300/70 ${className}`}>
      {children}
    </th>
  );
}
function TdGlass({ children, className = "" }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

function ChartFrame({ loading, empty, children }) {
  if (loading) return <div className="grid h-full place-items-center text-sm text-slate-300/70">Loading…</div>;
  if (empty) return <div className="grid h-full place-items-center text-sm text-slate-300/70">No data.</div>;
  return <>{children}</>;
}

function GlassTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0];
  return (
    <div className="rounded-[16px] border border-white/15 bg-[rgba(11,16,32,0.95)] backdrop-blur-xl px-3 py-2 text-xs shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
      <div className="font-semibold text-slate-100">{label || p?.name || "—"}</div>
      <div className="mt-0.5 text-slate-300">{p?.value ?? "—"}</div>
    </div>
  );
}

function safeString(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}
function safeNumber(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
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
function shortMD(ymdStr) {
  const d = new Date(`${ymdStr}T00:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
function fmtDate(d) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
function timeAgo(d) {
  const s = Math.floor((Date.now() - d.getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.floor(h / 24);
  return `${days}d ago`;
}
function percent(part, total) {
  if (!total) return 0;
  return Math.max(0, Math.min(100, Math.round((part / total) * 100)));
}
function normalizeStatus(v) {
  const s = (safeString(v).trim() || "New").toLowerCase();
  if (s === "follow up") return "Follow-up";
  if (s === "follow-up") return "Follow-up";
  if (s === "new") return "New";
  if (s === "engaged") return "Engaged";
  if (s === "won") return "Won";
  if (s === "lost") return "Lost";
  return "New";
}
function pctDelta(prev, cur) {
  if (!Number.isFinite(prev) || !Number.isFinite(cur)) return { direction: "flat", pct: null };
  if (prev <= 0 && cur <= 0) return { direction: "flat", pct: 0 };
  if (prev <= 0 && cur > 0) return { direction: "up", pct: 100 };
  const pct = Math.round(((cur - prev) / prev) * 100);
  const direction = pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  return { direction, pct };
}

function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconChat() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <path d="m20 6-11 11-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSpark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M12 2l1.2 4.2L17.4 8 13.2 9.2 12 13.4 10.8 9.2 6.6 8l4.2-1.8L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M19 12l.8 2.8L22.6 16l-2.8.8L19 19.6l-.8-2.8L15.4 16l2.8-.8L19 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function IconBolt() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconRefresh() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M21 12a9 9 0 1 1-3-6.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconArrowUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 11l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconArrowDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconMinus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}