"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { EASE, INTRO_HANDOFF } from "@/lib/motion";

type Theme = "light" | "dark";

// Minimal View Transitions API surface, only what the wipe needs
type DocumentWithViewTransition = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

export default function ThemeSlider() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  // Sync from <html> data-theme that ThemeScript already set
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const current =
        (document.documentElement.dataset.theme as Theme) || "light";
      setTheme(current);
      setMounted(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    const apply = () => {
      setTheme(next);
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {
        // ignore quota errors
      }
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const doc = document as DocumentWithViewTransition;
    if (reducedMotion || !doc.startViewTransition) {
      apply();
      return;
    }

    // Circular wipe: globals.css drives the clip-path via
    // html.theme-wipe::view-transition-new(root)
    document.documentElement.classList.add("theme-wipe");
    doc
      .startViewTransition(() => apply())
      .finished.finally(() => {
        document.documentElement.classList.remove("theme-wipe");
      });
  };

  // Avoid hydration mismatch — render the track but defer the thumb position
  // until we've read the actual value
  const isDark = mounted ? theme === "dark" : false;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center md:bottom-8">
      <motion.button
        type="button"
        onClick={toggle}
        aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: reduce ? 1.2 : INTRO_HANDOFF + 0.9,
          ease: EASE,
        }}
        className="pointer-events-auto group relative flex h-12 w-[112px] items-center justify-between rounded-full border border-white/50 bg-white/40 px-3 shadow-[0_10px_32px_-12px_rgba(20,17,14,0.35),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 transition-colors hover:bg-white/55 dark:border-white/12 dark:bg-white/[0.06] dark:shadow-[0_10px_32px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)] dark:hover:bg-white/[0.1]"
      >
        {/* track icons */}
        <Sun
          size={16}
          strokeWidth={1.75}
          aria-hidden
          className="text-ink/45 transition-opacity group-hover:text-ink/65"
        />
        <Moon
          size={16}
          strokeWidth={1.75}
          aria-hidden
          className="text-ink/45 transition-opacity group-hover:text-ink/65"
        />

        {/* thumb */}
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="absolute top-1 size-10 rounded-full bg-ink/95 shadow-[0_4px_14px_-2px_rgba(0,0,0,0.4)]"
          style={{
            left: isDark ? "calc(100% - 44px)" : "4px",
          }}
        >
          <motion.span
            key={theme}
            initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="flex h-full w-full items-center justify-center text-cream"
          >
            {isDark ? <Moon size={16} strokeWidth={2} /> : <Sun size={16} strokeWidth={2} />}
          </motion.span>
        </motion.span>
      </motion.button>
    </div>
  );
}
