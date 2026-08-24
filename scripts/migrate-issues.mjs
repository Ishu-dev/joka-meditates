import { readFileSync, writeFileSync, existsSync } from "fs";
import * as cheerio from "cheerio";

const DEFAULT_PHASES = [
  { label: "Inhale", duration: 4, scale: 1.25 },
  { label: "Exhale", duration: 6, scale: 0.85 },
];

function parsePhasesArray(raw) {
  try {
    const jsonified = raw
      .replace(/([{,]\s*)([a-zA-Z_]\w*)\s*:/g, '$1"$2":')
      .replace(/'/g, '"')
      .replace(/,(\s*[}\]])/g, "$1");
    const parsed = JSON.parse(jsonified);
    return parsed
      .filter((p) => p && p.label && Number(p.duration) > 0)
      .map((p) => ({
        label: String(p.label),
        duration: Number(p.duration),
        scale: Number(p.scale) || 1,
        tone: p.tone ? Number(p.tone) : undefined,
        cue: p.cue ? String(p.cue) : p.side ? String(p.side) : undefined,
      }));
  } catch (e) {
    console.log("  [phases parse failed]", e.message.slice(0, 80));
    return null;
  }
}

function extractPhasesFromScripts(html) {
  const phasesList = [];
  const re =
    /(createBreatheWidget\(\s*'[^']+'\s*,\s*'[^']+'\s*,\s*'[^']+'\s*,|(\w*[pP]hases)\s*=)\s*(\[[\s\S]*?\])\s*[\);]/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const phases = parsePhasesArray(m[3]);
    if (phases && phases.length) phasesList.push(phases);
  }
  return phasesList;
}

