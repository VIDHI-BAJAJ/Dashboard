import React, { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import MetricsSection from "./MetricsSection";
import LeadsSection from "./LeadsSection";
import ActivitySection from "./ActivitySection";
import LeadsPage from "./LeadsPage";
import ConversationsPage from "./ConversationsPage";
import TasksPage from "./TasksPage";
import DealsPage from "./DealsPage";
import LeadDetails from "./LeadDetails";
import LeadForm from "./LeadForm";
import Listing from "./Listing";
import { GlassTooltip } from "./UIComponents";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("API_URL:", API_URL);

export default function Dashboard() {
  const [data, setData] = useState({
    leads: [],
    conversations: [],
    tasks: [],
    deals: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isLightMode, setIsLightMode] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Add revenue stats state
  const [revenueStats, setRevenueStats] = useState({
    achievedRevenue: 0,
    targetRevenue: 10000000,
    percentage: 0
  });

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

      const [leadsRes, convRes, tasksRes, dealsRes, revenueRes] = await Promise.all([
        fetch(`${API_URL}/api/leads`),
        fetch(`${API_URL}/api/conversations`),
        fetch(`${API_URL}/api/tasks`),
        fetch(`${API_URL}/api/deals`),
        fetch(`${API_URL}/api/revenue-stats`), // Add revenue stats fetch
      ]);

      const bad = [leadsRes, convRes, tasksRes, dealsRes, revenueRes].find((r) => !r.ok);
      if (bad) throw new Error(`Request failed: ${bad.status} ${bad.statusText}`);

      const [leads, conversations, tasks, deals, revenueData] = await Promise.all([
        leadsRes.json(),
        convRes.json(),
        tasksRes.json(),
        dealsRes.json(),
        revenueRes.json(), // Parse revenue stats
      ]);

      setData({
        leads: Array.isArray(leads) ? leads : [],
        conversations: Array.isArray(conversations) ? conversations : [],
        tasks: Array.isArray(tasks) ? tasks : [],
        deals: Array.isArray(deals) ? deals : [],
      });

      // Update revenue stats
      setRevenueStats({
        achievedRevenue: revenueData.achievedRevenue || 0,
        targetRevenue: revenueData.targetRevenue || 10000000,
        percentage: revenueData.percentage || 0
      });

      console.log('Revenue Stats Updated:', revenueData); // Debug log

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

  // Function to add new lead to Airtable
  const addLead = async (leadData) => {
    try {
      console.log("Submitting lead data:", leadData);
      
      const requestBody = {
        fields: {
          "Full Name": leadData.name,
          "Phone": leadData.phone,
          "Email": leadData.email,
          "Intent": leadData.intent,
          "Budget (Min)": leadData.budgetMin ? Number(leadData.budgetMin) : null,
          "Budget (Max)": leadData.budgetMax ? Number(leadData.budgetMax) : null,
          "Areas": leadData.area || null,
          "Beds": leadData.beds,
          "Timeline": leadData.timeline,
          "Status": "New",
          "Lead Source": "Dashboard Form"
        }
      };
      
      console.log("Request body:", JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`Failed to add lead: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Success response:", result);

      // Refresh data after successful addition
      await fetchAll({ isRefresh: true });
      setIsLeadFormOpen(false);
      
      // Show success message
      setSuccessMessage(`Lead "${leadData.name}" successfully added!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Add lead error:", error);
      setError(error?.message || "Failed to add lead");
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

  // Data processing functions
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

  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null;
    return data.leads.find(lead => lead.id === selectedLeadId);
  }, [data.leads, selectedLeadId]);

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
        direction: safeString(f["Direction"]), // Inbound = we sent message (right side), Outbound = they replied (left side)
        message: safeString(f["Body Text"] ?? f["Message"] ?? f["Last Message"] ?? f["Snippet"]),
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

  // Group conversations by contact and get latest 8 contacts
  const recentConversations = useMemo(() => {
    // Group conversations by contact
    const groups = {};
    convRows.forEach(conv => {
      const key = conv.name || conv.phone || 'Unknown';
      if (!groups[key]) {
        groups[key] = {
          name: conv.name,
          phone: conv.phone,
          conversations: [],
          lastMessageAt: null,
          snippet: '',
          channel: conv.channel,
        };
      }
      groups[key].conversations.push(conv);
      
      // Update group's last message info if this conversation is more recent
      if (!groups[key].lastMessageAt || (conv.lastMessageAt && conv.lastMessageAt > groups[key].lastMessageAt)) {
        groups[key].lastMessageAt = conv.lastMessageAt;
        groups[key].snippet = conv.snippet;
        groups[key].channel = conv.channel;
      }
    });
    
    // Sort groups by last message time and take top 8
    const sortedGroups = Object.values(groups)
      .sort((a, b) => (b.lastMessageAt?.getTime?.() || 0) - (a.lastMessageAt?.getTime?.() || 0))
      .slice(0, 8);
    
    return sortedGroups;
  }, [convRows]);

  const upcomingTasks = useMemo(() => {
    const now = new Date();
    return [...taskRows]
      .filter((t) => t.dueAt && t.dueAt.getTime() >= now.getTime())
      .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
      .slice(0, 6);
  }, [taskRows]);

  return (
    <div className={`relative min-h-screen transition-all duration-500 ${
     isLightMode
? "bg-gradient-to-br from-rose-200 via-purple-200 to-blue-200 text-gray-900"
: "bg-gradient-to-br from-black  to-purple-900 text-gray-100"

    }`}>

  <Sidebar 
        updatedAgoLabel={updatedAgoLabel} 
        loading={loading} 
        refreshing={refreshing} 
        fetchAll={fetchAll} 
        activePage={activePage}
        setActivePage={setActivePage}
        isLightMode={isLightMode}
        setIsLightMode={setIsLightMode}
      >
        <main className="px-4 pb-10 pt-4 sm:pt-6 sm:px-6 lg:px-8">
          {error ? (
            <div className="mb-6 rounded-3xl border border-red-300/30 bg-red-500/10 backdrop-blur-[32px] backdrop-saturate-150 px-6 py-5 text-sm text-red-700/90 shadow-[0_12px_32px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]">
              <div className="font-semibold text-red-800">Failed to load</div>
              <div className="mt-1 font-mono text-xs text-red-600/85">{error}</div>
            </div>
          ) : null}

          {/* Render different pages based on activePage state */}
          {activePage === "dashboard" ? (
            <>
              <MetricsSection metrics={metrics} trends={trends} isLightMode={isLightMode} />
              <LeadsSection 
                leadsOverviewSeries={leadsOverviewSeries}
                leadsByStatus={leadsByStatus}
                leadsRows={leadsRows}
                loading={loading}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                percent={percent}
                isLightMode={isLightMode}
                targetRevenue={revenueStats.targetRevenue}
                achievedRevenue={revenueStats.achievedRevenue}
              />
              <ActivitySection 
                convRows={convRows}
                taskRows={taskRows}
                recentConversations={recentConversations}
                upcomingTasks={upcomingTasks}
                loading={loading}
                timeAgo={timeAgo}
                fmtDate={fmtDate}
                isLightMode={isLightMode}
                onConversationClick={(group) => {
                  // Set selected contact and navigate to conversations page
                  setSelectedContact(group);
                  setActivePage('conversations');
                }}
              />
            </>
          ) : activePage === "leads" ? (
            selectedLead ? (
              <LeadDetails
                lead={selectedLead}
                onBack={() => setSelectedLeadId(null)}
                loading={loading}
                refreshing={refreshing}
                fetchAll={fetchAll}
                isLightMode={isLightMode}
              />
            ) : (
              <LeadsPage 
                data={data}
                loading={loading}
                refreshing={refreshing}
                fetchAll={fetchAll}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
                percent={percent}
                isLightMode={isLightMode}
                selectedLeadId={selectedLeadId}
                onLeadSelect={setSelectedLeadId}
              />
            )
          ) : activePage === "conversations" ? (
            <ConversationsPage 
              data={data}
              loading={loading}
              refreshing={refreshing}
              fetchAll={fetchAll}
              timeAgo={timeAgo}
              isLightMode={isLightMode}
              initialSelectedContact={selectedContact}
              onContactSelect={setSelectedContact}
            />
          ) : activePage === "tasks" ? (
            <TasksPage 
              data={data}
              loading={loading}
              refreshing={refreshing}
              fetchAll={fetchAll}
              timeAgo={timeAgo}
            />
          ) : activePage === "deals" ? (
            <DealsPage 
              data={data}
              loading={loading}
              refreshing={refreshing}
              fetchAll={fetchAll}
            />
          ) : activePage === "listing" ? (
            <Listing isLightMode={isLightMode} />
          ) : null}
        </main>
        
        {/* Success Message */}
        {successMessage && (
          <div className={`fixed top-20 right-6 z-50 px-6 py-4 rounded-2xl shadow-lg transform transition-all duration-300 ${
            isLightMode
              ? 'bg-green-500 text-white shadow-green-500/30'
              : 'bg-green-600 text-white shadow-green-600/30'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              <span className="font-medium">{successMessage}</span>
            </div>
          </div>
        )}
        
        {/* Floating Add Lead Button */}
        {activePage === 'dashboard' && (
          <button
            type='button'
            onClick={() => setIsLeadFormOpen(true)}
            className={`fixed sm:bottom-6 bottom-20 sm:right-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-2xl transition-all duration-300 hover:scale-110 hover:shadow-xl z-40 ${
              isLightMode
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            +
          </button>
        )}

        {/* Lead Form Modal */}
        <LeadForm
          isOpen={isLeadFormOpen}
          onClose={() => setIsLeadFormOpen(false)}
          onSubmit={addLead}
          isLightMode={isLightMode}
          loading={refreshing}
        />
      </Sidebar>
    </div>
  );
}

// Utility functions
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