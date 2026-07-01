import Link from "next/link";
import type { Post } from "@/types/content";
import { Badge } from "@/components/ui/Badge";
import { ProjectImage } from "@/components/project/ProjectImage";
import { estimateReadingTime, formatArchiveDate } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="focus-ring group grid gap-5 rounded-[18px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 transition-transform hover:-translate-y-1 sm:grid-cols-[180px_1fr]"
    >
      <ProjectImage
        src={post.cover}
        alt={`${post.title} 文章封面`}
        title={post.title}
        sizes="(max-width: 640px) 100vw, 180px"
        className="relative aspect-[16/10] overflow-hidden rounded-[14px] bg-[var(--surface-muted)] sm:aspect-square"
        imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
      />
      <div className="py-1">
        <div className="flex flex-wrap gap-2">
          <Badge>{post.category}</Badge>
          <Badge>{estimateReadingTime(post)}</Badge>
        </div>
        <h2 className="mt-4 text-2xl font-semibold leading-tight">{post.title}</h2>
        <p className="mt-3 leading-7 text-[var(--text-secondary)]">{post.description}</p>
        {post.date ? <p className="mt-5 text-sm text-[var(--text-tertiary)]">{formatArchiveDate(post.date)}</p> : null}
      </div>
    </Link>
  );
}
