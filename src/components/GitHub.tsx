"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import GitHubIcon from "./icons/GitHubIcon";
import GitHubHeatmap from "./GitHubHeatmap";

type Repo = {
  name: string;
  description: string;
  language: string;
  href: string;
};

/** Hand-picked from github.com/Jashanveer — the active, portfolio-worthy ones. */
const repos: Repo[] = [
  {
    name: "earthlens",
    description: "Native macOS source for the Earth Lens menu-bar app.",
    language: "Swift",
    href: "https://github.com/Jashanveer/earthlens",
  },
  {
    name: "rung-ios",
    description: "iOS + iPadOS client for the Rung habit tracker.",
    language: "Swift",
    href: "https://github.com/Jashanveer/rung-ios",
  },
  {
    name: "rung-macos",
    description: "macOS client for Rung — same SwiftData store as iOS.",
    language: "Swift",
    href: "https://github.com/Jashanveer/rung-macos",
  },
  {
    name: "rung-backend",
    description: "Spring Boot service that syncs Rung data across devices.",
    language: "Java",
    href: "https://github.com/Jashanveer/rung-backend",
  },
  {
    name: "earthlens-website",
    description: "Marketing site for Earth Lens (live at earth-lens.netlify.app).",
    language: "JavaScript",
    href: "https://github.com/Jashanveer/earthlens-website",
  },
  {
    name: "Chat-app",
    description: "Real-time chat over Socket.IO with lightweight rooms.",
    language: "JavaScript",
    href: "https://github.com/Jashanveer/Chat-app",
  },
];

export default function GitHubSection() {
  return (
    <section className="relative w-full px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeading eyebrow="Open-source" title="On GitHub" />

        {/* Contribution heatmap — last year of activity, served as SVG by
            ghchart.rshah.org. Wrapped in a glass card so it sits on the
            ambient gradient instead of a hard white block. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 overflow-hidden rounded-3xl border border-white/40 bg-white/35 p-6 shadow-[0_20px_50px_-25px_rgba(20,17,14,0.35),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-2xl backdrop-saturate-150 lg:p-10 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]"
        >
          <div className="flex flex-col gap-2 pb-6">
            <span className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink/55">
              Last year of contributions
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
          <GitHubHeatmap username="Jashanveer" />
        </motion.div>

        {/* Featured repos */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {repos.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-2 rounded-2xl border border-white/35 bg-white/25 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-400 ease-out hover:-translate-y-1 hover:border-white/60 hover:bg-white/40 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] dark:hover:bg-white/[0.06]"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-sans text-[13px] font-semibold text-ink">
                    <GitHubIcon size={14} className="size-3.5" />
                    {r.name}
                  </span>
                  <ArrowUpRight
                    className="size-4 text-ink/45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
                    aria-hidden
                  />
                </div>
                <p className="text-[13px] leading-relaxed text-ink/70">
                  {r.description}
                </p>
                <span className="mt-auto pt-2 text-[11px] font-medium uppercase tracking-[0.15em] text-ink/45">
                  · {r.language}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
