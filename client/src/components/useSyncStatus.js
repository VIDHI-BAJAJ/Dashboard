import { useState, useEffect, useRef } from "react";

export function useSyncStatus(active) {
  const [data, setData] = useState({ status: "none", ticketNumber: null, connectedAt: null });
  const intervalRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    if (!active) return;
    const TERMINAL = ["connected", "timeout"];
    const poll = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch('${API_URL}/api/portal/status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const result = await res.json();
        setData(result);
        if (TERMINAL.includes(result.status)) clearInterval(intervalRef.current);
      } catch (err) {
        console.error("Portal polling error:", err);
      }
    };
    poll();
    intervalRef.current = setInterval(poll, 10_000);
    return () => clearInterval(intervalRef.current);
  }, [active]);

  return data;
}