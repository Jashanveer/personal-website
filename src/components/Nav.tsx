"use client";

import { useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { EASE, INTRO_HANDOFF } from "@/lib/motion";
import { cn } from "@/lib/cn";
import Magnetic from "./Magnetic";

const links = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "Experience" },
  { href: "#beyond", label: "Beyond" },
];

export default function Nav() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // setState only fires when a boolean actually flips, so this is a
  // threshold toggle, not a per-frame re-render. Reduced motion never hides.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    const nextHidden = !reduce && y > 480 && y > prev;
    if (nextHidden !== hidden) setHidden(nextHidden);
    const nextScrolled = y > 32;
    if (nextScrolled !== scrolled) setScrolled(nextScrolled);
  });

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? "-115%" : "0%" }}
      transition={{ duration: 0.5, ease: EASE }}
      className="fixed inset-x-0 top-0 z-50 px-6 pt-5 lg:px-10 lg:pt-6"
    >
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: EASE,
          delay: reduce ? 0 : INTRO_HANDOFF + 0.2,
        }}
        className={cn(
          "mx-auto flex max-w-[1600px] items-center justify-between gap-4 rounded-2xl border transition-[background-color,border-color,box-shadow,padding] duration-500",
          scrolled
            ? "border-white/40 bg-white/40 px-5 py-2.5 shadow-[0_10px_28px_-10px_rgba(20,17,14,0.25),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-white/[0.05] dark:shadow-[0_10px_28px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]"
            : "border-transparent bg-transparent shadow-none",
        )}
      >
        <Link
          href="#top"
          className="font-serif text-2xl italic tracking-tight text-ink lg:text-3xl"
        >
          Jashanveer Singh.
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink/80 transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Magnetic strength={0.15} className="inline-flex">
          <Link
            href="#contact"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-transform hover:scale-[0.97]"
          >
            Contact
          </Link>
        </Magnetic>
      </motion.div>
    </motion.header>
  );
}
