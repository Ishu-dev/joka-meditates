import AsanaSequence from "@/components/guides/AsanaSequence";
import GuideEnd from "@/components/guides/GuideEnd";

export const metadata = {
  title: "14-Pose Yoga Guide",
  description:
    "The 14-pose sequence from our Yoga Day session, one pose at a time, with a count for five easy breaths in each.",
};

export default function YogaPosesPage() {
  return (
    <>
      <section className="band page-top">
        <div className="wrap stack">
          <h1 className="head head--wide">Fourteen poses, in order.</h1>
          <p className="lead">
            The sequence from our Yoga Day session. Hold each pose for five easy breaths. Headstands only with a
            teacher around.
          </p>
        </div>
      </section>

      <AsanaSequence />

      <GuideEnd current="/practice/yoga-poses">
        <h2 className="head">Two more guides.</h2>
        <p className="lead">Guides from our sessions, free to use anywhere.</p>
      </GuideEnd>
    </>
  );
}
