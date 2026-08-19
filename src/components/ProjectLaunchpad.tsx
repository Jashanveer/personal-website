"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/lib/projects";
import { EASE } from "@/lib/motion";

const SPRING = {
  type: "spring",
  stiffness: 430,
  damping: 30,
  mass: 0.72,
  bounce: 0,
} as const;

export default function ProjectLaunchpad() {
  const reduce = useReducedMotion();

  return (
    <section id="work" className="relative w-full px-6 py-24 lg:px-10 lg:py-36">
      <div className="mx-auto max-w-[1500px]">
        <div className="max-w-2xl">
          <h2 className="font-display text-4xl uppercase tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Selected projects
          </h2>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink/65 sm:text-base">
            Open any project to explore the live product.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 lg:grid-cols-3 lg:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="h-full"
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.65,
                delay: reduce ? 0 : index * 0.08,
                ease: EASE,
              }}
            >
              <ProjectTile project={project} index={index} reduce={Boolean(reduce)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectTile({
  project,
  index,
  reduce,
}: {
  project: Project;
  index: number;
  reduce: boolean;
}) {
  if (!project.href) return null;

  const hostname = new URL(project.href).hostname.replace(/^www\./, "");
  const hoverRotation = index === 0 ? -0.8 : index === 2 ? 0.8 : 0;

  return (
    <motion.a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${project.name} website in a new tab`}
      whileHover={
        reduce
          ? undefined
          : {
              y: -14,
              scale: 1.035,
              rotate: hoverRotation,
            }
      }
      whileTap={reduce ? undefined : { scale: 0.985, y: -4 }}
      transition={SPRING}
      className="group relative flex h-full min-h-[390px] transform-gpu flex-col overflow-hidden rounded-[28px] border border-ink/10 bg-cream-deep/55 p-6 shadow-[0_22px_55px_-40px_rgba(42,37,32,0.65),inset_0_1px_0_rgba(255,255,255,0.55)] outline-none backdrop-blur-xl focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-4 focus-visible:ring-offset-cream dark:border-white/10 dark:bg-white/[0.035] dark:shadow-[0_24px_60px_-38px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] sm:min-h-[420px] sm:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70 transition-opacity duration-300 ease-out group-hover:opacity-100 motion-reduce:transition-none dark:opacity-45 dark:group-hover:opacity-65"
        style={{
          background: `radial-gradient(circle at 18% 8%, ${project.accent}45 0%, ${project.accent}16 34%, transparent 66%)`,
        }}
      />

      <div className="relative flex items-start justify-between gap-6">
        <div
          aria-hidden
          className="size-24 shrink-0 rounded-[23%] bg-cover bg-center shadow-[0_22px_42px_-18px_rgba(24,20,17,0.55)] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-2 group-hover:scale-[1.07] motion-reduce:transform-none motion-reduce:transition-none sm:size-28"
          style={{ backgroundImage: `url(${project.icon})` }}
        />

        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-cream/45 text-ink transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transform-none motion-reduce:transition-none dark:border-white/15 dark:bg-white/[0.06]">
          <ArrowUpRight className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
      </div>

      <div className="relative mt-auto pt-14">
        <h3 className="font-display text-3xl uppercase tracking-tight text-ink sm:text-4xl">
          {project.name}
        </h3>
        <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-ink/68">
          {project.tagline}
        </p>
        <div className="mt-7 flex items-center justify-between gap-4 border-t border-ink/12 pt-4 text-[12px] font-medium text-ink/58">
          <span>{hostname}</span>
          <span className="whitespace-nowrap text-ink/75">Visit website</span>
        </div>
      </div>
    </motion.a>
  );
}
