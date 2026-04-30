"use client";

import { useEffect, useState } from "react";

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
      <div className="text-[13px] text-ink/55">
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

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block min-w-full text-ink"
          role="img"
          aria-label={`${total} contributions in the last year`}
        >
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (!day.date) return null;
              return (
                <rect
                  key={`${wi}-${di}`}
                  x={wi * ROW_H + 1}
                  y={di * ROW_H + 1}
                  width={CELL}
                  height={CELL}
                  rx={RX}
                  ry={RX}
                  className="dark:hidden"
                  style={{ fill: COLORS[day.level] }}
                >
                  <title>{`${day.date}: ${day.count} contributions`}</title>
                </rect>
              );
            }),
          )}
          {/* Dark variant — same grid, different palette, swapped via Tailwind */}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (!day.date) return null;
              return (
                <rect
                  key={`d-${wi}-${di}`}
                  x={wi * ROW_H + 1}
                  y={di * ROW_H + 1}
                  width={CELL}
                  height={CELL}
                  rx={RX}
                  ry={RX}
                  className="hidden dark:block"
                  style={{ fill: DARK_COLORS[day.level] }}
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
          {COLORS.map((c, i) => (
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
