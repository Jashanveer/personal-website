"use client";

import { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

/** GitHub-style contribution palette (light theme). */
const COLORS = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"] as const;
const DARK_COLORS = ["#1d1d1d", "#0e4429", "#006d32", "#26a641", "#39d353"] as const;

const CELL = 12; // size of each cell in px
const GAP = 3; // gap between cells
const ROW_H = CELL + GAP;
const RX = 2.5; // corner radius — rounded, not square

export default function GitHubHeatmap({ username }: { username: string }) {
  const [days, setDays] = useState<Day[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Scroll progress through the heatmap card. We write the value directly to
  // a CSS variable on the SVG via ref — keeps React out of the per-frame loop.
  // Each colored cell carries a `--threshold` (its column position 0..1) and
  // uses a CSS calc to opacity-in and pop-and-settle once the wave reaches it.
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 0.85", "center 0.45"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    svgRef.current?.style.setProperty("--gh-reveal", String(v));
  });

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: { contributions: Day[] }) => setDays(data.contributions))
      .catch((e: Error) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => controller.abort();
  }, [username]);

  if (error) {
    return (
      <div ref={cardRef} className="text-[13px] text-ink/55">
        Couldn&apos;t load contributions ({error}). View on{" "}
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          GitHub
        </a>
        .
      </div>
    );
  }

  if (!days) {
    return (
      <div
        ref={cardRef}
        className="rounded-2xl bg-ink/5 dark:bg-white/[0.04]"
        style={{ height: ROW_H * 7 + 30 }}
        aria-label="Loading contributions"
      />
    );
  }

  // Group days into weeks. The API returns days in chronological order; we
  // bucket by ISO week-of-year so each column is one week (Sun → Sat).
  const weeks: Day[][] = [];
  let current: Day[] = [];
  // Pad the first week so the first column starts on the correct day-of-week
  const firstDay = new Date(days[0].date).getDay();
  for (let i = 0; i < firstDay; i++) {
    current.push({ date: "", count: 0, level: 0 });
  }
  for (const d of days) {
    current.push(d);
    if (current.length === 7) {
      weeks.push(current);
      current = [];
    }
  }
  if (current.length) weeks.push(current);

  const width = weeks.length * ROW_H + 2;
  const height = ROW_H * 7 + 2;
  const total = days.reduce((acc, d) => acc + d.count, 0);
  const totalCols = weeks.length;

  return (
    <div ref={cardRef} className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block min-w-full text-ink"
          role="img"
          aria-label={`${total} contributions in the last year`}
        >
          {/* Base layer — gray cells, always visible. The colored layer fades
              over the top of these as the user scrolls. */}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (!day.date) return null;
              return (
                <rect
                  key={`base-${wi}-${di}`}
                  x={wi * ROW_H + 1}
                  y={di * ROW_H + 1}
                  width={CELL}
                  height={CELL}
                  rx={RX}
                  ry={RX}
                  className="dark:hidden"
                  style={{ fill: COLORS[0] }}
                />
              );
            }),
          )}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (!day.date) return null;
              return (
                <rect
                  key={`base-d-${wi}-${di}`}
                  x={wi * ROW_H + 1}
                  y={di * ROW_H + 1}
                  width={CELL}
                  height={CELL}
                  rx={RX}
                  ry={RX}
                  className="hidden dark:block"
                  style={{ fill: DARK_COLORS[0] }}
                />
              );
            }),
          )}

          {/* Reveal layer — colored cells that fade in column by column. */}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (!day.date || day.level === 0) return null;
              const threshold = wi / totalCols;
              return (
                <rect
                  key={`fg-${wi}-${di}`}
                  x={wi * ROW_H + 1}
                  y={di * ROW_H + 1}
                  width={CELL}
                  height={CELL}
                  rx={RX}
                  ry={RX}
                  className="gh-reveal-cell dark:hidden"
                  style={
                    {
                      fill: COLORS[day.level],
                      "--threshold": threshold,
                    } as React.CSSProperties
                  }
                >
                  <title>{`${day.date}: ${day.count} contributions`}</title>
                </rect>
              );
            }),
          )}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (!day.date || day.level === 0) return null;
              const threshold = wi / totalCols;
              return (
                <rect
                  key={`fg-d-${wi}-${di}`}
                  x={wi * ROW_H + 1}
                  y={di * ROW_H + 1}
                  width={CELL}
                  height={CELL}
                  rx={RX}
                  ry={RX}
                  className="gh-reveal-cell hidden dark:block"
                  style={
                    {
                      fill: DARK_COLORS[day.level],
                      "--threshold": threshold,
                    } as React.CSSProperties
                  }
                >
                  <title>{`${day.date}: ${day.count} contributions`}</title>
                </rect>
              );
            }),
          )}
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] font-medium text-ink/55">
        <span>{total.toLocaleString()} contributions in the last year</span>
        <div className="flex items-center gap-1.5">
          <span>Less</span>
          {COLORS.map((c) => (
            <span
              key={c}
              className="block size-2.5 rounded-[2.5px] dark:hidden"
              style={{ backgroundColor: c }}
              aria-hidden
            />
          ))}
          {DARK_COLORS.map((c, i) => (
            <span
              key={`d-${c}-${i}`}
              className="hidden size-2.5 rounded-[2.5px] dark:block"
              style={{ backgroundColor: c }}
              aria-hidden
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
