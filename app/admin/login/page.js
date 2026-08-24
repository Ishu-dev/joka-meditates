"use client";

import { useState } from "react";
import { getSupabaseBrowserClient, supabaseConfigured } from "@/lib/supabase/browser";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicSent, setMagicSent] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!supabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-ink">Organizer login</h1>
        <p className="mt-4 rounded-card border border-rule bg-accent-soft/40 p-5 text-sm text-ink">
          Supabase is not configured yet. Add{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
          <code className="text-xs">.env.local</code>, then restart the server.
          Full steps are in the project README.
        </p>
      </div>
    );
  }

  async function signIn(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    window.location.href = "/admin";
  }

  async function sendMagicLink(e) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    setMagicSent(true);
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <h1 className="font-display text-center text-3xl text-ink">
        Organizer login
      </h1>
      <p className="mt-2 text-center text-sm text-ink-soft">
        For Ishu and Sai Krishna only.
      </p>

      {magicSent ? (
        <p className="mt-8 rounded-card border border-rule bg-deep-soft/40 p-5 text-center text-sm text-ink">
          Magic link sent to {email}. Check your inbox.
        </p>
      ) : (
        <form onSubmit={signIn} className="mt-8 space-y-4">
          <label className="block text-sm">
            <span className="text-ink-soft">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-card border border-rule bg-paper px-4 py-2.5 text-ink"
            />
          </label>
          <label className="block text-sm">
            <span className="text-ink-soft">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-card border border-rule bg-paper px-4 py-2.5 text-ink"
            />
          </label>
          {error && <p className="text-sm text-accent">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-paper hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {busy ? "Signing in..." : "Sign in"}
          </button>
          <button
            type="button"
            onClick={sendMagicLink}
            disabled={busy || !email}
            className="w-full rounded-full border border-deep px-6 py-3 text-sm font-medium text-deep hover:bg-deep-soft transition-colors disabled:opacity-50"
          >
            Email me a magic link instead
          </button>
        </form>
      )}
    </div>
  );
}
