"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Lotus3D = dynamic(() => import("@/components/Lotus3D"), { ssr: false });

export default function Lotus3DGate() {
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "120px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {inView && !reduced ? (
        <Lotus3D />
      ) : (
        <div
          aria-hidden="true"
          className="mx-auto flex h-64 items-center justify-center sm:h-72"
        >
          <div className="h-32 w-32 rounded-full bg-accent/15 blur-xl" />
        </div>
      )}
    </div>
  );
}
