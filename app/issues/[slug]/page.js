import Link from "next/link";
import { notFound } from "next/navigation";
import IssueBlock from "@/components/IssueBlock";
import { getIssue, getSeedSlugs } from "@/lib/issues";

export async function generateStaticParams() {
  return getSeedSlugs();
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }) {
  const issue = await getIssue(params.slug);
  if (!issue) return { title: "Issue not found" };
  return { title: issue.title, description: issue.subtitle || undefined };
}

export default async function IssuePage({ params }) {
  const issue = await getIssue(params.slug);
  if (!issue) notFound();

  const blocks = issue.content || [];

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <header className="text-center">
        <p className="text-xs uppercase tracking-widest text-deep">
          {issue.number ? `Issue ${issue.number}` : "Issue"}
          {issue.published_at ? ` · ${formatDate(issue.published_at)}` : ""}
        </p>
        <h1 className="font-display mt-3 text-4xl leading-tight text-ink sm:text-5xl">
          {issue.title}
        </h1>
        {issue.subtitle && (
          <p className="mt-3 text-lg text-ink-soft">{issue.subtitle}</p>
        )}
      </header>
      <div className="mt-10">
        {blocks.map((block, i) => (
          <IssueBlock key={i} block={block} />
        ))}
      </div>
      <footer className="mt-14 border-t border-rule pt-6 text-center text-sm text-ink-soft">
        <Link href="/issues" className="text-link hover:text-accent">
          ← All issues
        </Link>
      </footer>
    </article>
  );
}
