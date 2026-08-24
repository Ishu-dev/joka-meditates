import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getIssues } from "@/lib/issues";

export const metadata = {
  title: "Issues",
  description:
    "Every issue of the Joka Meditates newsletter: one practice, one verse, one small experiment in stillness.",
};

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function IssuesPage() {
  const issues = await getIssues();
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <header className="text-center">
        <h1 className="font-display text-4xl text-ink">The Issues</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-soft">
          Twice a week, one practice, one verse, one small experiment in
          stillness. Start anywhere.
        </p>
      </header>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {issues.map((issue, i) => (
          <Reveal as="li" key={issue.slug} delay={i * 60}>
            <Link
              href={`/issues/${issue.slug}`}
              className="group flex h-full flex-col rounded-card border border-rule bg-paper p-6 transition-colors hover:border-accent"
            >
              <span className="text-xs uppercase tracking-widest text-deep">
                {issue.number ? `Issue ${issue.number}` : "Issue"}
              </span>
              <span className="font-display mt-2 text-2xl leading-snug text-ink group-hover:text-accent transition-colors">
                {issue.title}
              </span>
              {issue.subtitle && (
                <span className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {issue.subtitle}
                </span>
              )}
              <span className="mt-auto pt-4 text-xs text-ink-soft">
                {formatDate(issue.published_at)}
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}
