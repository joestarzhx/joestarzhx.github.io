import type { PostHeading } from "@/types/content";

export function TableOfContents({ headings }: { headings: PostHeading[] }) {
  return (
    <aside className="hidden xl:block">
      <div className="sticky top-28 rounded-[22px] border border-[var(--border)] p-5">
        <p className="mb-4 text-sm font-medium">目录</p>
        <nav className="grid gap-3 text-sm text-[var(--text-secondary)]">
          {headings.map((heading) => (
            <a
              className={
                heading.depth === 3
                  ? "pl-3 hover:text-[var(--text-primary)]"
                  : "hover:text-[var(--text-primary)]"
              }
              href={`#${heading.id}`}
              key={heading.id}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
