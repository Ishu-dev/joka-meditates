"use client";

import { useEffect, useState } from "react";

// "N visits since 21 November 2026. M here now." in the footer. A browser is
// counted once a day, so a refresh does not add to the total, and a tab counts
// as here while it keeps calling in once a minute. Shows nothing until the
// counter answers, and nothing at all if no store is connected.
const SINCE = "21 November 2026";

export default function VisitCount() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    const id = Math.random().toString(36).slice(2, 14).padEnd(8, "0");
    const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
    let first = false;
    try {
      first = localStorage.getItem("jm-visit") !== today;
    } catch {}
    const call = async (isFirst) => {
      if (document.hidden) return;
      try {
        const reply = await fetch("/api/visits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, first: isFirst }),
        });
        const data = await reply.json();
        if (typeof data.total !== "number") return;
        if (isFirst) {
          try {
            localStorage.setItem("jm-visit", today);
          } catch {}
        }
        setCount(data);
      } catch {}
    };
    call(first);
    const timer = setInterval(() => call(false), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!count) return null;
  return (
    <p className="note visits" aria-live="off">
      {count.total.toLocaleString("en-IN")} {count.total === 1 ? "visit" : "visits"} since {SINCE}. {count.here} here now.
    </p>
  );
}
