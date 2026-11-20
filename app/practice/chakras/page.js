import Link from "next/link";
import ChakraWalk from "@/components/guides/ChakraWalk";
import GuideEnd from "@/components/guides/GuideEnd";

export const metadata = {
  title: "7-Chakra Alignment Guide",
  description:
    "Seven centres from the base of the spine to the crown: where each one sits, its seed sound, and a minute of attention for each.",
};

export default function ChakrasPage() {
  return (
    <>
      <section className="band page-top">
        <div className="wrap stack">
          <h1 className="head head--wide">Seven centres, up the spine.</h1>
          <p className="lead">
            Move attention up the spine, one centre at a time. A minute each is enough. The figure lights the centre
            you are reading.
          </p>
        </div>
      </section>

      <ChakraWalk />

      <GuideEnd current="/practice/chakras" seat>
        <h2 className="head">Then sit with what remains.</h2>
        <p className="lead">The practice room has a five-minute sit, with a bell to start and a bell to end.</p>
        <div className="actions">
          <Link className="btn" href="/practice#sit-5">
            Sit for 5 minutes
          </Link>
        </div>
      </GuideEnd>
    </>
  );
}
