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
    years: "2026 – Now",
    role: "Software Developer",
    org: "onAir Tech Corporation · Remote",
    tags: ["React", "JavaScript", "REST APIs", "AWS", "AI/ML collab"],
  },
  {
    years: "2024 – 2025",
    role: "M.S. Computer Science",
    org: "George Mason University · GPA 3.7",
    tags: ["Algorithms", "OS", "Compilers", "Distributed", "Data Mining"],
  },
  {
    years: "2023",
    role: "Software Engineer L2 · PIMCO Consultant",
    org: "Gemini Solutions",
    tags: ["Java", "Spring", "Oracle", "Legacy modernization", "30+ PRs/mo"],
  },
  {
    years: "2022 – 2023",
    role: "Software Engineer L1 · Clovek Wealth",
    org: "Gemini Solutions",
    tags: ["Angular", "REST/SOAP", "SQL", "+40% response time"],
  },
  {
    years: "2021 – 2022",
    role: "Technical Trainee",
    org: "Gemini Solutions · Built Contripoint + Cyber-Simulation",
    tags: ["Python", "Spring Boot", "$23K saved/yr"],
  },
];

export default function Experience() {
  return (
    <section id="about" className="relative w-full px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeading eyebrow="Track record" title="Experience & Skills" />

        <div className="mt-16">
          {rows.map((r, i) => (
            <motion.div
              key={r.years}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 gap-2 border-t border-ink/15 py-8 md:grid-cols-[180px_1fr_auto] md:items-center md:gap-8"
            >
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
