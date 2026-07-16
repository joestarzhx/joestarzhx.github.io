export function SectionHeading({
  eyebrow,
  title,
  text,
  className,
  spacing = "normal",
  level = 2,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  className?: string;
  spacing?: "none" | "compact" | "normal";
  level?: 1 | 2;
}) {
  const spacingClass = {
    none: "mb-0",
    compact: "mb-6",
    normal: "mb-10",
  }[spacing];

  const Heading = level === 1 ? "h1" : "h2";

  return (
    <div className={`${spacingClass} max-w-[760px] ${className ?? ""}`}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-medium text-[var(--accent)]">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-3xl font-semibold leading-[1.18] tracking-normal sm:text-5xl sm:leading-[1.15]">
        {title}
      </Heading>
      {text ? (
        <p className="mt-4 max-w-[680px] text-lg leading-8 text-[var(--text-secondary)]">
          {text}
        </p>
      ) : null}
    </div>
  );
}
