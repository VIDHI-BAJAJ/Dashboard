import React, { useMemo } from "react";
import { IconCheck, IconRefresh } from "./UIComponents";

export default function TasksPage({ data, loading, refreshing, fetchAll, timeAgo, isLightMode = false }) {
  // Process tasks data
  const taskRows = useMemo(() => {
    return (data.tasks || []).map((rec) => {
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

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const groups = {
      pending: [],
      inProgress: [],
      completed: []
    };
    
    taskRows.forEach((task) => {
      const status = (task.status || "").toLowerCase();
      if (status.includes("complete") || status.includes("done")) {
        groups.completed.push(task);
      } else if (status.includes("progress") || status.includes("working")) {
        groups.inProgress.push(task);
      } else {
        groups.pending.push(task);
      }
    });
    
    return groups;
  }, [taskRows]);

  // Get overdue tasks
  const overdueTasks = useMemo(() => {
    const now = new Date();
    return taskRows.filter(task => 
      task.dueAt && task.dueAt < now && 
      !(task.status || "").toLowerCase().includes("complete")
    );
  }, [taskRows]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>Tasks</h1>
          <p className={`mt-1 ${isLightMode ? 'text-gray-700' : 'text-gray-400'}`}>Manage your workflow and deadlines</p>
        </div>
        <button
          type="button"
          onClick={() => fetchAll({ isRefresh: true })}
          disabled={loading || refreshing}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
            isLightMode
              ? 'border border-gray-200 bg-gray-100 text-gray-900 hover:bg-gray-200'
              : 'border border-white/20 bg-white/15 backdrop-blur-[24px] text-white hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]'
          }`}>
        
          <IconRefresh className={`${(loading || refreshing) ? 'animate-spin' : ''}`} />
          {(loading || refreshing) ? "Refreshing…" : "Refresh"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10 '
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>Total Tasks</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{taskRows.length}</div>
        </div>
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>Pending</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{tasksByStatus.pending.length}</div>
        </div>
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>In Progress</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{tasksByStatus.inProgress.length}</div>
        </div>
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
            : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
        }`}>
          <div className={`text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-300'}`}>Completed</div>
          <div className={`mt-1 text-2xl font-bold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>{tasksByStatus.completed.length}</div>
        </div>
      </div>

      {/* Overdue Warning */}
      {overdueTasks.length > 0 && (
        <div className={`rounded-2xl p-5 backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
          isLightMode
            ? 'bg-red-50/80 border-red-200 shadow-xl hover:bg-red-100/80'
            : 'bg-red-500/10 border-red-500/20 shadow-xl hover:bg-red-500/15'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <div>
              <h3 className={`font-semibold ${isLightMode ? 'text-red-900' : 'text-red-400'}`}>Overdue Tasks</h3>
              <p className={`text-sm ${isLightMode ? 'text-red-700' : 'text-red-300'}`}>
                You have {overdueTasks.length} task{overdueTasks.length > 1 ? 's' : ''} past due date
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className={`rounded-2xl backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105 ${
        isLightMode
          ? 'bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50'
          : 'bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10'
      }`}>
        <div className={`p-5 border-b ${isLightMode ? 'border-gray-200/40' : 'border-white/10'}`}>
          <h2 className={`text-lg font-semibold ${isLightMode ? 'text-gray-900' : 'text-white'}`}>All Tasks</h2>
        </div>
        <div className={isLightMode ? 'divide-y divide-gray-200/40' : 'divide-y divide-white/10'}>
          {taskRows.slice(0, 10).map((task) => (
            <div key={task.id} className={`p-5 transition-colors ${isLightMode ? 'hover:bg-gray-100/50' : 'hover:bg-white/5'}`}>
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    (task.status || "").toLowerCase().includes("complete")
                      ? "bg-green-500/20 border-green-500 text-green-500"
                      : isLightMode 
                      ? "border-gray-400"
                      : "border-gray-500"
                  }`}>
                    {(task.status || "").toLowerCase().includes("complete") && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-medium ${
                      (task.status || "").toLowerCase().includes("complete")
                        ? isLightMode 
                          ? "text-gray-500 line-through"
                          : "text-gray-400 line-through"
                        : isLightMode
                        ? "text-gray-900"
                        : "text-gray-100"
                    }`}>
                      {task.title || "Untitled Task"}
                    </h3>
                    {task.priority && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.priority.toLowerCase() === "high" 
                          ? isLightMode 
                            ? "bg-red-100 text-red-800" 
                            : "bg-red-500/20 text-red-300"
                          : task.priority.toLowerCase() === "medium"
                          ? isLightMode
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-yellow-500/20 text-yellow-300"
                          : isLightMode
                          ? "bg-blue-100 text-blue-800"
                          : "bg-blue-500/20 text-blue-300"
                      }`}>
                        {task.priority}
                      </span>
                    )}
                  </div>
                  <div className={`flex items-center gap-4 text-sm ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    <span className="inline-flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${
                        (task.status || "").toLowerCase().includes("complete")
                          ? "bg-green-500"
                          : (task.status || "").toLowerCase().includes("progress")
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}></span>
                      {task.status || "Pending"}
                    </span>
                    {task.dueAt && (
                      <span className={`${
                        task.dueAt < new Date() && !(task.status || "").toLowerCase().includes("complete") 
                          ? isLightMode 
                            ? "text-red-700 font-medium" 
                            : "text-red-400"
                          : isLightMode 
                          ? "text-gray-600" 
                          : "text-gray-400"
                      }`}>
                        Due: {task.dueAt.toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {taskRows.length === 0 && (
          <div className={`p-10 text-center ${isLightMode ? 'text-gray-600' : 'text-gray-400'}`}>
            No tasks found
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