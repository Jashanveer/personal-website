import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: string;
  className?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  eyebrow,
  title,
  align = "center",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow ? (
        <span className="font-sans text-[12px] font-medium uppercase tracking-[0.2em] text-ink/55">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display uppercase leading-[0.9] tracking-[-0.02em] text-ink text-[clamp(36px,5.5vw,84px)]">
        {title}
      </h2>
    </div>
  );
}
