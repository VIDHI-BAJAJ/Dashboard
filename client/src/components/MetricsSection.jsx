import React from "react";
import { MetricCard, IconUsers, IconChat, IconCheck, IconSpark } from "./UIComponents";

export default function MetricsSection({ metrics, trends }) {
  return (
    <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard title="Total Leads" value={metrics.totalLeads} trend={trends.leads} accent="blue" icon={<IconUsers />} />
      <MetricCard title="Active Conversations" value={metrics.activeConversations} trend={trends.conv} accent="cyan" icon={<IconChat />} />
      <MetricCard title="Tasks Due Today" value={metrics.tasksDueToday} trend={trends.tasks} accent="violet" icon={<IconCheck />} />
      <MetricCard title="Deals Won" value={metrics.dealsWon} trend={trends.deals} accent="emerald" icon={<IconSpark />} />
    </section>
  );
}