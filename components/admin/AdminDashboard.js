"use client";

import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import IssueEditor from "./IssueEditor";
import BudgetPanel from "./BudgetPanel";

export default function AdminDashboard({ email }) {
  const [tab, setTab] = useState("issues");

  async function signOut() {
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl text-ink">Organizer dashboard</h1>
          <p className="text-sm text-ink-soft">{email}</p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="rounded-full border border-rule px-4 py-2 text-sm text-ink-soft hover:text-accent hover:border-accent transition-colors"
        >
          Sign out
        </button>
      </div>

      <div className="mt-6 flex gap-2 border-b border-rule">
        {[
          { id: "issues", label: "Issues" },
          { id: "budget", label: "Budget" },
        ].map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              tab === id
                ? "border-b-2 border-accent text-accent"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-6">{tab === "issues" ? <IssueEditor /> : <BudgetPanel />}</div>
    </div>
  );
}
