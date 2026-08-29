"use client";

import { useEffect, useRef } from "react";
import { animate, stagger, svg } from "animejs";

export default function HeroOrnament() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const paths = ref.current?.querySelectorAll(".draw");
    if (!paths?.length) return;
    const drawables = svg.createDrawable(paths);
    const anim = animate(drawables, {
      draw: ["0 0", "0 1"],
      duration: 2800,
      delay: stagger(220),
      ease: "inOutSine",
      loop: true,
      loopDelay: 600,
    });
    return () => anim.pause();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <svg
        viewBox="0 0 400 400"
        className="h-[130%] w-auto max-w-none opacity-[0.16]"
        fill="none"
      >
        <circle className="draw" cx="200" cy="200" r="190" stroke="var(--deep)" strokeWidth="1" />
        <circle className="draw" cx="200" cy="200" r="150" stroke="var(--accent)" strokeWidth="1" />
        <circle className="draw" cx="200" cy="200" r="105" stroke="var(--deep)" strokeWidth="1" />
        <circle className="draw" cx="200" cy="200" r="60" stroke="var(--accent)" strokeWidth="1" />
        <path
          className="draw"
          d="M200 40 C170 90 170 130 200 160 C230 130 230 90 200 40 Z"
          stroke="var(--accent)"
          strokeWidth="1.2"
        />
        <path
          className="draw"
          d="M200 360 C170 310 170 270 200 240 C230 270 230 310 200 360 Z"
          stroke="var(--accent)"
          strokeWidth="1.2"
        />
        <path
          className="draw"
          d="M40 200 C90 170 130 170 160 200 C130 230 90 230 40 200 Z"
          stroke="var(--deep)"
          strokeWidth="1.2"
        />
        <path
          className="draw"
          d="M360 200 C310 170 270 170 240 200 C270 230 310 230 360 200 Z"
          stroke="var(--deep)"
          strokeWidth="1.2"
        />
      </svg>
    </div>
  );
}
