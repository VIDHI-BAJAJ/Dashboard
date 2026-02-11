import React, { useState, useEffect } from "react";
import MetricCard from "./MetricCard";
import { Users, MessageCircle, CheckCircle, TrendingUp } from "lucide-react";

// Use VITE_API_URL for production, fallback to relative path for local development
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function MetricsGrid() {
  const [metrics, setMetrics] = useState({
    totalLeads: { value: 0, loading: true, error: null, percentage: 0 },
    totalConversations: { value: 0, loading: true, error: null, percentage: 0 },
    tasksDueToday: { value: 0, loading: true, error: null, percentage: 0 },
    dealsWon: { value: 0, loading: true, error: null, percentage: 0 },
  });

  const fetchAllRecords = async (endpoint) => {
    let allRecords = [];
    let offset = null;

    do {
      // Construct URL differently based on whether we're using a full URL or relative path
      let url;
      if (API_BASE_URL.startsWith('http')) {
        // Production environment with full URL
        url = offset
          ? `${API_BASE_URL}${endpoint}?offset=${offset}`
          : `${API_BASE_URL}${endpoint}`;
      } else {
        // Local development with relative path (Vite proxy)
        url = offset
          ? `${endpoint}?offset=${offset}`
          : `${endpoint}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${endpoint}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        allRecords = data;
        break;
      }

      if (data.records) {
        allRecords = allRecords.concat(data.records);
        offset = data.offset;
      } else {
        break;
      }
    } while (offset);

    return allRecords;
  };

  const fetchMetrics = async () => {
    try {
      const [leads, conversations, tasks, deals] = await Promise.all([
        fetchAllRecords("/api/leads"),
        fetchAllRecords("/api/conversations"),
        fetchAllRecords("/api/tasks"),
        fetchAllRecords("/api/deals"),
      ]);

      setMetrics({
        totalLeads: {
          value: leads.length,
          loading: false,
          error: null,
          percentage: 12,
        },

        totalConversations: {
          value: conversations.length,
          loading: false,
          error: null,
          percentage: 8,
        },

        tasksDueToday: {
          value: tasks.filter(
            (task) =>
              task?.fields &&
              isToday(task.fields["Due Date"]) &&
              task.fields.Status !== "Completed"
          ).length,
          loading: false,
          error: null,
          percentage: 3,
        },

        dealsWon: {
          value: deals.filter(
            (deal) => deal?.fields?.Stage === "Won"
          ).length,
          loading: false,
          error: null,
          percentage: 15,
        },
      });
    } catch (error) {
      console.error(error);
      setMetrics({
        totalLeads: { value: 0, loading: false, error: error.message, percentage: 0 },
        totalConversations: { value: 0, loading: false, error: error.message, percentage: 0 },
        tasksDueToday: { value: 0, loading: false, error: error.message, percentage: 0 },
        dealsWon: { value: 0, loading: false, error: error.message, percentage: 0 },
      });
    }
  };

  const isToday = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    const date = new Date(dateString);
    return date.toDateString() === today.toDateString();
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      {/* Desktop Grid - 5 columns */}
      <div className="hidden md:hidden lg:grid lg:grid-cols-5 gap-6 mb-8">
        <MetricCard
          title="Leads"
          subtitle="Total captured this month"
          value={metrics.totalLeads.value}
          icon={<Users size={20} className="text-gray-500" />}
          percentage={metrics.totalLeads.percentage}
          isLoading={metrics.totalLeads.loading}
          error={metrics.totalLeads.error}
          active={true} // Make Leads the active card
        />
        <MetricCard
          title="Conversations"
          subtitle="Total captured this month"
          value={metrics.totalConversations.value}
          icon={<MessageCircle size={20} className="text-gray-500" />}
          percentage={metrics.totalConversations.percentage}
          isLoading={metrics.totalConversations.loading}
          error={metrics.totalConversations.error}
        />
        <MetricCard
          title="Speed To Lead"
          subtitle="Total captured this month"
          value={metrics.totalConversations.value}
          icon={<MessageCircle size={20} className="text-gray-500" />}
          percentage={metrics.totalConversations.percentage}
          isLoading={metrics.totalConversations.loading}
          error={metrics.totalConversations.error}
        />
        <MetricCard
          title="Tasks Due Today"
          subtitle="Total captured this month"
          value={metrics.tasksDueToday.value}
          icon={<CheckCircle size={20} className="text-gray-500" />}
          percentage={metrics.tasksDueToday.percentage}
          isLoading={metrics.tasksDueToday.loading}
          error={metrics.tasksDueToday.error}
        />
        <MetricCard
          title="Deals Won"
          subtitle="Total captured this month"
          value={metrics.dealsWon.value}
          icon={<TrendingUp size={20} className="text-gray-500" />}
          percentage={metrics.dealsWon.percentage}
          isLoading={metrics.dealsWon.loading}
          error={metrics.dealsWon.error}
        />
      </div>

      {/* Tablet Grid - 2 columns */}
      <div className="hidden md:grid md:grid-cols-2 lg:hidden gap-6 mb-8">
        <MetricCard
          title="Leads"
          subtitle="Total captured this month"
          value={metrics.totalLeads.value}
          icon={<Users size={20} className="text-gray-500" />}
          percentage={metrics.totalLeads.percentage}
          isLoading={metrics.totalLeads.loading}
          error={metrics.totalLeads.error}
          active={true} // Make Leads the active card
        />
         <MetricCard
          title="Conversations"
          subtitle="Total captured this month"
          value={metrics.totalConversations.value}
          icon={<MessageCircle size={20} className="text-gray-500" />}
          percentage={metrics.totalConversations.percentage}
          isLoading={metrics.totalConversations.loading}
          error={metrics.totalConversations.error}
        />
          <MetricCard
          title="Speed To Lead"
          subtitle="Total captured this month"
          value={metrics.totalConversations.value}
          icon={<MessageCircle size={20} className="text-gray-500" />}
         percentage={metrics.totalConversations.percentage}
          isLoading={metrics.totalConversations.loading}
          error={metrics.totalConversations.error}
        />
        <MetricCard
          title="Tasks Due Today"
          subtitle="Total captured this month"
          value={metrics.tasksDueToday.value}
          icon={<CheckCircle size={20} className="text-gray-500" />}
          percentage={metrics.tasksDueToday.percentage}
          isLoading={metrics.tasksDueToday.loading}
          error={metrics.tasksDueToday.error}
        />
        <MetricCard
          title="Deals Won"
          subtitle="Total captured this month"
          value={metrics.dealsWon.value}
          icon={<TrendingUp size={20} className="text-gray-500" />}
          percentage={metrics.dealsWon.percentage}
          isLoading={metrics.dealsWon.loading}
          error={metrics.dealsWon.error}
        />
      </div>

      {/* Mobile - Single column */}
      <div className="md:hidden grid grid-cols gap-6 mb-8">
        <MetricCard
          title="Leads"
          subtitle="Total captured this month"
          value={metrics.totalLeads.value}
          icon={<Users size={20} className="text-gray-500" />}
          percentage={metrics.totalLeads.percentage}
          isLoading={metrics.totalLeads.loading}
          error={metrics.totalLeads.error}
          active={true} 
        />
        <MetricCard
          title="Conversations"
          subtitle="Total captured this month"
          value={metrics.totalConversations.value}
          icon={<MessageCircle size={20} className="text-gray-500" />}
          percentage={metrics.totalConversations.percentage}
          isLoading={metrics.totalConversations.loading}
          error={metrics.totalConversations.error}
        />
          <MetricCard
          title="Speed To Lead"
          subtitle="Total captured this month"
          value={metrics.totalConversations.value}
          icon={<MessageCircle size={20} className="text-gray-500" />}
         percentage={metrics.totalConversations.percentage}
          isLoading={metrics.totalConversations.loading}
          error={metrics.totalConversations.error}
        />
        <MetricCard
          title="Tasks Due Today"
          subtitle="Total captured this month"
          value={metrics.tasksDueToday.value}
          icon={<CheckCircle size={20} className="text-gray-500" />}
          percentage={metrics.tasksDueToday.percentage}
          isLoading={metrics.tasksDueToday.loading}
          error={metrics.tasksDueToday.error}
        />
        <MetricCard
          title="Deals Won"
          subtitle="Total captured this month"
          value={metrics.dealsWon.value}
          icon={<TrendingUp size={20} className="text-gray-500" />}
          percentage={metrics.dealsWon.percentage}
          isLoading={metrics.dealsWon.loading}
          error={metrics.dealsWon.error}
        />
      </div>
    </div>
  );
}