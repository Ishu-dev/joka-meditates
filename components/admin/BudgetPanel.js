"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

const CAP = 37000;

export default function BudgetPanel() {
  const [items, setItems] = useState([]);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const supabase = getSupabaseBrowserClient();
    const { data, error } = await supabase
      .from("budget_items")
      .select("*")
      .order("added_at", { ascending: false });
    if (error) {
      setError(`Could not load budget: ${error.message}. Does the budget_items table exist? Run supabase/schema.sql.`);
      return;
    }
    setItems(data || []);
  }

  async function addItem(e) {
    e.preventDefault();
    if (!label.trim() || !amount) return;
    setBusy(true);
    setError(null);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase
      .from("budget_items")
      .insert({ label: label.trim(), amount: Number(amount), category: category.trim() || null });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setLabel("");
    setAmount("");
    setCategory("");
    load();
  }

  async function removeItem(id) {
    const supabase = getSupabaseBrowserClient();
    await supabase.from("budget_items").delete().eq("id", id);
    load();
  }

  const total = items.reduce((sum, item) => sum + Number(item.amount), 0);
  const remaining = CAP - total;
  const pct = Math.min(100, Math.round((total / CAP) * 100));

  return (
    <div>
      <div className="rounded-card border border-rule bg-deep-soft/30 p-5">
        <div className="flex items-baseline justify-between">
          <p className="text-sm text-ink-soft">Total spent</p>
          <p className="font-display text-3xl text-ink tabular-nums">
            ₹{total.toLocaleString("en-IN")}
            <span className="text-base text-ink-soft"> / ₹{CAP.toLocaleString("en-IN")}</span>
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          {remaining >= 0 ? `₹${remaining.toLocaleString("en-IN")} remaining` : "Over budget"}
        </p>
      </div>

      <form onSubmit={addItem} className="mt-5 grid gap-3 sm:grid-cols-[1fr_120px_1fr_auto]">
        <input
          type="text"
          required
          placeholder="What was it for"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="rounded-card border border-rule bg-paper px-3 py-2 text-sm text-ink"
        />
        <input
          type="number"
          required
          min="1"
          step="0.01"
          placeholder="₹ amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-card border border-rule bg-paper px-3 py-2 text-sm text-ink"
        />
        <input
          type="text"
          placeholder="Category (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-card border border-rule bg-paper px-3 py-2 text-sm text-ink"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-deep px-5 py-2 text-sm font-medium text-paper hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-card border border-accent/40 bg-accent-soft/40 p-4 text-sm text-ink">
          {error}
        </p>
      )}

      <ul className="mt-5 space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-card border border-rule p-4 text-sm"
          >
            <span className="flex-1 text-ink">{item.label}</span>
            {item.category && (
              <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs text-ink-soft">
                {item.category}
              </span>
            )}
            <span className="tabular-nums text-ink">
              ₹{Number(item.amount).toLocaleString("en-IN")}
            </span>
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-ink-soft hover:text-accent"
              aria-label={`Delete ${item.label}`}
            >
              ✕
            </button>
          </li>
        ))}
        {items.length === 0 && !error && (
          <li className="rounded-card border border-rule p-4 text-sm text-ink-soft">
            No line items yet.
          </li>
        )}
      </ul>
    </div>
  );
}
