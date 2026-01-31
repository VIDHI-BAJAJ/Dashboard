import React from "react";

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

export function MetricCard({ title, value, trend, accent, icon }) {
  const accentBg =
    accent === "blue"
      ? "bg-blue-500/25 border-blue-300/50 text-blue-200"
      : accent === "cyan"
        ? "bg-cyan-500/25 border-cyan-300/50 text-cyan-200"
        : accent === "violet"
          ? "bg-violet-500/25 border-violet-300/50 text-violet-200"
          : "bg-emerald-500/25 border-emerald-300/50 text-emerald-200";

  return (
    <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-[24px] backdrop-saturate-150 p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.4)] transition-all duration-300 hover:bg-white/15 hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium uppercase tracking-wide text-gray-400/90">{title}</div>
          <div className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-gray-100">
            {Number.isFinite(value) ? value : 0}
          </div>
          <div className="mt-2">
            <TrendPill trend={trend} />
          </div>
        </div>
        <div className={`shrink-0 rounded-2xl p-3 backdrop-blur-[24px] ${accentBg} border`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export function TrendPill({ trend }) {
  const dir = trend?.direction || "flat";
  const pct = typeof trend?.pct === "number" ? trend.pct : null;
  const cls =
    dir === "up"
      ? "bg-green-400/20 text-green-200/90 border-green-300/40"
      : dir === "down"
        ? "bg-red-500/20 text-red-200/90 border-red-300/40"
        : "bg-gray-500/10 text-gray-200/90 border-gray-300/30";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm ${cls}`}>
      {dir === "up" ? <IconArrowUp /> : dir === "down" ? <IconArrowDown /> : <IconMinus />}
      <span className="font-semibold">{pct === null ? "—" : `${pct > 0 ? "+" : ""}${pct}%`}</span>
      <span className="text-gray-300/80">vs prev</span>
    </span>
  );
}

export function Segment({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-full border border-white/20 bg-white/12 backdrop-blur-[24px] p-1 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      {options.map((opt) => {
        const active = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
              active
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

export function StatusPill({ status }) {
  const s = (status || "").toLowerCase();
  const cls =
    s === "won"
      ? "bg-green-400/20 text-green-200/90 border-green-300/40"
      : s === "lost"
        ? "bg-red-500/20 text-red-200/90 border-red-300/40"
        : s === "engaged"
          ? "bg-blue-500/20 text-blue-200/90 border-blue-300/40"
          : s === "follow-up" || s === "follow up"
            ? "bg-yellow-500/20 text-yellow-200/90 border-yellow-300/40"
            : "bg-gray-500/10 text-gray-200/90 border-gray-300/30";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-sm ${cls}`}>
      {status || "Unknown"}
    </span>
  );
}

export function ThGlass({ children, className = "" }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400/80 ${className}`}>
      {children}
    </th>
  );
}

export function TdGlass({ children, className = "" }) {
  return <td className={`px-4 py-3 align-middle ${className}`}>{children}</td>;
}

export function ChartFrame({ loading, empty, children }) {
  if (loading) return <div className="grid h-full place-items-center text-sm text-gray-400/80">Loading…</div>;
  if (empty) return <div className="grid h-full place-items-center text-sm text-gray-400/80">No data.</div>;
  return <>{children}</>;
}

export function GlassTooltip({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0];
  return (
    <div className="rounded-xl border border-white/20 bg-white/15 backdrop-blur-[24px] px-3 py-2 text-xs shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
      <div className="font-semibold text-gray-100">{label || p?.name || "—"}</div>
      <div className="mt-0.5 text-gray-300/90">{p?.value ?? "—"}</div>
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

export function IconRefresh() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M21 12a9 9 0 1 1-3-6.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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