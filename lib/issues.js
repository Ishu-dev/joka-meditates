import seed from "@/data/seed-issues.json";
import { getSupabase, supabaseConfigured } from "./supabase/publicData";

function sortByNewest(list) {
  return [...list].sort((a, b) => {
    if (!a.published_at && !b.published_at) return 0;
    if (!a.published_at) return 1;
    if (!b.published_at) return -1;
    return new Date(b.published_at) - new Date(a.published_at);
  });
}

export async function getIssues() {
  const supabase = getSupabase();
  if (supabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("issues")
      .select("slug, number, title, subtitle, published_at")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false });
    if (!error && data && data.length > 0) {
      return data;
    }
  }
  return sortByNewest(seed).map(({ content, ...meta }) => meta);
}

export async function getIssue(slug) {
  const supabase = getSupabase();
  if (supabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from("issues")
      .select("slug, number, title, subtitle, published_at, content")
      .eq("slug", slug)
      .maybeSingle();
    if (!error && data && data.published_at) {
      return data;
    }
  }
  return seed.find((issue) => issue.slug === slug) || null;
}

export function getSeedSlugs() {
  return seed.map((issue) => ({ slug: issue.slug }));
}
