import { NextResponse } from "next/server";

/**
 * GET /api/github-stats?username=<login>
 *
 * Aggregates a few public GitHub stats for the portfolio header tile:
 *   { publicRepos, followers, totalStars, topLanguage, mostRecentRepo }
 *
 * Uses GitHub's GraphQL API. Requires `GITHUB_TOKEN` (classic, no scopes
 * needed; or fine-grained read-only public repos + metadata) in env.
 */

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      followers { totalCount }
      repositories(
        first: 100
        ownerAffiliations: OWNER
        privacy: PUBLIC
        isFork: false
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        totalCount
        nodes {
          name
          description
          pushedAt
          stargazerCount
          primaryLanguage { name color }
          languages(first: 8, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name color }
            }
          }
        }
      }
    }
  }
`;

type LanguageNode = { name: string; color: string | null };

type RepoNode = {
  name: string;
  description: string | null;
  pushedAt: string;
  stargazerCount: number;
  primaryLanguage: LanguageNode | null;
  languages: { edges: Array<{ size: number; node: LanguageNode }> };
};

export const revalidate = 3600;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  if (!username || !/^[A-Za-z0-9-]{1,39}$/.test(username)) {
    return NextResponse.json(
      { error: "Missing or invalid username." },
      { status: 400 },
    );
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      {
        error: "Server-side GITHUB_TOKEN not set.",
        code: "NO_TOKEN",
      },
      { status: 503 },
    );
  }

  const ghRes = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "personal-website-stats",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: username } }),
    next: { revalidate: 3600 },
  });

  if (!ghRes.ok) {
    const detail = await ghRes.text().catch(() => "");
    console.error("GitHub GraphQL error", ghRes.status, detail);
    return NextResponse.json(
      { error: `GitHub API ${ghRes.status}` },
      { status: 502 },
    );
  }

  const json = (await ghRes.json()) as {
    errors?: Array<{ message: string }>;
    data?: {
      user: {
        followers: { totalCount: number };
        repositories: { totalCount: number; nodes: RepoNode[] };
      } | null;
    };
  };

  if (json.errors?.length) {
    console.error("GitHub GraphQL errors", json.errors);
    return NextResponse.json(
      { error: json.errors[0].message },
      { status: 502 },
    );
  }
  if (!json.data?.user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const { followers, repositories } = json.data.user;
  const repos = repositories.nodes;

  const totalStars = repos.reduce((acc, r) => acc + r.stargazerCount, 0);

  // Aggregate language usage by code-bytes across every repo. This reflects
  // shipped code volume rather than just repo count, so a single big Swift app
  // outweighs five tiny JS scratch repos.
  const langBytes = new Map<string, { bytes: number; color: string | null }>();
  for (const r of repos) {
    for (const { size, node } of r.languages.edges) {
      const prev = langBytes.get(node.name);
      langBytes.set(node.name, {
        bytes: (prev?.bytes ?? 0) + size,
        color: node.color ?? prev?.color ?? null,
      });
    }
  }
  const totalBytes = Array.from(langBytes.values()).reduce(
    (acc, l) => acc + l.bytes,
    0,
  );
  const languages = Array.from(langBytes.entries())
    .map(([name, { bytes, color }]) => ({
      name,
      color,
      bytes,
      percent: totalBytes > 0 ? bytes / totalBytes : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 6);

  const topLanguage = languages[0]?.name ?? null;

  const mostRecent = repos[0]
    ? {
        name: repos[0].name,
        description: repos[0].description,
        pushedAt: repos[0].pushedAt,
        language: repos[0].primaryLanguage?.name ?? null,
      }
    : null;

  return NextResponse.json({
    publicRepos: repositories.totalCount,
    followers: followers.totalCount,
    totalStars,
    topLanguage,
    languages,
    mostRecentRepo: mostRecent,
  });
}
