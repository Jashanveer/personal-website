"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useTransform } from "framer-motion";

type Stat = {
  /** Target numeric value used for the count-up. */
  to: number;
  /** Optional suffix appended to the rendered number ("+", "K", etc.). */
  suffix?: string;
  /** Optional prefix ("$", etc.). */
  prefix?: string;
  label: string;
};

const stats: Stat[] = [
  { to: 4, suffix: "+", label: "Years\nshipping" },
  { to: 30, suffix: "+", label: "PRs reviewed\nper month" },
  { to: 23, prefix: "$", suffix: "K", label: "Saved with\nin-house tools" },
  { to: 1, label: "Patent\nfiled" },
];

export default function Stats() {
  return (
    <section className="relative w-full px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-t border-ink/15 pt-16 md:grid-cols-4">
          {stats.map((s, i) => (
            <StatCard key={s.label} stat={s} delay={i * 0.07} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, delay }: { stat: Stat; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, stat.to, {
      duration: 1.6,
      delay,
      ease: [0.16, 1, 0.3, 1],
    });
    return controls.stop;
  }, [inView, stat.to, delay, count]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-2"
    >
      <span className="flex items-baseline font-display text-[clamp(56px,8vw,120px)] leading-none tracking-tight text-ink">
        {stat.prefix ? <span>{stat.prefix}</span> : null}
        <motion.span>{rounded}</motion.span>
        {stat.suffix ? <span>{stat.suffix}</span> : null}
      </span>
      <span className="whitespace-pre-line text-[13px] uppercase tracking-[0.15em] text-ink/55">
        {stat.label}
      </span>
    </motion.div>
  );
}
