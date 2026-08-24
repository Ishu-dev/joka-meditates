import { getOrganizer } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/browser";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!supabaseConfigured) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-ink">Admin</h1>
        <p className="mt-4 rounded-card border border-rule bg-accent-soft/40 p-5 text-sm text-ink">
          Supabase is not configured. Set the environment variables and
          restart.
        </p>
      </div>
    );
  }

  const user = await getOrganizer();
  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-3xl text-ink">Admin</h1>
        <p className="mt-4 text-sm text-ink-soft">
          Session expired.{" "}
          <a href="/admin/login" className="text-link hover:text-accent">
            Sign in again
          </a>
          .
        </p>
      </div>
    );
  }

  return <AdminDashboard email={user.email} />;
}
