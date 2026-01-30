import React, { useEffect, useMemo, useState } from "react";

/**
 * Sales CRM Dashboard
 * - Fetches leads from http://localhost:5000/api/leads
 * - Summary cards
 * - Client-side search + filters
 * - Responsive table (horizontal scroll on mobile)
 */
export default function CRM() {
  const [leads, setLeads] = useState([]); // raw API array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [intentFilter, setIntentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("http://localhost:5000/api/leads");
        if (!res.ok) throw new Error(`Request failed: ${res.status} ${res.statusText}`);

        const data = await res.json();
        if (!cancelled) setLeads(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load leads");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const normalized = useMemo(() => {
    // Normalize safely: Airtable record -> flat row
    return leads.map((rec) => {
      const f = rec?.fields || {};
      const fullName = safeString(f["Full Name"]);
      const phone = safeString(f["Phone"]);
      const intent = safeString(f["Intent"]); // Rent / Buy
      const status = safeString(f["Status"]); // New / Engaged / Follow-up / Won / Lost
      const score = safeNumber(f["Lead Score (0-100)"]);
      const minBudget = safeNumber(f["Budget (Min)"]);
      const maxBudget = safeNumber(f["Budget (Max)"]);
      const source = safeString(f["Lead Source"]);

      return {
        id: rec?.id || `${fullName}-${phone}-${Math.random()}`,
        fullName,
        phone,
        intent,
        status,
        score, // 0-100 or null
        minBudget,
        maxBudget,
        source,
      };
    });
  }, [leads]);

  const intents = useMemo(() => uniqueNonEmpty(normalized.map((x) => x.intent)).sort(), [normalized]);
  const statuses = useMemo(() => uniqueNonEmpty(normalized.map((x) => x.status)).sort(), [normalized]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return normalized.filter((row) => {
      const matchesIntent = intentFilter === "All" ? true : (row.intent || "").toLowerCase() === intentFilter.toLowerCase();
      const matchesStatus = statusFilter === "All" ? true : (row.status || "").toLowerCase() === statusFilter.toLowerCase();

      const matchesQuery =
        q.length === 0
          ? true
          : (row.fullName || "").toLowerCase().includes(q) || (row.phone || "").toLowerCase().includes(q);

      return matchesIntent && matchesStatus && matchesQuery;
    });
  }, [normalized, intentFilter, statusFilter, query]);

  const stats = useMemo(() => {
    const total = normalized.length;
    const rent = normalized.filter((x) => (x.intent || "").toLowerCase() === "rent").length;
    const buy = normalized.filter((x) => (x.intent || "").toLowerCase() === "buy").length;
    const engaged = normalized.filter((x) => (x.status || "").toLowerCase() === "engaged").length;
    return { total, rent, buy, engaged };
  }, [normalized]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Sales CRM</h1>
            <p className="text-sm text-slate-500">Leads overview (Airtable → API)</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
              API: <span className="ml-1 font-mono">/api/leads</span>
            </span>
          </div>
        </div>

        {/* Status */}
        {error ? (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <div className="font-semibold">Failed to load leads</div>
            <div className="mt-1 font-mono text-xs">{error}</div>
          </div>
        ) : null}

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Leads" value={stats.total} icon={<IconUsers />} />
          <StatCard title="Rent Leads" value={stats.rent} icon={<IconHome />} />
          <StatCard title="Buy Leads" value={stats.buy} icon={<IconTag />} />
          <StatCard title="Engaged Leads" value={stats.engaged} icon={<IconSpark />} />
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-700">Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or phone…"
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="sm:w-48">
              <label className="block text-xs font-medium text-slate-700">Intent</label>
              <select
                value={intentFilter}
                onChange={(e) => setIntentFilter(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
              >
                <option value="All">All</option>
                {intents.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:w-56">
              <label className="block text-xs font-medium text-slate-700">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-slate-300 focus:ring-2 focus:ring-slate-200"
              >
                <option value="All">All</option>
                {statuses.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setQuery("");
                setIntentFilter("All");
                setStatusFilter("All");
              }}
              className="mt-5 inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 sm:mt-0 sm:self-end"
              type="button"
            >
              Reset
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              Showing <span className="font-medium text-slate-700">{filtered.length}</span> of{" "}
              <span className="font-medium text-slate-700">{normalized.length}</span> leads
            </div>
            {loading ? <div className="font-medium text-slate-700">Loading…</div> : null}
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-separate border-spacing-0">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                  <Th>Name</Th>
                  <Th>Phone</Th>
                  <Th>Intent</Th>
                  <Th>Status</Th>
                  <Th>Lead Score</Th>
                  <Th>Budget Range</Th>
                  <Th>Lead Source</Th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                      No leads match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((row) => (
                    <tr key={row.id} className="group border-t border-slate-100 hover:bg-slate-50/60">
                      <Td>
                        <div className="font-medium text-slate-900">{row.fullName || "—"}</div>
                      </Td>

                      <Td>
                        <div className="font-mono text-sm text-slate-700">{row.phone || "—"}</div>
                      </Td>

                      <Td>
                        <BadgeIntent intent={row.intent} />
                      </Td>

                      <Td>
                        <BadgeStatus status={row.status} />
                      </Td>

                      <Td>
                        <ScoreBar score={row.score} />
                      </Td>

                      <Td>
                        <div className="text-sm text-slate-700">{formatBudgetRange(row.minBudget, row.maxBudget)}</div>
                      </Td>

                      <Td>
                        <div className="text-sm text-slate-700">{row.source || "—"}</div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-400">
          Tip: horizontal scroll is enabled on smaller screens.
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-600">{title}</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{Number.isFinite(value) ? value : 0}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700">{icon}</div>
      </div>
    </div>
  );
}

function BadgeIntent({ intent }) {
  const v = (intent || "").toLowerCase();
  const isRent = v === "rent";
  const isBuy = v === "buy";

  const cls = isRent
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : isBuy
      ? "border-blue-200 bg-blue-50 text-blue-700"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>{intent || "—"}</span>;
}

function BadgeStatus({ status }) {
  const v = (status || "").toLowerCase();
  const cls =
    v === "new"
      ? "border-slate-200 bg-slate-50 text-slate-700"
      : v === "engaged"
        ? "border-violet-200 bg-violet-50 text-violet-700"
        : v === "follow-up" || v === "follow up"
          ? "border-amber-200 bg-amber-50 text-amber-800"
          : v === "won"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
            : v === "lost"
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-slate-200 bg-slate-50 text-slate-700";

  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>{status || "—"}</span>;
}

function ScoreBar({ score }) {
  const s = clampNumber(score, 0, 100);
  const label = Number.isFinite(score) ? `${Math.round(s)}%` : "—";

  const barColor =
    s >= 80 ? "bg-emerald-500" : s >= 50 ? "bg-amber-500" : s > 0 ? "bg-rose-500" : "bg-slate-300";

  return (
    <div className="min-w-[140px]">
      <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
        <span className="font-medium text-slate-700">{label}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full ${barColor}`} style={{ width: `${Number.isFinite(score) ? s : 0}%` }} />
      </div>
    </div>
  );
}

function Th({ children }) {
  return <th className="px-4 py-3">{children}</th>;
}
function Td({ children }) {
  return <td className="px-4 py-3 align-middle">{children}</td>;
}

/* ---------- utils ---------- */

function safeString(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}

function safeNumber(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function clampNumber(v, min, max) {
  const n = typeof v === "number" && Number.isFinite(v) ? v : 0;
  return Math.min(max, Math.max(min, n));
}

function uniqueNonEmpty(arr) {
  return Array.from(new Set(arr.map((x) => (x || "").trim()).filter(Boolean)));
}

function formatBudgetRange(minBudget, maxBudget) {
  const min = typeof minBudget === "number" ? minBudget : null;
  const max = typeof maxBudget === "number" ? maxBudget : null;

  if (min === null && max === null) return "—";
  if (min !== null && max === null) return `${formatMoney(min)}+`;
  if (min === null && max !== null) return `Up to ${formatMoney(max)}`;
  return `${formatMoney(min)} – ${formatMoney(max)}`;
}

function formatMoney(n) {
  try {
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(n);
  } catch {
    return String(n);
  }
}

/* ---------- tiny inline icons (no library) ---------- */

function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-10.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M20.59 13.41 12 22l-10-10V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M7 7h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function IconSpark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="block">
      <path d="M12 2l1.2 4.2L17.4 8 13.2 9.2 12 13.4 10.8 9.2 6.6 8l4.2-1.8L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M19 12l.8 2.8L22.6 16l-2.8.8L19 19.6l-.8-2.8L15.4 16l2.8-.8L19 12Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}