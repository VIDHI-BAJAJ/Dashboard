import React from "react";

export const liquidGlassClasses = {
  base: "backdrop-blur-xl border rounded-2xl transition-all duration-300 hover:scale-105",
  light: "bg-white/30 border-white/50 text-gray-900 shadow-xl",
  dark: "bg-white/5 border-white/10 text-gray-100 shadow-xl",
  hover: "hover:bg-white/50",
  hoverDark: "hover:bg-white/10"
};

export function NavItem({ children, active }) {
  return (
    <button
      type="button"
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-white/15 backdrop-blur-[24px] text-blue-200 border border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
          : "text-gray-400/85 hover:bg-white/12 hover:text-gray-300 hover:border-white/20 border border-transparent"
      }`}
    >
      {children}
    </button>
  );
}

export function IconButton({ children, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/15 backdrop-blur-[24px] text-gray-300/95 transition-all duration-300 hover:bg-white/20 hover:border-white/25 shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
    >
      {children}
    </button>
  );
}

export function MetricCard({ title, value, trend, accent, icon, isLightMode = false }) {
  const accentBg = isLightMode
    ? accent === "blue"
      ? "bg-orange-400/25 border-orange-300/50 text-orange-700"
      : accent === "cyan"
        ? "bg-pink-400/25 border-pink-300/50 text-pink-700"
        : accent === "violet"
          ? "bg-indigo-400/25 border-indigo-300/50 text-indigo-700"
          : "bg-amber-300/20 border-amber-300/40 text-amber-700"
    : accent === "blue"
      ? "bg-orange-500/30 border-orange-300/60 text-orange-200"
      : accent === "cyan"
        ? "bg-pink-500/30 border-pink-300/60 text-pink-200"
        : accent === "violet"
          ? "bg-indigo-500/30 border-indigo-300/60 text-indigo-200"
          : "bg-amber-400/25 border-amber-300/50 text-amber-200";

  return (
    <div className={`rounded-3xl p-5 sm:p-6 transition-all duration-500 hover:scale-[1.02] ${
      isLightMode
        ? 'border border-gray-200/40 bg-white/60 backdrop-blur-[36px] backdrop-saturate-150 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.4)] hover:bg-white/70 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]'
        : 'border border-white/15 bg-white/10 backdrop-blur-[36px] backdrop-saturate-150 shadow-[0_8px_24px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-white/15 hover:border-white/25 hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)]'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className={`text-xs font-medium uppercase tracking-wide ${isLightMode ? 'text-gray-600' : 'text-gray-300/80'}`}>{title}</div>
          <div className={`mt-3 text-3xl sm:text-4xl font-semibold tracking-tight ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>
            {Number.isFinite(value) ? value : 0}
          </div>
          <div className="mt-2">
            <TrendPill trend={trend} isLightMode={isLightMode} />
          </div>
        </div>
        <div className={`shrink-0 rounded-2xl p-3 backdrop-blur-[32px] ${accentBg} border shadow-[0_2px_8px_rgba(0,0,0,0.03)]`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function TrendPill({ trend, isLightMode = false }) {
  const dir = trend?.direction || "flat";
  const pct = typeof trend?.pct === "number" ? trend.pct : null;
  const cls = isLightMode
    ? dir === "up"
      ? "bg-green-100 text-green-700 border-green-200"
      : dir === "down"
        ? "bg-red-100 text-red-700 border-red-200"
        : "bg-gray-100 text-gray-700 border-gray-200"
    : dir === "up"
      ? "bg-green-400/20 text-green-200/90 border-green-300/40"
      : dir === "down"
        ? "bg-red-500/20 text-red-200/90 border-red-300/40"
        : "bg-gray-500/10 text-gray-200/90 border-gray-300/30";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm ${cls}`}>
      {dir === "up" ? <IconArrowUp /> : dir === "down" ? <IconArrowDown /> : <IconMinus />}
      <span className="font-semibold">{pct === null ? "—" : `${pct > 0 ? "+" : ""}${pct}%`}</span>
      <span className={isLightMode ? 'text-black' : 'text-gray-300/80'}>vs prev</span>
    </span>
  );
}