function extractDate($) {
  const text = $("body").text();
  const m = text.match(
    /(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+(\d{4})/i
  );
  if (m) {
    const months = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
    const d = new Date(Date.UTC(Number(m[3]), months[m[2].toLowerCase()], Number(m[1])));
    return d.toISOString();
  }
  return null;
}

function walk($, $el, out, ctx, depth) {
  if (depth > 8) return;
  $el.children().each((_, node) => {
    const $e = $(node);
    const tag = (node.tagName || "").toLowerCase();
    const cls = $e.attr("class") || "";
    const text = $e.text().replace(/\s+/g, " ").trim();

    if (tag === "footer" || tag === "script" || tag === "style" || tag === "noscript") return;
    if (cls.includes("issue-badge") || cls.includes("sound-toggle") || cls.includes("logo")) return;

    if (/^h[123]$/.test(tag) && !cls) {
      out.push({ type: tag === "h3" ? "subheading" : "heading", text });
      return;
    }
    if (cls.includes("lede")) {
      out.push({ type: "lede", text });
      return;
    }
    if (cls.includes("section-intro")) {
      out.push({ type: "text", text });
      return;
    }
    if (cls.includes("pull-quote")) {
      out.push({ type: "quote", text });
      return;
    }
    if (cls.includes("callout") || cls.includes("footer-note") || cls.includes("reminder-strip")) {
      out.push({ type: "note", text });
      return;
    }
    if (cls.includes("breathe-wrap")) {
      const phases = ctx.phasesList.shift() || DEFAULT_PHASES;
      out.push({ type: "breathing", phases, cycles: 4 });
      return;
    }
    if (cls.includes("timer-wrap")) {
      const attr = $e.attr("data-seconds");
      const seconds = attr ? Number(attr) : 60;
      out.push({
        type: "timer",
        seconds: Number.isFinite(seconds) && seconds > 0 ? seconds : 60,
        label: "Timer",
      });
      return;
    }
    if (cls.includes("playlist")) {
      const href = $e.attr("href");
      const title = $e.find(".playlist-title, .card-title").first().text().trim() || text.slice(0, 60);
      const meta = $e.find(".playlist-meta, .card-body").first().text().replace(/\s+/g, " ").trim();
      if (href) {
        out.push({ type: "playlist", title, meta, href });
        return;
      }
    }
    if (cls.includes("card") && !cls.includes("card-body") && !cls.includes("card-title")) {
      const href = $e.find("a[href]").attr("href");
      const title = $e.find(".card-title").text().trim() || $e.find("a").first().text().trim();
      const meta = $e.find(".card-body").text().replace(/\s+/g, " ").trim();
      if (href) {
        out.push({ type: "playlist", title: title || "Playlist", meta, href });
        return;
      }
    }
    if (cls.includes("anchor-list")) {
      const items = [];
      $e.find(".anchor-text").each((_, t) =>
        items.push($(t).text().replace(/\s+/g, " ").trim())
      );
      if (items.length) {
        out.push({ type: "list", items });
        return;
      }
    }
    if (cls.includes("num-list") || tag === "ol" || tag === "ul") {
      const items = [];
      $e.find("li").each((_, t) => {
        const v = $(t).text().replace(/\s+/g, " ").trim();
        if (v) items.push(v);
      });
      if (items.length) {
        out.push({ type: "list", items });
        return;
      }
    }
    if (cls.includes("track")) {
      const items = [];
      $e.find(".track-labels span, .track-labels div").each((_, t) => {
        const v = $(t).text().replace(/\s+/g, " ").trim();
        if (v) items.push(v);
      });
      if (items.length) out.push({ type: "list", items });
      return;
    }
    if (cls.includes("verse")) {
      out.push({
        type: "verse",
        source: $e.find("[class*='source']").first().text().trim() || undefined,
        devanagari:
          $e.find("[lang='sa'], [class*='devanagari'], [class*='sans']").first().text().trim() ||
          undefined,
        transliteration:
          $e.find("[class*='translit']").first().text().trim() || undefined,
        sense:
          $e.find("[class*='sense'], [class*='meaning']").first().text().trim() ||
          text ||
          undefined,
      });
      return;
    }
    if (tag === "img") {
      const src = $e.attr("src") || "";
      if (src && !src.startsWith("data:")) {
        out.push({ type: "image", src, alt: $e.attr("alt") || "" });
      }
      return;
    }
    if (cls.includes("rule") || tag === "hr") {
      out.push({ type: "divider" });
      return;
    }
    if (tag === "p" || cls.includes("prose-block")) {
      if (text) out.push({ type: "text", text });
      return;
    }
    if (
      tag === "div" || tag === "section" || tag === "header" ||
      tag === "main" || tag === "article" || tag === "figure"
    ) {
      walk($, $e, out, ctx, depth + 1);
      return;
    }
    if (text && depth <= 2) {
      console.log(`  [unmatched] <${tag} class="${cls}"> ${text.slice(0, 60)}`);
    }
  });
}

const issues = [];

for (let n = 1; n <= 4; n++) {
  const file = `docs/reference-issues/issue-0${n}.html`;
  if (!existsSync(file)) continue;
  const html = readFileSync(file, "utf8");
  const $ = cheerio.load(html);

  const titleTag = $("title").text().trim();
  const h1 = $("h1").text().replace(/\s+/g, " ").trim();
  let title = h1 || titleTag.split("·")[0].trim() || `Issue 0${n}`;
  if (/^joka meditates/i.test(title)) {
    const fromTag = titleTag.split("·")[0].replace(/,?\s*Joka Meditates.*$/i, "").trim();
    title = fromTag || `Issue 0${n}`;
  }

  const subtitle = $(".issue-sub").first().text().replace(/\s+/g, " ").trim() || null;
  const phasesList = extractPhasesFromScripts(html);

  let root = $(".issue");
  if (!root.children().length) root = $(".wrap");
  if (!root.length) root = $("body");

  const blocks = [];
  walk($, root, blocks, { phasesList }, 0);

  issues.push({
    slug: `issue-0${n}`,
    number: n,
    title,
    subtitle,
    published_at: extractDate($),
    content: blocks,
  });

  const counts = blocks.reduce((acc, b) => {
    acc[b.type] = (acc[b.type] || 0) + 1;
    return acc;
  }, {});
  console.log(
    `issue-0${n}: "${title}" blocks=${blocks.length}`,
    JSON.stringify(counts),
    `phasesFound=${phasesList.length}`
  );
}

writeFileSync("data/seed-issues.json", JSON.stringify(issues, null, 2) + "\n");
console.log(`wrote data/seed-issues.json (${issues.length} issues)`);
