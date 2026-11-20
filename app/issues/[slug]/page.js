import Link from "next/link";
import { notFound } from "next/navigation";
import IssueBlock from "@/components/IssueBlock";
import { getIssue, getSeedSlugs } from "@/lib/issues";

export async function generateStaticParams() {
  return getSeedSlugs();
}

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
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
    <article>
      <header className="band page-top">
        <div className="wrap stack-s">
          <h1 className="head head--wide">{issue.title}</h1>
          {issue.subtitle && <p className="lead">{issue.subtitle}</p>}
          <p className="note">
            {issue.number ? `Issue ${issue.number}` : "Issue"}
            {issue.published_at ? `, ${formatDate(issue.published_at)}` : ""}
          </p>
        </div>
      </header>
      <section className="band issue-band" aria-label="The issue">
        <div className="wrap issue">
          <div className="issue__body">
            {blocks.map((block, i) => (
              <IssueBlock key={i} block={block} />
            ))}
          </div>
          <footer className="issue__foot">
            <Link className="go" href="/issues">
              All issues
            </Link>
          </footer>
        </div>
      </section>
    </article>
  );
}