export function Segment({ value, onChange, options, isLightMode = false }) {
  return (
    <div className={`inline-flex rounded-full p-1 ${
      isLightMode
        ? 'border border-gray-200 bg-gray-100 shadow-sm'
        : 'border border-white/20 bg-white/12 backdrop-blur-[24px] shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
    }`}>
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
              isLightMode
                ? active
                  ? "bg-white text-gray-900 border border-gray-300 shadow-sm"
                  : "text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                : active
                  ? "bg-white/15 text-gray-100 border border-white/25 shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                  : "text-gray-300/80 hover:bg-white/10 hover:text-gray-200"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function StatusPill({ status, isLightMode = false }) {
  const s = (status || "").toLowerCase();
  
  const cls = isLightMode
    ? s === "won"
      ? "bg-green-100 text-green-700 border-green-200"
      : s === "lost"
        ? "bg-red-100 text-red-700 border-red-200"
        : s === "engaged"
          ? "bg-blue-100 text-blue-700 border-blue-200"
          : s === "follow-up" || s === "follow up"
            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
            : "bg-gray-100 text-gray-700 border-gray-200"
    : s === "won"
      ? "bg-green-400/20 text-green-200/90 border-green-300/40"
      : s === "lost"
        ? "bg-red-500/20 text-red-200/90 border-red-300/40"
        : s === "engaged"
          ? "bg-blue-500/20 text-blue-200/90 border-blue-300/40"
          : s === "follow-up" || s === "follow up"
            ? "bg-yellow-500/20 text-yellow-200/90 border-yellow-300/40"
            : "bg-gray-500/10 text-gray-200/90 border-gray-300/30";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${isLightMode ? '' : 'backdrop-blur-sm'} ${cls}`}>
      {status || "Unknown"}
    </span>
  );
}

export function ThGlass({ children, className = "", isLightMode = false }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${isLightMode ? 'text-gray-900' : 'text-gray-400/80'} ${className}`}>
      {children}
    </th>
  );
}

export function TdGlass({ children, className = "" }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

export function ChartFrame({ loading, empty, children, isLightMode = false }) {
  if (loading) return <div className={`grid h-full place-items-center text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-400/80'}`}>Loading…</div>;
  if (empty) return <div className={`grid h-full place-items-center text-sm ${isLightMode ? 'text-gray-700' : 'text-gray-400/80'}`}>No data.</div>;
  return <>{children}</>;
}

export function GlassTooltip({ active, payload, label, isLightMode = false }) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0];
  return (
    <div className={`rounded-xl border ${isLightMode ? 'border-gray-300 bg-white shadow-sm' : 'border-white/20 bg-white/15 backdrop-blur-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.1)]'} px-3 py-2 text-xs`}>
      <div className={`font-semibold ${isLightMode ? 'text-gray-900' : 'text-gray-100'}`}>{label || p?.name || "—"}</div>
      <div className={`mt-0.5 ${isLightMode ? 'text-gray-700' : 'text-gray-300/90'}`}>{p?.value ?? "—"}</div>
    </div>
  );
}

// Icon Components
export function IconUsers() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconChat() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <path d="m20 6-11 11-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSpark() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M12 2l1.2 4.2L17.4 8 13.2 9.2 12 13.4 10.8 9.2 6.6 8l4.2-1.8L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M19 12l.8 2.8L22.6 16l-2.8.8L19 19.6l-.8-2.8L15.4 16l2.8-.8L19 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBolt() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M13 2 3 14h8l-1 8 10-12h-8l1-8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconRefresh({ className = "" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={`block ${className}`}>
      <path d="M21 12a9 9 0 1 1-3-6.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconX() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconSun() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconMoon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M12 5v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 11l6-6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M12 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 13l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconMinus() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}