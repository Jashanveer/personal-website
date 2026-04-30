"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Award,
  Dumbbell,
  Footprints,
  Lightbulb,
  Mountain,
  Music2,
  Trophy,
} from "lucide-react";
import SectionHeading from "./SectionHeading";

type Item = {
  icon: typeof Lightbulb;
  year: string;
  title: string;
  body: string;
  /** Optional external link. When set, the card becomes clickable. */
  href?: string;
};

const items: Item[] = [
  {
    icon: Lightbulb,
    year: "2019",
    title: "Patent · Anti-Theft System for Vehicles",
    body: "Filed at Chitkara CURIN. Arduino + GPS tracking with mobile-app control.",
    href: "https://curin.chitkara.edu.in/patents/antitheft-system-for-a-vehicle/",
  },
  {
    icon: Award,
    year: "2024",
    title: "Zolve Visionary Leader",
    body: "Recognized for academic excellence, leadership, and community service.",
    // href: "https://...", // ← paste the Zolve announcement URL here
  },
  {
    icon: Trophy,
    year: "2022",
    title: "On the Spot Award · Gemini Solutions",
    body: "Awarded for exceptional project performance.",
  },
];

type Hobby = {
  icon: typeof Lightbulb;
  label: string;
  body: string;
};

const hobbies: Hobby[] = [
  {
    icon: Footprints,
    label: "Running",
    body: "Long, slow miles to think things through.",
  },
  {
    icon: Mountain,
    label: "Hiking",
    body: "Weekend trails — the longer the better.",
  },
  {
    icon: Dumbbell,
    label: "Gym",
    body: "Lifting four-ish days a week, mostly compounds.",
  },
  {
    icon: Music2,
    label: "Dancing",
    body: "Bhangra basics + whatever the song asks for.",
  },
];

export default function BeyondCode() {
  return (
    <section id="beyond" className="relative w-full px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeading eyebrow="The other stuff" title="Beyond Code" />

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {items.map((it, i) => (
            <Card key={it.title} item={it} delay={i * 0.07} />
          ))}
        </div>

        {/* Hobbies — what I do when I'm not at a keyboard. */}
        <div className="mt-20">
          <span className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink/55">
            Outside the keyboard
          </span>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
            {hobbies.map((h, i) => {
              const Icon = h.icon;
              return (
                <motion.div
                  key={h.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  className="group flex flex-col gap-3 rounded-2xl border border-white/40 bg-white/30 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl backdrop-saturate-150 transition-transform duration-400 ease-out hover:-translate-y-1 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
                >
                  <Icon className="size-6 text-ink" strokeWidth={1.6} aria-hidden />
                  <h4 className="font-display text-base uppercase tracking-tight text-ink">
                    {h.label}
                  </h4>
                  <p className="text-[13px] leading-relaxed text-ink/70">{h.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ item, delay }: { item: Item; delay: number }) {
  const Icon = item.icon;
  const cardClass =
    "group relative flex flex-col gap-4 rounded-3xl border border-white/40 bg-white/30 p-8 shadow-[0_20px_50px_-25px_rgba(20,17,14,0.35),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-2xl backdrop-saturate-150 transition-all duration-500 ease-out dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_20px_50px_-25px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.08)]";
  const linkClass = item.href
    ? " hover:-translate-y-1 hover:bg-white/40 dark:hover:bg-white/[0.06]"
    : "";

  const inner = (
    <>
      <div className="flex items-center justify-between">
        <Icon className="size-7 text-ink" strokeWidth={1.5} aria-hidden />
        {item.href ? (
          <ArrowUpRight
            className="size-5 text-ink/45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-ink"
            aria-hidden
          />
        ) : null}
      </div>
      <span className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink/55">
        {item.year}
      </span>
      <h3 className="font-display text-xl uppercase tracking-tight text-ink">
        {item.title}
      </h3>
      <p className="text-[14px] leading-relaxed text-ink/75">{item.body}</p>
    </>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {item.href ? (
        <Link href={item.href} target="_blank" rel="noreferrer" className={cardClass + linkClass}>
          {inner}
        </Link>
      ) : (
        <div className={cardClass}>{inner}</div>
      )}
    </motion.div>
  );
}
