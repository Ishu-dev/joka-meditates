import { thoughts } from "@/data/thoughts";
import { shlokas } from "@/data/shlokas";

// What the board shows today. The day turns over at midnight in Kolkata, and
// the two lists have different lengths so a pair does not repeat for over a
// year.
export function today(now = new Date()) {
  const iso = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
  const [y, m, d] = iso.split("-").map(Number);
  const dayNumber = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).formatToParts(now);
  const get = (type) => parts.find((p) => p.type === type)?.value || "";
  return {
    iso,
    label: `${get("weekday")}, ${get("day")} ${get("month")}`,
    thought: thoughts[dayNumber % thoughts.length],
    shloka: shlokas[dayNumber % shlokas.length],
  };
}
