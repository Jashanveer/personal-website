"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

export default function ThemeSlider() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Sync from <html> data-theme that ThemeScript already set
  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme) || "light";
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore quota errors
    }
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
        transition={{ duration: 0.7, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-full w-full items-center justify-center text-cream"
          >
            {isDark ? <Moon size={16} strokeWidth={2} /> : <Sun size={16} strokeWidth={2} />}
          </motion.span>
        </motion.span>
      </motion.button>
    </div>
  );
}
