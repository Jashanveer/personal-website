"use client";

import { motion } from "framer-motion";

export default function AvailabilityPill() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-2.5 rounded-full border border-white/50 bg-white/45 px-4 py-2.5 shadow-[0_10px_28px_-10px_rgba(20,17,14,0.3),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/15 dark:bg-white/[0.06] dark:shadow-[0_10px_28px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.1)]"
    >
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
      </span>
      <span className="text-[13px] font-medium tracking-tight text-ink">
        Available for new opportunities
      </span>
    </motion.div>
  );
}
