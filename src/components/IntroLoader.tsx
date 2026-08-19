"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, EASE_IN_OUT, INTRO_HANDOFF } from "@/lib/motion";

const WORDMARK = "Jashanveer Singh.";

/** First-load intro overlay. Server-rendered visible on purpose: it covers the
 *  page before hydration so nothing flashes underneath. The wordmark rises
 *  letter by letter from behind a mask, then at INTRO_HANDOFF the whole
 *  curtain lifts off-screen and the component unmounts itself. Purely
 *  decorative; never renders under prefers-reduced-motion. */
export default function IntroLoader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  // Reduced motion: no intro at all. The motion-reduce:hidden class below
  // covers the server-rendered first frame before this hook resolves.
  if (reduce || done) return null;

  return (
    <motion.div
      aria-hidden
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ delay: INTRO_HANDOFF, duration: 0.75, ease: EASE_IN_OUT }}
      onAnimationComplete={() => setDone(true)}
      className="fixed inset-0 z-[110] flex items-center justify-center bg-cream motion-reduce:hidden"
    >
      {/* Drift wrapper doubles as the overflow mask. The pb/-mb pair extends
          the clip region downward so the italic descenders (J, g, h) are not
          shaved off while the letters rise. */}
      <motion.div
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: -40, opacity: 0 }}
        transition={{ delay: INTRO_HANDOFF, duration: 0.75, ease: EASE_IN_OUT }}
        className="-mb-[0.15em] overflow-hidden pb-[0.15em]"
      >
        <span className="block font-serif text-[clamp(28px,5vw,56px)] italic leading-none tracking-tight text-ink">
          {WORDMARK.split("").map((char, i) => (
            <motion.span
              key={`${char}-${i}`}
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{
                delay: 0.15 + i * 0.03,
                duration: 0.8,
                ease: EASE,
              }}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </span>
      </motion.div>
    </motion.div>
  );
}
