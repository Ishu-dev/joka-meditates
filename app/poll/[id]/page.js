import { notFound } from "next/navigation";
import { getPoll } from "@/data/polls";
import PollForm from "@/components/PollForm";

// A poll the club sent by mail. Not in the sitemap and not indexed: the names
// on it are people from campus, and the page only matters to those who got
// the mail.
export function generateMetadata({ params }) {
  const poll = getPoll(params.id);
  if (!poll) return {};
  return { title: poll.title, description: poll.intro, robots: { index: false, follow: false } };
}

export default function PollPage({ params }) {
  const poll = getPoll(params.id);
  if (!poll) notFound();
  return (
    <section className="band page-top">
      <div className="wrap stack">
        <h1 className="head head--wide">{poll.title}</h1>
        <p className="lead">{poll.intro}</p>
        <PollForm id={params.id} poll={poll} />
      </div>
    </section>
  );
}
