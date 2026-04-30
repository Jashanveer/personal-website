"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/** A soft lilac/peach blob that follows the cursor with spring physics.
 *  Mounted once at page root, fixed-position behind every section so the
 *  whole site feels like a single "alive" surface. */
export default function MouseGradient() {
  const prefersReducedMotion = useReducedMotion();
  // Init both values to 0 on BOTH server and client so the first render
  // matches and React hydration is happy. We seed the real position in the
  // useEffect below.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Slower spring → buttery, doesn't whip
  const sx = useSpring(x, { stiffness: 50, damping: 22, mass: 0.9 });
  const sy = useSpring(y, { stiffness: 50, damping: 22, mass: 0.9 });

  // The blob is 900px square, so offset by half to center it on the cursor
  const offsetX = useTransform(sx, (v) => v - 450);
  const offsetY = useTransform(sy, (v) => v - 450);

  useEffect(() => {
    // Seed an initial position now that we're on the client
    x.set(window.innerWidth / 2);
    y.set(window.innerHeight / 3);
    if (prefersReducedMotion) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [prefersReducedMotion, x, y]);

  // Hidden on touch — radial blob looks weird without a hover-capable cursor
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-20 overflow-hidden"
    >
      <motion.div
        style={{ x: offsetX, y: offsetY }}
        className="absolute h-[900px] w-[900px] rounded-full opacity-90 mix-blend-multiply dark:opacity-50 dark:mix-blend-screen"
      >
        <div
          className="h-full w-full rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--color-lilac-mist) 0%, var(--color-peach) 35%, transparent 65%)",
          }}
        />
      </motion.div>

      {/* Static base wash so the page never looks empty before the spring catches up */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 90% 10%, var(--color-lilac-mist) 0%, transparent 55%)," +
            "radial-gradient(ellipse 60% 55% at 10% 90%, var(--color-peach) 0%, transparent 55%)," +
            "linear-gradient(180deg, var(--color-cream) 0%, var(--color-cream) 100%)",
        }}
      />
    </div>
  );
}
