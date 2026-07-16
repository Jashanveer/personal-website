"use client";

import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

const services = [
  {
    n: "01",
    title: "Java Backend",
    body: "Spring Boot services with Spring Security, JPA/Hibernate, REST and SOAP integrations, and production-minded error handling.",
    tools: ["Java", "Spring Boot", "Spring Security"],
  },
  {
    n: "02",
    title: "Data & Realtime",
    body: "Relational data design and performance work across PostgreSQL, Oracle, MySQL, Redis, Flyway, and server-sent events.",
    tools: ["PostgreSQL", "Oracle", "Redis"],
  },
  {
    n: "03",
    title: "Full Stack",
    body: "React and JavaScript features, Angular modules, and WordPress-backed workflows that connect resilient services to useful interfaces.",
    tools: ["React", "JavaScript", "Angular"],
  },
  {
    n: "04",
    title: "Cloud Native",
    body: "Dockerized applications and dependable deployment pipelines using AWS, Jenkins, GitHub Actions, Kubernetes, and CI/CD.",
    tools: ["AWS", "Docker", "Kubernetes", "Jenkins"],
  },
  {
    n: "05",
    title: "AI Integrations",
    body: "Typed Anthropic and OpenAI integrations with Pydantic validation, provider selection, prompt caching, and cost telemetry.",
    tools: ["Anthropic API", "OpenAI", "Pydantic"],
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
