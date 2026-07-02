import { projects } from "@/data/projects";
import type { Post } from "@/types/content";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function getAdjacentBySlug<T extends { slug: string }>(
  items: T[],
  slug: string,
) {
  const index = items.findIndex((item) => item.slug === slug);
  return {
    previous: index > 0 ? items[index - 1] : undefined,
    next: index >= 0 && index < items.length - 1 ? items[index + 1] : undefined,
  };
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function estimateReadingTime(post: Post) {
  const text = `${post.title}${post.description}${post.content}`.replace(
    /[#*_[\]()`~|>-]/g,
    "",
  );
  const minutes = Math.max(1, Math.ceil(text.length / 500));
  return `${minutes} min`;
}

export function formatArchiveDate(date: string) {
  return date.replaceAll("-", ".");
}
