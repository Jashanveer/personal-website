"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const services = [
  {
    n: "01",
    title: "Web Apps",
    body: "Modern React + Next.js stacks. TypeScript, Tailwind, server components, and the boring-good practices that keep teams shipping.",
    tools: ["React", "Next.js", "TypeScript"],
  },
  {
    n: "02",
    title: "Native Apple",
    body: "iOS and macOS apps that feel native because they are. SwiftUI, SwiftData, HealthKit, FoundationModels, Liquid Glass.",
    tools: ["Swift", "SwiftUI", "SwiftData"],
  },
  {
    n: "03",
    title: "Backend Systems",
    body: "Spring Boot APIs, Postgres at scale, legacy modernization without breaking SLAs. Reviewed 30+ PRs/month at Gemini.",
    tools: ["Spring Boot", "PostgreSQL", "Hibernate"],
  },
  {
    n: "04",
    title: "Cloud Native",
    body: "AWS deployments, Docker + Kubernetes, CI/CD pipelines that don't break on Friday. Performance monitoring and scaling without surprises.",
    tools: ["AWS", "Docker", "Kubernetes", "CI/CD"],
  },
  {
    n: "05",
    title: "AI Integrations",
    body: "Wiring REST + LLM endpoints into product surfaces. On-device with Apple's FoundationModels, server-side with the usual suspects.",
    tools: ["REST", "LLM APIs", "On-device AI"],
  },
];

export default function Services() {
  return (
    <section id="services" className="relative w-full px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1500px]">
        <SectionHeading eyebrow="What I do" title="I Can Build" />

        <div className="mt-16 grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {services.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="relative border-t border-ink/15 pt-6"
            >
              <span className="absolute -top-1 right-0 font-sans text-[13px] font-light text-ink/30">
                {s.n}
              </span>
              <h3 className="font-display text-xl uppercase tracking-tight text-ink lg:text-2xl">
                {s.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink/75">{s.body}</p>
              <ul className="mt-4 flex flex-wrap gap-1.5">
                {s.tools.map((t) => (
                  <li
                    key={t}
                    className="text-[11px] font-medium tracking-tight text-ink/55"
                  >
                    · {t}
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
