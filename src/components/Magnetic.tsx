"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

type Props = {
  children: React.ReactNode;
  /** Fraction of the cursor's offset from center applied on x. */
  strength?: number;
  /** Vertical pull; defaults to slightly stronger than x so the element
   *  "leans up" into the cursor. */
  strengthY?: number;
  className?: string;
};

/** Magnetic hover: the child leans toward the cursor with spring physics and
 *  snaps home on leave. Mouse-only by design; inert on touch and under
 *  prefers-reduced-motion. */
export default function Magnetic({
  children,
  strength = 0.18,
  strengthY,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * (strengthY ?? strength * 1.3));
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
