"use client";

import { Fragment, useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { cn } from "@/lib/cn";

const STACK = [
  "Java",
  "Spring Boot",
  "PostgreSQL",
  "Redis",
  "React",
  "Angular",
  "AWS",
  "TypeScript",
  "SwiftUI",
];

/** Ambient drift speed in percent of the strip per second; scroll velocity
 *  multiplies on top of this. */
const BASE_VELOCITY = 1.5;

/** Loops v into [min, max) so the strip's x can run forever without drifting
 *  off. (framer-motion does not export its own wrap helper.) */
const wrap = (min: number, max: number, v: number) =>
  min + ((((v - min) % (max - min)) + (max - min)) % (max - min));

/** One pass of the stack: alternating display/serif words with slash
 *  separators. `trailing` adds the closing separator + gap so four copies
 *  laid inline join seamlessly. */
function WordStrip({ trailing = false }: { trailing?: boolean }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-baseline gap-x-8 lg:gap-x-12",
        trailing && "pr-8 lg:pr-12",
      )}
    >
      {STACK.map((word, i) => (
        <Fragment key={word}>
          <span
            className={cn(
              i % 2 === 0
                ? "font-display uppercase tracking-tight text-ink"
                : "font-serif italic lowercase text-ink/80",
            )}
          >
            {word}
          </span>
          {trailing || i < STACK.length - 1 ? (
            <span aria-hidden className="font-serif italic text-ink/25">
              /
            </span>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}

/** The canonical velocity-marquee: a constant drift whose speed and direction
 *  bend with scroll velocity. Four identical copies of the strip wrap across
 *  -25%..0% so the loop never shows a seam. */
function VelocityRow() {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], {
    clamp: false,
  });

  // 1 drifts left-to-right reading order; flips to follow scroll direction.
  const direction = useRef(1);

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * BASE_VELOCITY * (delta / 1000);

    const factor = velocityFactor.get();
    if (factor < 0) direction.current = -1;
    else if (factor > 0) direction.current = 1;

    moveBy += direction.current * moveBy * Math.abs(factor);
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <motion.div style={{ x }} className="flex w-max will-change-transform">
      <WordStrip trailing />
      <WordStrip trailing />
      <WordStrip trailing />
      <WordStrip trailing />
    </motion.div>
  );
}

/** Scroll-velocity-reactive kinetic type strip of the tech stack. Reduced
 *  motion gets a single static, centered row; screen readers get the plain
 *  list either way. */
export default function SkillsMarquee() {
  const reduce = useReducedMotion();

  return (
    <section
      aria-label="Tech stack"
      className="overflow-hidden border-y border-ink/10 py-16 lg:py-24"
    >
      <p className="sr-only">{STACK.join(", ")}</p>
      <div
        aria-hidden
        className="overflow-hidden whitespace-nowrap text-[clamp(32px,4.5vw,72px)] leading-none"
      >
        {reduce ? (
          <div className="flex justify-center">
            <WordStrip />
          </div>
        ) : (
          <VelocityRow />
        )}
      </div>
    </section>
  );
}
