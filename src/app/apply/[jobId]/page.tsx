import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Contact from "@/components/Contact";
import ThemeSlider from "@/components/ThemeSlider";

interface Application {
  job_id: string;
  company: string;
  role: string;
  generated_at: string;
}

async function loadApplications(): Promise<Application[]> {
  try {
    const raw = await fs.readFile(
      path.join(process.cwd(), "data", "applications.json"),
      "utf-8"
    );
    return JSON.parse(raw) as Application[];
  } catch {
    return [];
  }
}

export async function generateStaticParams() {
  const apps = await loadApplications();
  return apps.map((a) => ({ jobId: a.job_id }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const apps = await loadApplications();
  const app = apps.find((a) => a.job_id === jobId);
  if (!app) {
    return { title: "Jashanveer Singh — Application" };
  }
  return {
    title: `Jashanveer Singh — ${app.role} @ ${app.company}`,
    description: `Hello from Jashanveer Singh. You found me through my application for ${app.role} at ${app.company}.`,
  };
}

export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  const apps = await loadApplications();
  const app = apps.find((a) => a.job_id === jobId);
  if (!app) notFound();

  return (
    <main className="relative min-h-screen bg-cream">
      <Nav />

      <section className="relative px-6 pt-32 pb-24 lg:px-10 lg:pt-44">
        <div className="mx-auto max-w-[1500px]">
          <span className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink/55">
            Hello there
          </span>

          <h1 className="mt-6 font-serif italic leading-[0.92] text-ink text-[clamp(48px,9vw,160px)]">
            You scanned
            <br />
            <span className="font-display not-italic uppercase tracking-[-0.025em]">
              the QR.
            </span>
          </h1>

          <p className="mt-12 max-w-3xl text-base leading-relaxed text-ink/75 lg:text-lg">
            You found me through my application for{" "}
            <span className="font-medium text-ink">{app.role}</span> at{" "}
            <span className="font-medium text-ink">{app.company}</span>. If you
            were curious enough to scan, you&apos;re probably the kind of person
            I&apos;d want to work with — so here&apos;s the fuller picture.
          </p>

          <p className="mt-6 max-w-3xl text-base leading-relaxed text-ink/75 lg:text-lg">
            I&apos;m Jashanveer Singh, a software engineer focused on backend
            systems and Apple platforms. Currently shipping at onAir Tech and
            building Rung and EarthLens on the side. The resume below has the
            specifics — happy to walk through any of them in a quick call.
          </p>

          <div className="mt-12 flex flex-wrap gap-3">
            <a
              href="/resume.pdf"
              download={`Jashanveer_Singh_Resume.pdf`}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-display text-sm uppercase tracking-wider text-cream transition hover:opacity-90"
            >
              Download Resume
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-ink/30 px-7 py-3.5 font-display text-sm uppercase tracking-wider text-ink transition hover:border-ink hover:bg-ink hover:text-cream"
            >
              See full portfolio
            </Link>
            <a
              href="mailto:mailforjashanveer@gmail.com"
              className="inline-flex items-center gap-2 rounded-full border border-ink/30 px-7 py-3.5 font-display text-sm uppercase tracking-wider text-ink transition hover:border-ink hover:bg-ink hover:text-cream"
            >
              Email me
            </a>
          </div>
        </div>
      </section>

      <Contact />
      <ThemeSlider />
    </main>
  );
}
