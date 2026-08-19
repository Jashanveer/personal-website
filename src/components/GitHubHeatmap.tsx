"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  generateSyntheticContributions,
  type SyntheticDay,
} from "@/lib/synthetic-contributions";

type MonthBlock = {
  key: string;
  label: string;
  startOffset: number; // 0=Mon..6=Sun
  cells: Array<SyntheticDay & { threshold: number }>;
};

const LEVEL_CLASS = [
  "bg-[#e8e2d6] dark:bg-[#262626]",
  "bg-[#9be9a8] dark:bg-[#0e4429]",
  "bg-[#40c463] dark:bg-[#006d32]",
  "bg-[#30a14e] dark:bg-[#26a641]",
  "bg-[#216e39] dark:bg-[#39d353]",
] as const;

const DOW_LABELS = ["M", "T", "W", "T", "F", "S", "S"] as const;

export default function GitHubHeatmap({ seed }: { seed: string }) {
  // `today` is captured after mount only — server-rendered HTML for this
  // client component would otherwise embed a server-side date that drifts
  // from the client's wall clock (causing hydration warnings on every
  // per-cell date key).
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setToday(new Date()));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const cardRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 0.9", "center 0.4"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    gridRef.current?.style.setProperty("--gh-reveal", String(v));
  });

  const computed = useMemo(() => {
    if (!today) return null;
    const days = generateSyntheticContributions(seed, today);
    const blocks = buildMonths(days, today);
    const totalCount = days.reduce((acc, d) => acc + d.count, 0);
    return { months: blocks, total: totalCount };
  }, [seed, today]);

  if (!computed) {
    return (
      <div
        ref={cardRef}
        className="h-48 rounded-2xl bg-ink/5 dark:bg-white/[0.04]"
        aria-label="Loading contributions"
      />
    );
  }

  const { months, total } = computed;

  return (
    <div ref={cardRef} className="flex flex-col gap-6">
      <div
        ref={gridRef}
        className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6"
        role="img"
        aria-label={`${total} contributions in the last 12 months`}
      >
        {months.map((mb) => (
          <div key={mb.key} className="flex flex-col gap-2">
            <h3 className="font-display text-[13px] uppercase tracking-tight text-ink">
              {mb.label}
            </h3>
            <div className="grid w-fit grid-cols-[repeat(7,14px)] gap-x-2 gap-y-2">
              {DOW_LABELS.map((l, idx) => (
                <span
                  key={`h-${mb.key}-${idx}`}
                  className="text-center font-sans text-[10px] font-medium uppercase text-ink/40"
                  aria-hidden
                >
                  {l}
                </span>
              ))}
              {mb.cells.map((cell, idx) => (
                <span
                  key={cell.date}
                  className="relative size-3.5"
                  style={
                    idx === 0
                      ? { gridColumnStart: mb.startOffset + 1 }
                      : undefined
                  }
                  title={`${cell.date}: ${cell.count} contribution${cell.count === 1 ? "" : "s"}`}
                >
                  <span
                    className={cn(
                      "absolute inset-0 rounded-full",
                      LEVEL_CLASS[0],
                    )}
                    aria-hidden
                  />
                  {cell.level > 0 && (
                    <span
                      className={cn(
                        "gh-reveal-cell absolute inset-0 rounded-full",
                        LEVEL_CLASS[cell.level],
                      )}
                      style={
                        {
                          "--threshold": cell.threshold,
                        } as React.CSSProperties
                      }
                      aria-hidden
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between text-[11px] font-medium text-ink/55">
        <span>{total.toLocaleString()} contributions in the last 12 months</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          {LEVEL_CLASS.map((c, i) => (
            <span
              key={`legend-${i}`}
              className={cn("block size-2 rounded-full", c)}
              aria-hidden
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

/** Group flat day list into 12 month blocks ending at today's month, with
 *  a per-cell threshold (0..1) for the scroll-driven reveal wave. */
function buildMonths(days: SyntheticDay[], today: Date): MonthBlock[] {
  const byDate = new Map<string, SyntheticDay>();
  for (const d of days) byDate.set(d.date, d);

  const blocks: MonthBlock[] = [];
  // Total cells we'll iterate across for threshold calc — sum of days in each
  // displayed month. Just use 365 as a stable denominator.
  let cellIndex = 0;
  const total = 365;

  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const day1Sun = new Date(year, month, 1).getDay();
    const startOffset = (day1Sun + 6) % 7;

    const cells: Array<SyntheticDay & { threshold: number }> = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const day = byDate.get(dateStr) ?? {
        date: dateStr,
        count: 0,
        level: 0 as const,
      };
      cells.push({ ...day, threshold: cellIndex / total });
      cellIndex++;
    }

    blocks.push({
      key: `${year}-${String(month + 1).padStart(2, "0")}`,
      label: monthDate.toLocaleString("en-US", { month: "short" }),
      startOffset,
      cells,
    });
  }

  return blocks;
}
