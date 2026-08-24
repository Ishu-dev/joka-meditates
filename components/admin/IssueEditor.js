"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const EMPTY = {
  slug: "",
  number: "",
  title: "",
  subtitle: "",
  published_at: "",
  content: "[]",
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export default function IssueEditor() {
  const [issues, setIssues] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("issues")
      .select("slug, number, title, subtitle, published_at")
      .order("number", { ascending: false });
    if (error) {
      setError(`Could not load issues: ${error.message}. Does the issues table exist? Run supabase/schema.sql.`);
      return;
    }
    setIssues(data || []);
  }

  function newIssue() {
    setError(null);
    setForm({ ...EMPTY, content: JSON.stringify([{ type: "lede", text: "" }], null, 2) });
  }

  function editIssue(issue) {
    setError(null);
    setStatus(null);
    const supabase = getSupabaseBrowserClient();
    supabase
      .from("issues")
      .select("*")
      .eq("slug", issue.slug)
      .single()
      .then(({ data }) => {
        if (!data) return;
        setForm({
          ...data,
          published_at: data.published_at ? data.published_at.slice(0, 16) : "",
          content: JSON.stringify(data.content || [], null, 2),
        });
      });
  }

  async function save(publish) {
    setBusy(true);
    setError(null);
    setStatus(null);
    const supabase = getSupabaseBrowserClient();

    let blocks;
    try {
      blocks = JSON.parse(form.content);
      if (!Array.isArray(blocks)) throw new Error("content must be a JSON array");
    } catch (e) {
      setError(`Content JSON invalid: ${e.message}`);
      setBusy(false);
      return;
    }

    const row = {
      slug: form.slug.trim(),
      number: form.number ? Number(form.number) : null,
      title: form.title.trim(),
      subtitle: form.subtitle.trim() || null,
      content: blocks,
      published_at: publish
        ? new Date().toISOString()
        : form.published_at
          ? new Date(form.published_at).toISOString()
          : null,
    };

    const { error } = await supabase
      .from("issues")
      .upsert(row, { onConflict: "slug" });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setStatus(publish ? "Published." : row.published_at ? "Saved (scheduled)." : "Saved as draft.");
    setForm(null);
    load();
  }

  async function unpublish(slug) {
    const supabase = getSupabaseBrowserClient();
    await supabase.from("issues").update({ published_at: null }).eq("slug", slug);
    load();
  }

  async function remove(slug) {
    if (!confirm(`Delete issue ${slug}? This cannot be undone.`)) return;
    const supabase = getSupabaseBrowserClient();
    await supabase.from("issues").delete().eq("slug", slug);
    load();
  }

  return (
    <div>
      {!form && (
        <button
          type="button"
          onClick={newIssue}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90 transition-opacity"
        >
          New issue
        </button>
      )}

      {error && (
        <p className="mt-4 rounded-card border border-accent/40 bg-accent-soft/40 p-4 text-sm text-ink">
          {error}
        </p>
      )}
      {status && <p className="mt-4 text-sm text-deep">{status}</p>}

      {form ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save(false);
          }}
          className="mt-4 space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-ink-soft">Number</span>
              <input
                type="number"
                min="1"
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                className="mt-1 w-full rounded-card border border-rule bg-paper px-3 py-2 text-ink"
              />
            </label>
            <label className="block text-sm">
              <span className="text-ink-soft">Slug (unique)</span>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="issue-05"
                className="mt-1 w-full rounded-card border border-rule bg-paper px-3 py-2 text-ink"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="text-ink-soft">Title</span>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({
                  ...f,
                  title,
                  slug: f.slug ? f.slug : slugify(title),
                }));
              }}
              className="mt-1 w-full rounded-card border border-rule bg-paper px-3 py-2 text-ink"
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink-soft">Subtitle</span>
            <input
              type="text"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="mt-1 w-full rounded-card border border-rule bg-paper px-3 py-2 text-ink"
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink-soft">
              Content (JSON blocks, same schema as the seed issues)
            </span>
            <textarea
              rows={14}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="mt-1 w-full rounded-card border border-rule bg-paper px-3 py-2 font-mono text-xs text-ink"
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-deep px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {busy ? "Saving..." : "Save draft"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => save(true)}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-paper hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Publish now
            </button>
            <button
              type="button"
              onClick={() => setForm(null)}
              className="rounded-full border border-rule px-5 py-2.5 text-sm text-ink-soft hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <ul className="mt-4 space-y-2">
          {issues.map((issue) => (
            <li
              key={issue.slug}
              className="flex flex-wrap items-center gap-3 rounded-card border border-rule p-4"
            >
              <span className="text-xs uppercase tracking-widest text-deep">
                {issue.number ? `#${issue.number}` : "#"}
              </span>
              <span className="flex-1 font-medium text-ink">{issue.title}</span>
              <span
                className={`text-xs ${issue.published_at ? "text-deep" : "text-accent"}`}
              >
                {issue.published_at ? "published" : "draft"}
              </span>
              <button
                type="button"
                onClick={() => editIssue(issue)}
                className="text-sm text-link hover:text-accent"
              >
                Edit
              </button>
              {issue.published_at && (
                <button
                  type="button"
                  onClick={() => unpublish(issue.slug)}
                  className="text-sm text-ink-soft hover:text-accent"
                >
                  Unpublish
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(issue.slug)}
                className="text-sm text-ink-soft hover:text-accent"
              >
                Delete
              </button>
            </li>
          ))}
          {issues.length === 0 && !error && (
            <li className="rounded-card border border-rule p-4 text-sm text-ink-soft">
              No issues in the database yet. The four seed issues live in code
              until you add them here.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
