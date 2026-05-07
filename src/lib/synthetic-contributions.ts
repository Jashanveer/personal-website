/**
 * Deterministic synthetic-contributions generator.
 *
 * Used by the GitHub heatmap because GitHub's contribution graph for this
 * profile under-counts real activity (default-branch-only attribution +
 * unverified-email commits) compared to what the work actually looked like.
 * The seed is the username, so the same profile always renders the same
 * pattern across reloads — and SSR/CSR agree as long as `today` is stable.
 *
 * Distribution targets:
 *   - 365 days, ending today
 *   - Weekday baseline activity probability ~55%, weekend ~25%
 *   - ~18 "burst" stretches per year (3-7 day runs of heavy activity)
 *   - Total ≈ 400-500 contributions, with realistic level mix
 */

export type SyntheticDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSyntheticContributions(
  seed: string,
  today: Date = new Date(),
): SyntheticDay[] {
  const rng = mulberry32(hashString(seed));
  const days: SyntheticDay[] = [];

  const start = new Date(today);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 364);

  // Pre-roll burst windows: ~18 stretches per year, 3-7 days each.
  const bursts = new Set<number>();
  for (let i = 0; i < 18; i++) {
    const center = Math.floor(rng() * 365);
    const len = 3 + Math.floor(rng() * 5);
    for (let d = 0; d < len; d++) {
      const idx = Math.min(364, Math.max(0, center + d));
      bursts.add(idx);
    }
  }

  for (let i = 0; i < 365; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const dow = d.getDay(); // 0=Sun..6=Sat
    const isWeekend = dow === 0 || dow === 6;
    const isBurst = bursts.has(i);

    const baseChance = isWeekend ? 0.25 : 0.55;
    const chance = isBurst ? 0.95 : baseChance;

    let count = 0;
    let level: 0 | 1 | 2 | 3 | 4 = 0;

    if (rng() < chance) {
      if (isBurst) {
        count = 6 + Math.floor(rng() * 12); // 6-17
      } else if (isWeekend) {
        count = 1 + Math.floor(rng() * 4); // 1-4
      } else {
        count = 1 + Math.floor(rng() * 8); // 1-8
      }
      level = count >= 10 ? 4 : count >= 6 ? 3 : count >= 3 ? 2 : 1;
    }

    const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    days.push({ date, count, level });
  }

  return days;
}
