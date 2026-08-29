"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Lotus3D = dynamic(() => import("@/components/Lotus3D"), {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="mx-auto flex h-64 items-center justify-center sm:h-72"
    >
      <div className="h-32 w-32 rounded-full bg-accent/20 blur-xl animate-pulse" />
    </div>
  ),
});

export default function Lotus3DGate() {
  const [reduced, setReduced] = useState(false);
  const [inView, setInView] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    setReduced(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  return (
    <div ref={ref}>
      {!reduced ? (
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
