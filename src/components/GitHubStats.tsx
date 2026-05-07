"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Language = {
  name: string;
  color: string | null;
  bytes: number;
  percent: number;
};

type Stats = {
  publicRepos: number;
  followers: number;
  totalStars: number;
  topLanguage: string | null;
  languages: Language[];
  mostRecentRepo: {
    name: string;
    description: string | null;
    pushedAt: string;
    language: string | null;
  } | null;
};

export default function GitHubStats({ username }: { username: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/github-stats?username=${encodeURIComponent(username)}`, {
      signal: controller.signal,
    })
      .then(async (r) => {
        if (!r.ok) {
          const j = (await r.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error ?? `HTTP ${r.status}`);
        }
        return r.json();
      })
      .then((data: Stats) => setStats(data))
      .catch((e: Error) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => controller.abort();
  }, [username]);

  if (error) {
    return (
      <div className="text-[13px] text-ink/55">
        Couldn&apos;t load stats ({error}). View on{" "}
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

  if (!stats) {
    return (
      <div
        className="h-32 rounded-2xl bg-ink/5 dark:bg-white/[0.04]"
        aria-label="Loading stats"
      />
    );
  }

  const tiles: Array<{ value: string; label: string }> = [
    { value: stats.publicRepos.toString(), label: "Public repos" },
    { value: stats.totalStars.toString(), label: "Stars earned" },
    { value: stats.followers.toString(), label: "Followers" },
    { value: stats.topLanguage ?? "—", label: "Top language" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {tiles.map((tile, i) => (
          <motion.div
            key={tile.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.6,
              delay: i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="rounded-2xl border border-white/35 bg-white/25 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-xl backdrop-saturate-150 dark:border-white/10 dark:bg-white/[0.03] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          >
            <div className="font-display text-3xl uppercase tracking-tight text-ink md:text-4xl">
              {tile.value}
            </div>
            <div className="mt-1 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-ink/55">
              {tile.label}
            </div>
          </motion.div>
        ))}
      </div>

      {stats.languages.length > 0 && (
        <LanguagesChart languages={stats.languages} />
      )}

      {stats.mostRecentRepo && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[13px] text-ink/65"
        >
          <span className="font-sans font-medium uppercase tracking-[0.18em] text-ink/45">
            Most recent
          </span>
          <span className="font-sans font-semibold text-ink">
            {stats.mostRecentRepo.name}
          </span>
          <span className="text-ink/55">
            updated {formatRelative(stats.mostRecentRepo.pushedAt)}
          </span>
        </motion.div>
      )}
    </div>
  );
}

function LanguagesChart({ languages }: { languages: Language[] }) {
  // Renormalize percentages over only the top-N we display so bars sum to 100%.
  const shown = languages.slice(0, 6);
  const sum = shown.reduce((acc, l) => acc + l.percent, 0);
  const normalized = shown.map((l) => ({
    ...l,
    pct: sum > 0 ? l.percent / sum : 0,
  }));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-ink/55">
          Languages by code volume
        </span>
        <span className="font-sans text-[11px] text-ink/45">
          {shown.length} of {languages.length}
        </span>
      </div>

      {/* Single stacked bar — segments fill on scroll. */}
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-ink/5 dark:bg-white/[0.06]">
        {normalized.map((l, i) => (
          <motion.span
            key={l.name}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.9,
              delay: 0.05 * i,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="block h-full origin-left"
            style={{
              width: `${l.pct * 100}%`,
              backgroundColor: l.color ?? "#888",
            }}
            aria-hidden
          />
        ))}
      </div>

      {/* Legend with row-by-row reveal + bar fill. */}
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-3">
        {normalized.map((l, i) => (
          <motion.li
            key={l.name}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
              duration: 0.5,
              delay: 0.1 + 0.04 * i,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="flex items-center gap-2"
          >
            <span
              className="block size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: l.color ?? "#888" }}
              aria-hidden
            />
            <span className="font-sans text-ink">{l.name}</span>
            <span className="font-sans text-ink/45">
              {(l.pct * 100).toFixed(0)}%
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffSec = Math.max(1, Math.round((now - then) / 1000));
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH} hour${diffH === 1 ? "" : "s"} ago`;
  const diffD = Math.round(diffH / 24);
  if (diffD < 30) return `${diffD} day${diffD === 1 ? "" : "s"} ago`;
  const diffMo = Math.round(diffD / 30);
  if (diffMo < 12) return `${diffMo} month${diffMo === 1 ? "" : "s"} ago`;
  const diffY = Math.round(diffMo / 12);
  return `${diffY} year${diffY === 1 ? "" : "s"} ago`;
}
