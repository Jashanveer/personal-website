"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import GitHubIcon from "./icons/GitHubIcon";
import GitHubStats from "./GitHubStats";
import GitHubHeatmap from "./GitHubHeatmap";

export default function GitHubSection() {
  return (
    <section className="relative w-full px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeading eyebrow="Open-source" title="On GitHub" />

        {/* Public-profile stats pulled from GitHub's GraphQL API via
            /api/github-stats, plus a synthetic-data activity heatmap. */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.96, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 overflow-hidden rounded-3xl border border-white/40 bg-white/35 p-6 shadow-[0_20px_50px_-25px_rgba(20,17,14,0.35),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-2xl backdrop-saturate-150 lg:p-10 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]"
        >
          <div className="flex flex-col gap-2 pb-6">
            <span className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink/55">
              By the numbers
            </span>
            <a
              href="https://github.com/Jashanveer"
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 self-start font-display text-xl uppercase tracking-tight text-ink hover:underline"
            >
              <GitHubIcon size={20} className="size-5" />
              @Jashanveer
              <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>
          <GitHubStats username="Jashanveer" />

          <div className="mt-12 flex flex-col gap-3 border-t border-ink/10 pt-8 dark:border-white/10">
            <span className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink/55">
              Activity in the last 12 months
            </span>
          </div>
          <div className="mt-4">
            <GitHubHeatmap seed="Jashanveer" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
