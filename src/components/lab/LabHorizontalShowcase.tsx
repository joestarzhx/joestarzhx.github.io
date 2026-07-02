import { ProjectImage } from "@/components/project/ProjectImage";
import type { labItems } from "@/data/lab";

type LabItem = (typeof labItems)[number];

export function LabHorizontalShowcase({ items }: { items: LabItem[] }) {
  return (
    <section className="w-full min-w-0 max-w-full">
      <div className="mb-5 flex min-w-0 items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--accent)]">Experiments</p>
          <h2 className="mt-2 text-3xl font-semibold">实验轨道</h2>
        </div>
        <p
          className="hidden shrink-0 text-sm text-[var(--text-secondary)] lg:block"
          data-progress-label={`01 / ${String(items.length).padStart(2, "0")}`}
        >
          01 / {String(items.length).padStart(2, "0")}
        </p>
      </div>
      <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, index) => (
          <article
            className="min-w-0 rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[var(--shadow-soft)]"
            data-lab-card
            data-active={index === 0}
            key={item.title}
          >
            <ProjectImage
              src={item.preview}
              alt={`${item.title} 实验预览`}
              title={item.title}
              sizes="(max-width: 640px) calc(100vw - 36px), (max-width: 1024px) 50vw, 25vw"
              className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-[14px] bg-[var(--surface-muted)]"
              imageClassName="object-cover"
              unoptimized
            />
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              {item.type} · {item.year}
            </p>
            <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
