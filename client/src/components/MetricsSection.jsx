import React from "react";
import {
  Users,
  MessageCircle,
  CheckCircle,
  Trophy,
  ChartNoAxesCombined,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export default function MetricsSection({ metrics, trends, isLightMode }) {
  const cards = [
    {
      title: "Total Leads",
      value: metrics.totalLeads,
      trend: trends?.leads,
      icon: <Users size={20} />,
      tint: "orange",
    },
    {
      title: "Active Conversations",
      value: metrics.activeConversations,
      trend: trends?.conv,
      icon: <MessageCircle size={20} />,
      tint: "pink",
    },
    {
      title: "Speed To Lead",
      value: metrics.activeConversations,
      trend: trends?.conv,
      icon: <ChartNoAxesCombined size={20} />,
      tint: "green",
    },
    {
      title: "Tasks Due Today",
      value: metrics.tasksDueToday,
      trend: trends?.tasks,
      icon: <CheckCircle size={20} />,
      tint: "indigo",
    },
    {
      title: "Deals Won",
      value: metrics.dealsWon,
      trend: trends?.deals,
      icon: <Trophy size={20} />,
      tint: "yellow",
    },
  ];

  return (
    <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4 sm:gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`relative rounded-2xl p-4 sm:p-6 backdrop-blur-xl
            border rounded-2xl transition-all duration-300 hover:scale-105
            ${
              isLightMode
                ? "bg-white/30 border-white/50 text-gray-900 shadow-xl hover:bg-white/50"
                : "bg-white/5 border-white/10 text-gray-100 shadow-xl hover:bg-white/10"
            }
          `}
        >
          {/* soft highlight line (Apple-like) */}
          <div/>

          {/* header */}
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium opacity-80">
              {card.title}
            </span>

            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full
                backdrop-blur-md shadow-inner
                ${
                  card.tint === "orange" &&
                  "bg-orange-400/20 text-orange-300"
                }
                ${
                  card.tint === "pink" &&
                  "bg-pink-400/20 text-pink-300"
                }
                 ${
                  card.tint === "green" &&
                  "bg-green-400/20 text-green-300"
                }
                ${
                  card.tint === "indigo" &&
                  "bg-indigo-400/20 text-indigo-300"
                }
                ${
                  card.tint === "yellow" &&
                  "bg-yellow-400/20 text-yellow-300"
                }
              `}
            >
              {card.icon}
            </div>
          </div>

          {/* value */}
          <div className="text-3xl font-semibold tracking-tight">
            {card.value}
          </div>

          {/* trend */}
          <div className="mt-3">
            {card.trend?.pct === null ? (
              <span className="text-xs opacity-60">No data</span>
            ) : (
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium
                  ${
                    card.trend.direction === "up"
                      ? "bg-black-400/20 text-white-300"
                      : card.trend.direction === "down"
                      ? "bg-red-400/20 text-red-300"
                      : "bg-gray-400/20 text-gray-300"
                  }
                `}
              >
                {card.trend.direction === "up" && <ArrowUp size={12} />}
                {card.trend.direction === "down" && <ArrowDown size={12} />}
                {Math.abs(card.trend.pct)}% vs prev
              </span>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
