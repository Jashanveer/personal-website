"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

type Row = {
  years: string;
  role: string;
  org: string;
  tags: string[];
};

const rows: Row[] = [
  {
    years: "Feb 2026 - Present",
    role: "Software Developer",
    org: "onAir Tech Corporation · Remote",
    tags: ["React", "JavaScript", "WordPress", "Content", "Admin workflows"],
  },
  {
    years: "Apr 2023 - Dec 2023",
    role: "Senior Software Engineer L1",
    org: "Gemini Solutions Pvt. Ltd. · PIMCO",
    tags: ["Java", "Spring", "Oracle", "SQL", "Code reviews"],
  },
  {
    years: "Apr 2022 - Mar 2023",
    role: "Software Engineer L2",
    org: "Gemini Solutions Pvt. Ltd. · Clovek Wealth",
    tags: ["REST APIs", "SOAP", "Angular", "SQL", "40% faster"],
  },
  {
    years: "Apr 2021 - Mar 2022",
    role: "Software Engineer L1",
    org: "Gemini Solutions Pvt. Ltd. · Contripoint",
    tags: ["Spring Boot", "Angular", "Python", "SQL", "15+ tickets"],
  },
  {
    years: "Apr 2020 - Mar 2021",
    role: "Technical Trainee",
    org: "Gemini Solutions Pvt. Ltd.",
    tags: ["Spring Boot", "REST APIs", "Angular", "SQL", "Git"],
  },
];

export default function Experience() {
  return (
    <section id="about" className="relative w-full px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeading eyebrow="Track record" title="Experience & Skills" />

        {/* Timeline — vertical dashed line down the left side; each entry's
            circle marker sits on the line. The line draws in as you scroll. */}
        <div className="relative mt-16 pl-8 md:pl-12">
          {/* Static line (full height) — sits behind the markers */}
          <div
            aria-hidden
            className="absolute bottom-2 left-3 top-2 w-px bg-ink/15 md:left-5"
          />
          {/* Animated overlay line — grows from top to bottom as section scrolls in */}
          <motion.div
            aria-hidden
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ originY: 0 }}
            className="absolute bottom-2 left-3 top-2 w-px origin-top bg-ink md:left-5"
          />

          {rows.map((r, i) => (
            <motion.div
              key={r.years}
              initial={{ opacity: 0, x: 24, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{
                duration: 0.9,
                delay: 0.15 + i * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative grid grid-cols-1 gap-2 py-8 first:pt-0 last:pb-0 md:grid-cols-[180px_1fr_auto] md:items-center md:gap-8"
            >
              {/* Marker dot — sits on the line. The outer ring is the
                  "current" highlight; only the first row gets the pulse. */}
              <span
                aria-hidden
                className="absolute -left-[26px] top-9 z-10 inline-flex size-3.5 items-center justify-center md:-left-[34px]"
              >
                {i === 0 ? (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-ink/30" />
                ) : null}
                <span className="relative inline-flex size-3 rounded-full border-2 border-cream bg-ink shadow-[0_0_0_1px_rgba(20,17,14,0.15)]" />
              </span>

              <span className="font-sans text-[13px] font-medium tracking-tight text-ink/55">
                {r.years}
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-xl uppercase tracking-tight text-ink lg:text-2xl">
                  {r.role}
                </h3>
                <span className="font-serif text-base italic text-ink/65">{r.org}</span>
              </div>
              <ul className="flex flex-wrap gap-1.5 md:justify-end">
                {r.tags.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-ink/15 px-2.5 py-0.5 text-[11px] font-medium text-ink/70"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
