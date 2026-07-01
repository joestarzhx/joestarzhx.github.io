export function ProjectImageFallback({ title }: { title: string }) {
  return (
    <div className="grid size-full place-items-center bg-[var(--surface-muted)] p-6">
      <div className="text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--surface-solid)] text-xl font-semibold text-[var(--accent)]">
          HZ
        </div>
        <p className="mt-4 text-sm font-medium text-[var(--text-secondary)]">{title}</p>
      </div>
    </div>
  );
}
