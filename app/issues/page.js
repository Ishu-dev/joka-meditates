import Link from "next/link";
import { getIssues } from "@/lib/issues";
import Critter from "@/components/Critter";

export const metadata = {
  title: "Issues",
  description:
    "Every issue of the Joka Meditates newsletter: one practice, one verse, one small experiment in stillness.",
};

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  });
}

export default async function IssuesPage() {
  const issues = await getIssues();
  return (
    <>
      <section className="band page-top">
        <div className="wrap stack">
          <h1 className="head head--wide">The Issues</h1>
          <p className="lead">
            One practice, one verse, one small experiment in stillness each time. Start anywhere.
          </p>
        </div>
      </section>
      <section className="band field-accent cut-b" aria-label="All issues">
        <div className="critter-edge critter-edge--right critter-edge--low">
          <Critter name="snail" />
        </div>
        <div className="wrap">
          <ul className="index">
            {issues.map((issue) => (
              <li key={issue.slug}>
                <Link href={`/issues/${issue.slug}`}>
                  <span className="note">
                    {issue.number ? `Issue ${issue.number}` : "Issue"}, {formatDate(issue.published_at)}
                  </span>
                  <span className="index__name">{issue.title}</span>
                  {issue.subtitle && <span className="note">{issue.subtitle}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
