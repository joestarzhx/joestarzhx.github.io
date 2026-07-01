export function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
}) {
  return (
    <div className="mb-10 max-w-[760px]">
      {eyebrow ? <p className="mb-3 text-sm font-medium text-[var(--accent)]">{eyebrow}</p> : null}
      <h2 className="text-3xl font-semibold leading-tight tracking-normal sm:text-5xl">{title}</h2>
      {text ? <p className="mt-4 max-w-[680px] text-lg leading-8 text-[var(--text-secondary)]">{text}</p> : null}
    </div>
  );
}
