"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Chanchal is a delight, never a dependency: he loads after the page is idle
// and stays out of the shared bundle.
const Chanchal = dynamic(() => import("./Chanchal"), { ssr: false });

export default function ChanchalGate() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const start = () => setReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 700 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(start, 350);
    return () => window.clearTimeout(id);
  }, []);

  return ready ? <Chanchal /> : null;
}
