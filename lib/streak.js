// Practice log, kept on the device until sign-in exists. Shape:
// { "2026-11-18": [{ id: "box", s: 128, t: 1794990000000 }] }
// Dates are IST calendar days, because the club lives in Kolkata.

const KEY = "jm-practice-log";

export function dayKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(date);
}

export function loadLog() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
}

export function markPractice(id, seconds) {
  const log = loadLog();
  const key = dayKey();
  if (!Array.isArray(log[key])) log[key] = [];
  log[key].push({ id, s: Math.round(seconds), t: Date.now() });
  try {
    localStorage.setItem(KEY, JSON.stringify(log));
  } catch {}
  window.dispatchEvent(new Event("jm:log"));
  return log;
}

// Consecutive days ending today, or ending yesterday if today is still open.
export function streakOf(log) {
  const has = (d) => Array.isArray(log[dayKey(d)]) && log[dayKey(d)].length > 0;
  const day = new Date();
  if (!has(day)) day.setDate(day.getDate() - 1);
  let n = 0;
  while (has(day)) {
    n += 1;
    day.setDate(day.getDate() - 1);
  }
  return n;
}

// Five points a minute, ten at least for showing up.
export function pointsFor(seconds) {
  return Math.max(10, Math.round((seconds / 60) * 5));
}

export function pointsOf(log) {
  return Object.values(log)
    .flat()
    .reduce((sum, entry) => sum + pointsFor(entry.s || 0), 0);
}

export function doneToday(log) {
  const today = log[dayKey()];
  return Array.isArray(today) && today.length > 0;
}
